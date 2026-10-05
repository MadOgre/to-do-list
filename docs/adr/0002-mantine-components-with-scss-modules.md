# Mantine provides the components; custom styles stay in SCSS modules

We use Mantine (`@mantine/core` + `@mantine/hooks`) for UI components and keep SCSS modules for Page layout and custom styles. Where Mantine's documentation offers something that only works through its PostCSS preset, we use the Sass variant from Mantine's own [Usage with Sass](https://mantine.dev/styles/sass/) guide: `src/styles/_mantine.scss`, injected into every SCSS file as the `mantine` namespace by `vite.config.ts`.

## Considered Options

- **Mantine's PostCSS preset alongside SCSS** (rejected). In a `.scss` file Sass runs before PostCSS, and it breaks the preset's syntax. `@mixin hover { … }` is read as a Sass mixin definition, so its styles are silently dropped. `rem()` clashes with Sass's built-in `rem()` and fails the build, and `$mantine-breakpoint-*` is an undefined Sass variable. The preset would only have worked in a second style format (`.module.css`), with a rule for when to use which.
- **Switching style modules to `.module.css` + the preset**, Mantine's default setup (rejected). It would drop the existing SCSS convention to gain mixins that the Sass guide already provides.

## Consequences

- Mantine's docs examples are written in preset syntax. In this repo they become `mantine.rem(…)`, `@include mantine.hover { … }` and `@include mantine.smaller-than(mantine.$mantine-breakpoint-md) { … }`.
- `light-dark()` needs the preset, so it isn't available. The Sass variant is `@include mantine.light` / `@include mantine.dark`.
- `_mantine.scss` is a verbatim copy of the file in Mantine's guide, so a Mantine upgrade means copying it again and diffing. Its breakpoint values must match the theme's.
- The guide's `api: 'modern-compiler'` option is left out: Vite 8 removed it, and the modern compiler is the only one.
