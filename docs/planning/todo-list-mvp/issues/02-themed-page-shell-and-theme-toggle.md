# 02: Themed page shell and light/dark toggle

**Status:** ready-for-agent

**Blocked by:** 01

**Spec:** `docs/planning/todo-list-mvp/spec.md` · **ADR:** ADR-0002

**What to build:** The page looks like the design around the list. The style guide's colours and Josefin Sans come from the Mantine theme. The "TODO" header sits over the design's background image, which changes with light/dark and mobile/desktop. The list from ticket 01 sits in the centred, responsive card column. A sun/moon toggle switches the theme. The app starts in the OS setting, remembers the choice, and doesn't flash the wrong theme on load. The browser tab shows the design's favicon and "Todo app".

- [ ] The theme carries the style guide:
  - Blue 500 as the primary colour, as a custom colour tuple, replacing green.
  - Josefin Sans as the font family.
  - The light and dark page, card, text, dimmed, Completed and divider colours from the spec, through custom colours and a CSS variables resolver.
  - `defaultRadius` and breakpoints unchanged.
- [ ] Josefin Sans 400 and 700 load from Google Fonts `<link>`s (with preconnect) in the HTML entry page
- [ ] `MantineProvider` uses `defaultColorScheme="auto"`, with Mantine's default `localStorage` color scheme manager. `ColorSchemeScript` (or its equivalent) is in the HTML entry page, so there's no flash of the wrong theme
- [ ] A theme toggle Shared Component, typed `FC` (or `FC<ThemeToggleProps>` if it takes props):
  - A Mantine `ActionIcon` showing the design's moon icon in light and sun icon in dark.
  - It uses `useMantineColorScheme`.
  - Its aria-label is "Switch to dark theme" or "Switch to light theme".
- [ ] The components barrel is created with this first Shared Component, per the code conventions
- [ ] Home shows the bold, white, widely letter-spaced "TODO" header with the theme toggle, over a full-width background image at the top of the page:
  - light/dark × mobile/desktop images from the images area
  - switched with `@include mantine.light` / `mantine.dark` and the `sm` breakpoint mixins
  - the page colour below the image
- [ ] Layout is centred, with typography from the design's text presets (18px body on desktop, -0.25px letter spacing, smaller on mobile). There is no horizontal scroll from 320px up
- [ ] SCSS modules use only Mantine CSS variables and the injected `mantine` helpers, with no hard-coded colours
- [ ] The favicon is the design's 32×32 PNG, served from the public folder and replacing the SVG. The page title is "Todo app"
- [ ] The untracked Figma screenshots and `STYLEGUIDE.md` move into a `design` folder in this feature's planning folder, and the empty root folder is removed
- [ ] `pnpm install`, `pnpm lint`, `pnpm build` and a short `pnpm dev` start all pass with the developer's pnpm and Node
- [ ] Manual check on `/`:
  - The theme starts from the OS setting.
  - The toggle switches the colours, icon and background image, and the choice survives a reload with no flash.
  - Check at 320px, 375px, just below and above 768px, and 1440px: the mobile and desktop images show, with no horizontal scroll.
  - Josefin Sans, the favicon and the title are in place.
