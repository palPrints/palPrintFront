# Design Studio SVG rendering quality

## Cause and fix

Library graphics previously used FabricImage.fromURL at the SVG's intrinsic dimensions. Some genuine vector assets have tiny intrinsic viewBoxes, and Fabric's one-color filter rasterized them at that resolution. CSS/browser zoom could also enlarge a canvas backing store created at an earlier device-pixel ratio. Marking an object dirty alone would not restore the lost source detail.

A later inspection found a second concrete downgrade: the adaptive renderer created a detailed first image but initialized studioSvgPixels to 0 × 0. Its first render then replaced that image with a buffer sized only for the current small on-screen object (about 83 px for the tested lettering). Zooming enlarged this low-resolution buffer until an asynchronous refresh completed. The initial buffer is now rendered at a 1024-pixel long edge and its actual dimensions are recorded immediately, so refresh only upgrades resolution and never downgrades it.

The runtime-only design-studio-svg-renderer.js now retains the approved SVG source on demand and regenerates its browser-rendered image/filter buffer at the object's actual screen-pixel size (Fabric object scale, viewport zoom, and effective retina scaling), with 25% oversampling. Browser SVG rendering preserves the library's gradients, local references, clipping, masks, and filters instead of importing them into Fabric's more limited SVG path parser. These remain Fabric image objects backed by a genuine vector source, not native Fabric path groups.

The SVG-specific full-image drawing method maps the independent buffer dimensions into the existing logical object rectangle. Source/filter pixels change; object width, height, scale, position, rotation, and normalized document fields do not. The existing graphicId restore/duplicate paths use the same renderer. Current recolor filters are reapplied whenever the buffer is regenerated.

SVG images retain their source/filter buffer but do not use an additional Fabric object bitmap cache. This setting is per SVG image only, not a global caching change. Text, uploaded images, and other Fabric cache defaults remain unchanged. noScaleCache is false for these SVG images. Enlarged buffers are reused on zoom-out; repeated unchanged renders do not regenerate them.

The Design Studio canvas has a per-instance effective retina scale that accounts for browser devicePixelRatio and CSS stage scaling. On significant changes its backing store is resized and object caches are marked dirty, without changing logical canvas dimensions or viewport/document coordinates. Resize, visualViewport resize, stage resize, and before-render cover browser zoom and Fabric viewport zoom.

## Source checks

All 37 published local SVG files were inspected structurally and contain no image elements. The import sanitizer already rejects embedded raster content. Runtime validation also detects SVG image elements (including namespaced images), flags the source as raster-wrapped, scalable:false, review-required, rejects adding it, and shows an Arabic review notice. Merely having an .svg extension is not accepted as proof of scalable vector artwork.

Sources are fetched/parsed only when adding or restoring a referenced graphic, never for the entire library at startup. XML markup and buffers remain runtime-only; the persisted design still contains graphicId and normalized fields, not SVG source data.

## Verification

Headless Chrome tested Fabric viewport zoom at 100%, 150%, 200%, and 300%, repeated at device scale factors 1, 1.5, 2, and 3. Five representative assets cover small-viewBox monochrome lettering, multicolor/local-use dove artwork, a gradient/filter mosque scene, a detailed multicolor car, and a detailed monochrome phoenix.

The post-downgrade regression test inspected all 37 published files: every file had zero image elements/raster references and at least one vector shape, all initial long-edge buffers were 1024 pixels, and the same lettering graphic retained its 1024 × 263 buffer at 100%, 150%, 200%, and 300%. Required dimensions at those levels were 66 × 17, 99 × 26, 132 × 34, and 197 × 51 respectively. Geometry was byte-for-byte unchanged across the zoom sequence.

Checks passed at every level:

- Rendering buffers meet or exceed required screen-pixel dimensions.
- Normalized dimensions, positions, rotation, color, references, and flips are unchanged by zoom.
- No SVG source is loaded before a graphic is requested.
- One-color recoloring survives regeneration; actual output pixels are red, not merely a stored color flag.
- graphicId restoration and duplication use the vector-source renderer.
- Raster-wrapped test SVG is rejected and explicitly flagged non-scalable.
- Other Fabric object cache defaults remain unchanged.
- SVG source markup is absent from normalized persistence.

A rendered comparison sheet was visually inspected at all four zoom levels: lettering, fine phoenix details, dove outlines, car detail, and mosque artwork remain sharp at 300%. Temporary test HTML/screenshots were removed after verification.

## Limits and scope

Adaptive buffers are bounded to a 4096-pixel edge and about eight million pixels per graphic to avoid unbounded CPU/GPU memory use. Extremely large display sizes beyond that budget set studioSvgResolutionLimited at runtime and can soften; none of the tested 100–300% cases reaches the limit. Refresh is asynchronous, so the previous buffer can be visible briefly while a new resolution is generated. Genuine SVG source remains available for the next refresh; raster artwork cannot regain vector detail.

This fix targets approved library SVG graphics. Uploaded raster-image resolution is unchanged. No catalog additions, artwork changes, normalized schema/storage changes, or Phase 4 features were introduced. Existing layout and CSS were preserved.

Files: added assets/js/pages/design-studio-svg-renderer.js and this report; updated assets/js/pages/design-studio.js and design-studio.html.

## Live Server compatibility regression

Live Server 5.7.10 appends a marked reload script before the closing SVG tag. The runtime safety validator correctly rejected that modified response, preventing graphics from being added. The loader now removes only the marked trailing reload block containing the known refreshCSS/WebSocket/LiveServer signature before XML validation and Blob construction. It never executes or renders that script. Other scripts and unsafe resources remain rejected; no VS Code configuration changes are required. The renderer script URL is versioned to bypass the previous browser-cached loader.

Regression verification: all 37 approved catalog SVGs loaded using the actual injected.html from the installed Live Server extension. Four negative cases (unmarked script, fake reload marker, event handler, embedded raster image) were still rejected: 41/41 checks passed. Temporary harness removed.
