param(
  [Parameter(Mandatory = $true)][string]$InputPath,
  [Parameter(Mandatory = $true)][string]$OutputPath,
  [string[]]$BackgroundElementId = @(),
  [int[]]$BackgroundRootChildIndex = @(),
  [double[]]$VisibleViewBox = @()
)
$ErrorActionPreference = 'Stop'

# Reviewed library imports only. Uploaded customer SVGs use the existing upload path.
$readerSettings = [System.Xml.XmlReaderSettings]::new()
$readerSettings.DtdProcessing = [System.Xml.DtdProcessing]::Prohibit
$readerSettings.XmlResolver = $null
$readerSettings.MaxCharactersInDocument = 2000000
$raw = [System.IO.File]::ReadAllText((Resolve-Path -LiteralPath $InputPath).Path)
if ($raw -match '<!ENTITY' -or $raw -match '<!DOCTYPE[^>]*\[') { throw 'SVG entities/internal DTD rejected' }
# Legacy SVG external DTD declarations are discarded without ever resolving them.
$raw = [regex]::Replace($raw, '<!DOCTYPE\s+svg\s+(?:PUBLIC\s+"[^"]*"\s+"[^"]*"|SYSTEM\s+"[^"]*")\s*>', '', 'IgnoreCase')
$reader = [System.Xml.XmlReader]::Create([System.IO.StringReader]::new($raw), $readerSettings)
try {
  $source = [System.Xml.XmlDocument]::new()
  $source.XmlResolver = $null
  $source.Load($reader)
} finally { $reader.Dispose() }

$svgNamespace = 'http://www.w3.org/2000/svg'
$allowedElements = @('svg','g','path','rect','circle','ellipse','line','polyline','polygon','defs','linearGradient','radialGradient','stop','clipPath','text','tspan','symbol','use','mask','filter','feGaussianBlur','feBlend','feColorMatrix','feComposite','feFlood','feOffset','feMerge','feMergeNode')
$ignoredElements = @('metadata','title','desc','namedview','script')
$allowedElements += 'pattern'
$allowedAttributes = @('viewBox','width','height','version','x','y','x1','y1','x2','y2','cx','cy','r','rx','ry','d','points','transform','fill','stroke','stroke-width','stroke-linecap','stroke-linejoin','stroke-miterlimit','stroke-dasharray','stroke-dashoffset','fill-rule','clip-rule','opacity','fill-opacity','stroke-opacity','color','display','visibility','id','clip-path','gradientUnits','gradientTransform','offset','stop-color','stop-opacity','preserveAspectRatio','font-size','font-family','font-weight','font-style','font-stretch','font-variant','text-anchor','text-align','letter-spacing','word-spacing','writing-mode','direction','dx','dy','rotate','style','href','filter','mask','maskUnits','maskContentUnits','clipPathUnits','filterUnits','primitiveUnits','stdDeviation','in','in2','result','mode','type','values','operator','k1','k2','k3','k4','flood-color','flood-opacity','color-interpolation-filters','spreadMethod','fx','fy','paint-order','vector-effect')
$allowedStyle = @('fill','stroke','stroke-width','stroke-linecap','stroke-linejoin','stroke-miterlimit','stroke-dasharray','stroke-dashoffset','fill-rule','clip-rule','opacity','fill-opacity','stroke-opacity','color','display','visibility','clip-path','stop-color','stop-opacity','font-size','font-family','font-weight','font-style','font-stretch','font-variant','text-anchor','text-align','letter-spacing','word-spacing','writing-mode','direction','filter','mask','flood-color','flood-opacity','color-interpolation-filters','paint-order','vector-effect')
$output = [System.Xml.XmlDocument]::new()
$allowedAttributes += @('patternUnits','patternContentUnits','patternTransform')
$output.XmlResolver = $null

foreach ($node in $source.SelectNodes('//*')) {
  if ($node.LocalName -eq 'image') { throw 'Embedded raster content: manual review required, not fully scalable' }
  if ($node.LocalName -in @('foreignObject','iframe','object','embed','audio','video')) {
    throw "Unsafe SVG element rejected: $($node.Name)"
  }
  foreach ($attribute in $node.Attributes) {
    if ($attribute.LocalName -in @('href','src') -and $attribute.Value.Trim() -notmatch '^#[A-Za-z_][\w.-]*$') {
      throw "Remote or embedded SVG resource rejected: $($attribute.Name)"
    }
  }
}

function Test-SafeValue([string]$value) {
  if ($value -match '[<>\\]' -or $value -match '(?i)javascript:|data:|https?:|file:|@import|expression\s*\(') { return $false }
  foreach ($match in [regex]::Matches($value, 'url\s*\(\s*([^)]*)\)', 'IgnoreCase')) {
    if ($match.Groups[1].Value.Trim(' ', '"', "'") -notmatch '^#[A-Za-z_][\w.-]*$') { return $false }
  }
  return $true
}

function Copy-SafeNode([System.Xml.XmlNode]$node, [System.Xml.XmlNode]$parent) {
  if ($node.NodeType -eq [System.Xml.XmlNodeType]::Text -and $parent.LocalName -in @('text','tspan')) {
    [void]$parent.AppendChild($output.CreateTextNode($node.Value)); return
  }
  if ($node.NodeType -ne [System.Xml.XmlNodeType]::Element) { return }
  if ($node.LocalName -in $ignoredElements) { return }
  if ($node.NamespaceURI -eq 'http://www.inkscape.org/namespaces/inkscape') { return }
  if ($node.LocalName -eq 'flowRoot' -and -not $node.InnerText.Trim()) { return }
  if ($node.LocalName -eq 'text' -and -not $node.InnerText.Trim()) { return }
  if ($node.NamespaceURI -ne $svgNamespace -or $node.LocalName -notin $allowedElements) {
    throw "Unsupported or unsafe SVG element: $($node.Name)"
  }
  $clean = $output.CreateElement($node.LocalName, $svgNamespace)
  foreach ($attribute in $node.Attributes) {
    if ($attribute.Name -match '^on' -or $attribute.LocalName -notin $allowedAttributes) { continue }
    if ($attribute.NamespaceURI -and $attribute.NamespaceURI -ne 'http://www.w3.org/1999/xlink') { continue }
    $value = $attribute.Value.Trim()
    if (-not (Test-SafeValue $value)) { throw "Unsafe SVG value on $($attribute.Name)" }
    if ($attribute.LocalName -eq 'href') {
      if ($value -notmatch '^#[A-Za-z_][\w.-]*$') { throw 'External SVG reference rejected' }
    }
    if ($attribute.LocalName -eq 'style') {
      $declarations = @()
      foreach ($declaration in $value.Split(';')) {
        if (-not $declaration.Trim()) { continue }
        $parts = $declaration.Split(':', 2)
        if ($parts.Count -ne 2) { throw 'Malformed SVG style rejected' }
        $property = $parts[0].Trim().ToLowerInvariant()
        if ($property -notin $allowedStyle) { continue }
        if (-not (Test-SafeValue $parts[1])) { throw 'Unsafe SVG style rejected' }
        $declarations += "${property}:$($parts[1].Trim())"
      }
      $value = $declarations -join ';'
      if (-not $value) { continue }
    }
    $clean.SetAttribute($attribute.LocalName, $value)
  }
  [void]$parent.AppendChild($clean)
  foreach ($child in $node.ChildNodes) { Copy-SafeNode $child $clean }
}

if ($source.DocumentElement.LocalName -ne 'svg' -or $source.DocumentElement.NamespaceURI -ne $svgNamespace) { throw 'Invalid SVG root' }
# Resolve simple exported class-only styles offline. Reject complex stylesheets
# rather than silently losing paints or allowing external CSS dependencies.
foreach ($stylesheet in @($source.SelectNodes('//*[local-name()="style"]'))) {
  $css = [regex]::Replace($stylesheet.InnerText, '/\*[\s\S]*?\*/', '')
  $rules = [regex]::Matches($css, '\.([A-Za-z_][\w-]*)\s*\{([^{}]*)\}')
  if ([regex]::Replace($css, '\.([A-Za-z_][\w-]*)\s*\{([^{}]*)\}', '').Trim()) { throw 'Complex SVG stylesheet requires manual review' }
  foreach ($styled in $source.SelectNodes('//*[@class]')) {
    $styles = @()
    foreach ($rule in $rules) {
      if ($rule.Groups[1].Value -in ($styled.GetAttribute('class') -split '\s+')) { $styles += $rule.Groups[2].Value }
    }
    if ($styles.Count) { $styled.SetAttribute('style', (($styles + $styled.GetAttribute('style')) -join ';')) }
  }
  [void]$stylesheet.ParentNode.RemoveChild($stylesheet)
}
Copy-SafeNode $source.DocumentElement $output
$root = $output.DocumentElement
$ids = @{}
foreach ($identified in $output.SelectNodes('//*[@id]')) {
  $id = $identified.GetAttribute('id')
  if ($ids.ContainsKey($id)) { throw 'Duplicate SVG identifier requires review' }
  $ids[$id] = $true
}
foreach ($referencing in $output.SelectNodes('//*')) {
  foreach ($attribute in $referencing.Attributes) {
    $references = [regex]::Matches($attribute.Value, 'url\s*\(\s*["'']?(#[A-Za-z_][\w.-]*)["'']?\s*\)', 'IgnoreCase')
    foreach ($reference in $references) {
      if (-not $ids.ContainsKey($reference.Groups[1].Value.Substring(1))) { throw 'Missing local SVG resource requires review' }
    }
    if ($attribute.LocalName -eq 'href' -and -not $ids.ContainsKey($attribute.Value.Substring(1))) { throw 'Missing local SVG reference requires review' }
  }
}
foreach ($childIndex in ($BackgroundRootChildIndex | Sort-Object -Descending)) {
  $children = @($root.ChildNodes | Where-Object { $_.NodeType -eq 'Element' })
  if ($childIndex -lt 0 -or $childIndex -ge $children.Count -or $children[$childIndex].LocalName -notin @('rect','path','polygon')) { throw 'Reviewed background child not found' }
  [void]$root.RemoveChild($children[$childIndex])
}
foreach ($elementId in $BackgroundElementId) {
  $background = $output.SelectSingleNode("//*[@id='$elementId']")
  if (-not $background -or $background.LocalName -notin @('rect','path','polygon')) { throw 'Reviewed background element not found' }
  [void]$background.ParentNode.RemoveChild($background)
}
if (-not $root.HasAttribute('viewBox')) {
  $width = $root.GetAttribute('width')
  $height = $root.GetAttribute('height')
  if ($width -notmatch '^[0-9]+(?:\.[0-9]+)?(?:px)?$' -or $height -notmatch '^[0-9]+(?:\.[0-9]+)?(?:px)?$') { throw 'Missing viewBox with non-pixel dimensions: manual review required' }
  $width = $width -replace 'px$',''
  $height = $height -replace 'px$',''
  if (-not $width -or -not $height) { throw 'SVG has no usable viewBox' }
  $root.SetAttribute('viewBox', "0 0 $width $height")
}
$viewBox = $root.GetAttribute('viewBox') -split '[\s,]+' | Where-Object { $_ }
if ($viewBox.Count -ne 4) { throw 'Invalid SVG viewBox' }
$viewNumbers = @($viewBox | ForEach-Object { [double]::Parse($_, [System.Globalization.CultureInfo]::InvariantCulture) })
if (@($viewNumbers | Where-Object { [double]::IsNaN($_) -or [double]::IsInfinity($_) }).Count -or $viewNumbers[2] -le 0 -or $viewNumbers[3] -le 0) { throw 'Invalid SVG viewBox dimensions' }
# Canonical pixel dimensions follow the viewBox, not unreliable editor width/height.
if ($VisibleViewBox.Count) {
  if ($VisibleViewBox.Count -ne 4 -or @($VisibleViewBox | Where-Object { [double]::IsNaN($_) -or [double]::IsInfinity($_) }).Count -or $VisibleViewBox[2] -le 0 -or $VisibleViewBox[3] -le 0) { throw 'Invalid reviewed artwork bounds' }
  # Bounds come from a rendered alpha inspection with stroke/filter safety padding.
  $viewBox = @($VisibleViewBox | ForEach-Object { $_.ToString('0.######', [System.Globalization.CultureInfo]::InvariantCulture) })
  $root.SetAttribute('viewBox', ($viewBox -join ' '))
}
$root.SetAttribute('width', $viewBox[2]); $root.SetAttribute('height', $viewBox[3])
$root.SetAttribute('preserveAspectRatio', 'xMidYMid meet')
$root.RemoveAttribute('version')
if (-not $output.SelectSingleNode('//*[local-name()="path" or local-name()="rect" or local-name()="circle" or local-name()="polygon" or local-name()="ellipse" or local-name()="polyline" or local-name()="line" or local-name()="text"]')) { throw 'SVG has no visible geometry' }
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)
[System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($resolvedOutput)) | Out-Null
$writerSettings = [System.Xml.XmlWriterSettings]::new()
$writerSettings.Encoding = [System.Text.UTF8Encoding]::new($false)
$writerSettings.Indent = $false
$writer = [System.Xml.XmlWriter]::Create($resolvedOutput, $writerSettings)
try { $output.Save($writer) } finally { $writer.Dispose() }
