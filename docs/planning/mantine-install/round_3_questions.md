# Mantine install: grilling round 3

Settled in round 2:

- No PostCSS preset. We lean into SCSS and follow Mantine's own [Usage with Sass](https://mantine.dev/styles/sass/) guide. Wherever Mantine offers something that doesn't work in SCSS, we use its SCSS variant.
- Theme: `primaryColor: "green"`, `defaultRadius: "md"`.
- `global.scss` stays, with only its header comment, imported after `@mantine/core/styles.css`.
- Home shows one `Card` per Item.
- `Home.module.scss` stays, with `.intro` using Mantine's CSS variables.
- ADR-0002 records the decision. A Mantine bullet goes into `CLAUDE.md` Code conventions during implementation.

Facts I checked since (no decision needed):

- **Mantine's Sass guide** has three parts:
  - a `_mantine.scss` file with a `rem()` function, the five breakpoint variables, and the mixins `light`, `dark`, `hover`, `smaller-than`, `larger-than`, `rtl` and `ltr`
  - `css.preprocessorOptions.scss.additionalData` in `vite.config`, which injects `@use "<path>/_mantine" as mantine;` into every SCSS file
  - usage as `mantine.rem(16px)`, `@include mantine.hover { … }` and `@include mantine.smaller-than(mantine.$mantine-breakpoint-md) { … }`
- **It works with our Sass.** I compiled exactly that with the project's `sass-embedded` 1.105.0: no errors, no warnings, and the expected CSS (`1rem`, the hover media query, `max-width: 62em`). Namespacing it as `mantine.rem` avoids the clash with Sass's built-in `rem()` that broke round 2's probe.
- **One line of the guide doesn't apply to Vite 8.** The guide sets `api: 'modern-compiler'`. Vite 8's Sass options no longer have `api`: the modern compiler is the only one, and the key would fail our `tsc -b` type check. We leave that line out.
- **No `light-dark()`.** The guide says `light-dark()` in SCSS needs the PostCSS preset, which we dropped. Its SCSS variant is `@include mantine.light` / `@include mantine.dark`, and neither matters while we're light-only.
- **Mantine's docs examples are written in preset syntax.** They have to be translated (`rem(…)` → `mantine.rem(…)`, `@mixin hover` → `@include mantine.hover`). That goes in the `CLAUDE.md` bullet.
- **The breakpoint values must match the theme.** We keep Mantine's default breakpoints, so `_mantine.scss` uses its default values unchanged.

---

❓ **Q1** - **Where `_mantine.scss` lives**: Mantine's guide puts it at `src/_mantine.scss`. This project keeps styles in `src/styles/` (`global.scss` is there, and `CLAUDE.md` treats `styles` as an area of `src/`). **(a)** `src/styles/_mantine.scss`, with the `additionalData` path pointing there. **(b)** `src/_mantine.scss`, exactly as in the guide.

➡️ (a). It's the same setup with the path changed, and every style file stays in one folder.

**Answer:**
as recommended

---

❓ **Q2** - **What goes into `_mantine.scss`**: **(a)** Copy Mantine's file verbatim, including `light`/`dark` (unused while light-only) and `rtl`/`ltr` (no right-to-left support planned). **(b)** Trim it to what we can use now: `rem`, the breakpoints, `hover`, `smaller-than` and `larger-than`.

➡️ (a). When Mantine changes the file in a future version, updating is a straight copy and diff against the guide. The unused mixins cost nothing, since a mixin produces no CSS until something includes it, and `light`/`dark` will be ready if dark mode arrives.

**Answer:**
as recommended