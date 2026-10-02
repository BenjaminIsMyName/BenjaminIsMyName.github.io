# Benjamin’s portfolio

A static, responsive portfolio for GitHub Pages. No backend, build step, package installation, or runtime API is required. Serve the repository root as the Pages source.

## Local preview

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173`.

## Editing

- `index.html`: portfolio content, project links, experience, education, and skills.
- `index.css`: responsive layout, self-hosted fonts, and dark/light themes.
- `index.js`: navigation, project filters, theme persistence, and progressive enhancement.
- `assets/sculpture.js`: decorative Three.js hero. An SVG fallback remains when WebGL is unavailable. Animation respects reduced motion, can be paused, and stops when the hero is off screen or the tab is hidden.

Project illustrations are decorative artwork rather than product screenshots. Individual project technologies and results are not inferred from the resume’s general skill list. Experience years denote the milestones shown in the resume; they do not assert employment end dates.

## Privacy

Public identity is limited to the first name already used by the original site. The resume PDF is not included or linked. The site has no contact links, contact forms, analytics, external font requests, email addresses, phone numbers, full names, or addresses. Project links come from the resume and the user's additions. Theme preferences are stored locally when browser storage is available.

## Third-party assets

Three.js 0.180.0 is vendored locally under its MIT license (`assets/vendor/THREE-LICENSE.txt`). `RoomEnvironment.js` uses a relative import so it runs without a bundler. Space Grotesk and DM Sans are self-hosted under the SIL Open Font License; see the license files in `assets/fonts/`.

The original `Highlight/` and `Icons/` directories remain in the repository for reference and are no longer loaded by the site.

## Verification

Checked in Chromium at eight widths from 320 to 1920 pixels, including project filters, mobile navigation, theme persistence, animation controls, and reduced motion. The page was also checked with JavaScript disabled and with WebGL and local storage unavailable. No horizontal overflow, JavaScript errors, failed asset requests, or external asset requests were found.

axe-core 4.10.3 reported no violations for its WCAG 2 A/AA and WCAG 2.1 AA rules in the dark and light themes at desktop and mobile sizes. This is an automated check, not a complete accessibility certification.
