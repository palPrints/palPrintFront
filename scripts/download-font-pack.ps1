param(
    [string]$Destination = (Join-Path $PSScriptRoot "..\assets\fonts")
)

$ErrorActionPreference = "Stop"
$fontRoot = [System.IO.Path]::GetFullPath($Destination)
$licenseRoot = Join-Path $fontRoot "licenses"
New-Item -ItemType Directory -Force -Path $fontRoot, $licenseRoot | Out-Null

$fontPack = @(
    @{ Family = "Cairo"; Slug = "cairo"; Files = @(@{ Source = "Cairo[slnt,wght].ttf"; Target = "Cairo-Variable.ttf" }) },
    @{ Family = "Tajawal"; Slug = "tajawal"; Files = @(@{ Source = "Tajawal-Regular.ttf"; Target = "Tajawal-Regular.ttf" }, @{ Source = "Tajawal-ExtraBold.ttf"; Target = "Tajawal-ExtraBold.ttf" }) },
    @{ Family = "Almarai"; Slug = "almarai"; Files = @(@{ Source = "Almarai-Regular.ttf"; Target = "Almarai-Regular.ttf" }, @{ Source = "Almarai-ExtraBold.ttf"; Target = "Almarai-ExtraBold.ttf" }) },
    @{ Family = "Changa"; Slug = "changa"; Files = @(@{ Source = "Changa[wght].ttf"; Target = "Changa-Variable.ttf" }) },
    @{ Family = "Noto Kufi Arabic"; Slug = "notokufiarabic"; Files = @(@{ Source = "NotoKufiArabic[wght].ttf"; Target = "NotoKufiArabic-Variable.ttf" }) },
    @{ Family = "Amiri"; Slug = "amiri"; Files = @(@{ Source = "Amiri-Regular.ttf"; Target = "Amiri-Regular.ttf" }, @{ Source = "Amiri-Bold.ttf"; Target = "Amiri-Bold.ttf" }) },
    @{ Family = "Noto Naskh Arabic"; Slug = "notonaskharabic"; Files = @(@{ Source = "NotoNaskhArabic[wght].ttf"; Target = "NotoNaskhArabic-Variable.ttf" }) },
    @{ Family = "IBM Plex Sans Arabic"; Slug = "ibmplexsansarabic"; Files = @(@{ Source = "IBMPlexSansArabic-Regular.ttf"; Target = "IBMPlexSansArabic-Regular.ttf" }, @{ Source = "IBMPlexSansArabic-Bold.ttf"; Target = "IBMPlexSansArabic-Bold.ttf" }) },
    @{ Family = "Reem Kufi"; Slug = "reemkufi"; Files = @(@{ Source = "ReemKufi[wght].ttf"; Target = "ReemKufi-Variable.ttf" }) },
    @{ Family = "El Messiri"; Slug = "elmessiri"; Files = @(@{ Source = "ElMessiri[wght].ttf"; Target = "ElMessiri-Variable.ttf" }) },
    @{ Family = "Mada"; Slug = "mada"; Files = @(@{ Source = "Mada[wght].ttf"; Target = "Mada-Variable.ttf" }) },
    @{ Family = "Harmattan"; Slug = "harmattan"; Files = @(@{ Source = "Harmattan-Regular.ttf"; Target = "Harmattan-Regular.ttf" }, @{ Source = "Harmattan-Bold.ttf"; Target = "Harmattan-Bold.ttf" }) },
    @{ Family = "Lateef"; Slug = "lateef"; Files = @(@{ Source = "Lateef-Regular.ttf"; Target = "Lateef-Regular.ttf" }, @{ Source = "Lateef-ExtraBold.ttf"; Target = "Lateef-ExtraBold.ttf" }) },
    @{ Family = "Scheherazade New"; Slug = "scheherazadenew"; Files = @(@{ Source = "ScheherazadeNew-Regular.ttf"; Target = "ScheherazadeNew-Regular.ttf" }, @{ Source = "ScheherazadeNew-Bold.ttf"; Target = "ScheherazadeNew-Bold.ttf" }) },
    @{ Family = "Markazi Text"; Slug = "markazitext"; Files = @(@{ Source = "MarkaziText[wght].ttf"; Target = "MarkaziText-Variable.ttf" }) },
    @{ Family = "Aref Ruqaa"; Slug = "arefruqaa"; Files = @(@{ Source = "ArefRuqaa-Regular.ttf"; Target = "ArefRuqaa-Regular.ttf" }, @{ Source = "ArefRuqaa-Bold.ttf"; Target = "ArefRuqaa-Bold.ttf" }) },
    @{ Family = "Rakkas"; Slug = "rakkas"; Files = @(@{ Source = "Rakkas-Regular.ttf"; Target = "Rakkas-Regular.ttf" }) },
    @{ Family = "Lemonada"; Slug = "lemonada"; Files = @(@{ Source = "Lemonada[wght].ttf"; Target = "Lemonada-Variable.ttf" }) },
    @{ Family = "Katibeh"; Slug = "katibeh"; Files = @(@{ Source = "Katibeh-Regular.ttf"; Target = "Katibeh-Regular.ttf" }) },
    @{ Family = "Mirza"; Slug = "mirza"; Files = @(@{ Source = "Mirza-Regular.ttf"; Target = "Mirza-Regular.ttf" }, @{ Source = "Mirza-Bold.ttf"; Target = "Mirza-Bold.ttf" }) },
    @{ Family = "Baloo Bhaijaan 2"; Slug = "baloobhaijaan2"; Files = @(@{ Source = "BalooBhaijaan2[wght].ttf"; Target = "BalooBhaijaan2-Variable.ttf" }) },
    @{ Family = "Noto Sans Arabic"; Slug = "notosansarabic"; Files = @(@{ Source = "NotoSansArabic[wdth,wght].ttf"; Target = "NotoSansArabic-Variable.ttf" }) },
    @{ Family = "Alexandria"; Slug = "alexandria"; Files = @(@{ Source = "Alexandria[wght].ttf"; Target = "Alexandria-Variable.ttf" }) },
    @{ Family = "Readex Pro"; Slug = "readexpro"; Files = @(@{ Source = "ReadexPro[HEXP,wght].ttf"; Target = "ReadexPro-Variable.ttf" }) },
    @{ Family = "Rubik"; Slug = "rubik"; Files = @(@{ Source = "Rubik[wght].ttf"; Target = "Rubik-Variable.ttf" }) },
    @{ Family = "Lalezar"; Slug = "lalezar"; Files = @(@{ Source = "Lalezar-Regular.ttf"; Target = "Lalezar-Regular.ttf" }) },
    @{ Family = "Jomhuria"; Slug = "jomhuria"; Files = @(@{ Source = "Jomhuria-Regular.ttf"; Target = "Jomhuria-Regular.ttf" }) },
    @{ Family = "Vibes"; Slug = "vibes"; Files = @(@{ Source = "Vibes-Regular.ttf"; Target = "Vibes-Regular.ttf" }) },
    @{ Family = "Gulzar"; Slug = "gulzar"; Files = @(@{ Source = "Gulzar-Regular.ttf"; Target = "Gulzar-Regular.ttf" }) },
    @{ Family = "Marhey"; Slug = "marhey"; Files = @(@{ Source = "Marhey[wght].ttf"; Target = "Marhey-Variable.ttf" }) },
    @{ Family = "Roboto"; Slug = "roboto"; Files = @(@{ Source = "Roboto[wdth,wght].ttf"; Target = "Roboto-Variable.ttf" }) },
    @{ Family = "Open Sans"; Slug = "opensans"; Files = @(@{ Source = "OpenSans[wdth,wght].ttf"; Target = "OpenSans-Variable.ttf" }) },
    @{ Family = "Montserrat"; Slug = "montserrat"; Files = @(@{ Source = "Montserrat[wght].ttf"; Target = "Montserrat-Variable.ttf" }) },
    @{ Family = "Poppins"; Slug = "poppins"; Files = @(@{ Source = "Poppins-Regular.ttf"; Target = "Poppins-Regular.ttf" }, @{ Source = "Poppins-ExtraBold.ttf"; Target = "Poppins-ExtraBold.ttf" }) },
    @{ Family = "Lato"; Slug = "lato"; Files = @(@{ Source = "Lato-Regular.ttf"; Target = "Lato-Regular.ttf" }, @{ Source = "Lato-ExtraBold.ttf"; Target = "Lato-ExtraBold.ttf" }) },
    @{ Family = "Playfair Display"; Slug = "playfairdisplay"; Files = @(@{ Source = "PlayfairDisplay[wght].ttf"; Target = "PlayfairDisplay-Variable.ttf" }) },
    @{ Family = "Oswald"; Slug = "oswald"; Files = @(@{ Source = "Oswald[wght].ttf"; Target = "Oswald-Variable.ttf" }) },
    @{ Family = "Raleway"; Slug = "raleway"; Files = @(@{ Source = "Raleway[wght].ttf"; Target = "Raleway-Variable.ttf" }) },
    @{ Family = "Merriweather"; Slug = "merriweather"; Files = @(@{ Source = "Merriweather[opsz,wdth,wght].ttf"; Target = "Merriweather-Variable.ttf" }) },
    @{ Family = "Bebas Neue"; Slug = "bebasneue"; Files = @(@{ Source = "BebasNeue-Regular.ttf"; Target = "BebasNeue-Regular.ttf" }) }
)

foreach ($font in $fontPack) {
    foreach ($file in $font.Files) {
        $encodedName = [System.Uri]::EscapeDataString($file.Source)
        $sourceUrl = "https://raw.githubusercontent.com/google/fonts/main/ofl/$($font.Slug)/$encodedName"
        Invoke-WebRequest -UseBasicParsing -Uri $sourceUrl -OutFile (Join-Path $fontRoot $file.Target)
    }

    $licenseName = ($font.Family -replace "[^A-Za-z0-9]+", "") + "-OFL.txt"
    $licenseUrl = "https://raw.githubusercontent.com/google/fonts/main/ofl/$($font.Slug)/OFL.txt"
    Invoke-WebRequest -UseBasicParsing -Uri $licenseUrl -OutFile (Join-Path $licenseRoot $licenseName)
    Write-Host "Downloaded $($font.Family)"
}

Write-Host "Font pack ready: $($fontPack.Count) families in $fontRoot"
