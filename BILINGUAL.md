# Bilingual portfolio

The implementation follows the existing Raymonchu48/Deportivo pattern, inspected on 14 October 2026: Spanish pages at the repository root, complete English pages under `en/`, shared original media, ES/EN flags, `aria-current` for the current language, and navigation that retains the open section.

All five pages have a counterpart: `index.html`, `PTD1.html`, `proyecto-virtualizacion.html`, `proyecto-redes.html`, and `cv.html`. English project links and terminal CV commands stay within `en/`. The English certification registry retains all 17 records, their categories, years, course codes, hours and ECTS values.

CSS, the portfolio interaction script, photos and videos are shared. English cover labels use SVG overlays over the original artwork, matching Deportivo's treatment of embedded Spanish text. The Spanish CV is unchanged; `en/Professional_IT_Profile.pdf` contains the complete English translation in two pages, with the original photograph.

`language-switch.js` preserves the current module, terminal visibility and HUD setting. Direct links such as `en/index.html#projects` restore the module. The delayed AUTO start only runs on a fresh core entry, so it cannot replace a section opened by a language switch.

Validation: local browser checks at 1440, 768, 390 and 320 px; all modules, certification filtering, ES/EN round trips, terminal commands, HUD controls, project return links and both CV pages. Static checks cover local links, translated text and unchanged Spanish page content outside selector additions. Both English PDF pages were rendered and visually reviewed.

When updating content, update the matching English page or `en/certifications.js`. Keep shared styles and behaviour in the root files, and keep English-only documents in `en/`.
