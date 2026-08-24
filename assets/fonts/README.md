# Local designer font pack

The designer self-hosts 40 font families and does not depend on the Google Fonts CSS service. All font binaries came from the official `google/fonts` repository.

## Arabic and multilingual families (30)

Cairo, Tajawal, Almarai, Changa, Noto Kufi Arabic, Amiri, Noto Naskh Arabic, IBM Plex Sans Arabic, Reem Kufi, El Messiri, Mada, Harmattan, Lateef, Scheherazade New, Markazi Text, Aref Ruqaa, Rakkas, Lemonada, Katibeh, Mirza, Baloo Bhaijaan 2, Noto Sans Arabic, Alexandria, Readex Pro, Rubik, Lalezar, Jomhuria, Vibes, Gulzar, and Marhey.

## International families (10)

Roboto, Open Sans, Montserrat, Poppins, Lato, Playfair Display, Oswald, Raleway, Merriweather, and Bebas Neue.

Each family's SIL Open Font License is stored in `licenses/`. Variable fonts are used where available; static families include their regular face and a bold or extra-bold face when published.

Run `scripts/download-font-pack.ps1` from the project root to refresh the package from its official source. The downloader preserves the filenames referenced by `fonts.css`.

FOUT is prevented in two stages: Cairo is preloaded before the designer is revealed, and font changes are applied to canvas text only after the selected local face passes the browser's font-loading check.
