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
- `assets/sounds.js`: opt-in sound effects using native Web Audio. The speaker button remembers the preference; audio loads only after an interaction while enabled. Navigation, clicks, and toggles use distinct quiet sounds. Muting stops playing and pending sounds immediately.
- `assets/sculpture.js`: decorative Three.js hero. An SVG fallback remains when WebGL is unavailable. Animation respects reduced motion, can be paused, and stops when the hero is off screen or the tab is hidden.

Project illustrations are decorative artwork rather than product screenshots. Individual project technologies and results are not inferred from the resume’s general skill list. Experience years denote the milestones shown in the resume; they do not assert employment end dates.

## Privacy

Public identity is limited to the first name already used by the original site. The resume PDF is not included or linked. The site has no contact links, contact forms, analytics, external font requests, email addresses, phone numbers, full names, or addresses. Project links come from the resume and the user's additions. Theme and sound preferences are stored locally when browser storage is available.

## Third-party assets

Three.js 0.180.0 is vendored locally under its MIT license (`assets/vendor/THREE-LICENSE.txt`). `RoomEnvironment.js` uses a relative import so it runs without a bundler. Space Grotesk and DM Sans are self-hosted under the SIL Open Font License; see the license files in `assets/fonts/`.

The original `Highlight/` and `Icons/` directories remain in the repository for reference and are no longer loaded by the site.

The three audio assets are adapted from Kenney’s UI SFX Set under CC0 (`assets/audio/KENNEY-LICENSE.txt`). `click.mp3` comes from `click3.ogg`, `navigate.mp3` from `rollover2.ogg`, and `toggle.mp3` from `switch13.ogg`. They are converted to mono MP3 with consistent peaks; playback volume is controlled by the gain in `assets/sounds.js`.

## Verification

Checked in Chromium at eight widths from 320 to 1920 pixels, including project filters, mobile navigation, theme persistence, animation controls, and reduced motion. The page was also checked with JavaScript disabled and with WebGL and local storage unavailable. No horizontal overflow, JavaScript errors, failed asset requests, or external asset requests were found.

axe-core 4.10.3 reported no violations for its WCAG 2 A/AA and WCAG 2.1 AA rules in the dark and light themes at desktop and mobile sizes. This is an automated check, not a complete accessibility certification.

Sound checks verified actual decoding and playback of all three clips, keyboard activation, default mute, preference persistence without autoplay, immediate mute, cancellation during delayed loading, blocked storage, and unavailable Web Audio. The updated header fits all eight responsive widths, and the sound control passes the same automated accessibility checks in both themes.
