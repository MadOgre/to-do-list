# Mantine install: grilling round 1

Facts already checked:

- Latest Mantine is `9.6.3`. It needs `react`/`react-dom` `^19.2.0` (the project has `^19.2.8`) and `@mantine/hooks` at the same version, so there is no version conflict.
- Styling today is `src/styles/global.scss` (box-sizing reset, `body` padding, system font stack, line height), plus one SCSS module per Page. No PostCSS config exists.
- `Home` renders the placeholder **Item** list from `useItems()` with plain `<h1>`, `<p>` and `<ul>`.
- `docs/planning/to-do-list-setup/INTENT.md` (the empty template) shows as deleted in the working tree. I've left it alone.

---

❓ **Q1** - **Feature folder name**: The folder is `docs/planning/mantine install/`, with a space. `docs/agents/issue-tracker.md` calls it `<feature-slug>`, and a space breaks unquoted shell paths and markdown links. Rename it to `mantine-install/`? Your `INTENT.md` would move unchanged.

➡️ Rename to `docs/planning/mantine-install/`.

**Answer:**
Yes rename (irrelevant now since already renamed)
---

❓ **Q2** - **Which Mantine packages**: `@mantine/core` and `@mantine/hooks` are required. Optional extras include `@mantine/form`, `@mantine/notifications`, `@mantine/dates` (plus `dayjs`), `@mantine/modals` and `@mantine/code-highlight`. Do we install only the core pair now, or add extras the to-do app will obviously need (a form for adding tasks, notifications for save errors)?

➡️ Only `@mantine/core` + `@mantine/hooks`. Add the others when a feature needs them, so this change stays small and nothing is installed without being used.

**Answer:**
as recommended
---

❓ **Q3** - **How Mantine and SCSS coexist**: Mantine 7+ ships plain CSS (`@mantine/core/styles.css`, which includes its own normalize and `body` font/line-height) and styles through props, `style`/`classNames`, and CSS modules. Options:

- **(a)** Keep SCSS modules for Page layout and custom styles, use Mantine for components. Trim `global.scss` to only what Mantine doesn't already cover.
- **(b)** Go all in on Mantine: style props and Mantine layout components only, and delete `global.scss` and the Page SCSS modules.
- **(c)** Keep `global.scss` as is and just add Mantine on top. It may fight Mantine's font and line height.

➡️ (a). SCSS modules are already a project convention (`CLAUDE.md`: Pages keep their SCSS module next to them), and Mantine's own styling system is CSS modules too. `global.scss` would lose the font stack, line height and box-sizing reset (Mantine sets these), and keep only the app's own rules, like `body` padding, unless Q6 replaces that with a Mantine layout.

**Answer:**
recommended answer is acceptable
---

❓ **Q4** - **PostCSS preset**: Mantine recommends `postcss-preset-mantine` + `postcss-simple-vars`, which add `rem()`, `light-dark()`, `@mixin hover`/`dark`/`smaller-than` and named breakpoints inside CSS files. They only run on `.css` files through PostCSS, and our modules are `.scss`. Add them?

➡️ No. Our modules are SCSS, and Mantine's CSS variables (`var(--mantine-spacing-md)`, `var(--mantine-color-blue-6)`) already work in SCSS without the preset. Add it later if we want the mixins.

**Answer:**
I say go ahead and add them anyway. If it's not going to hurt anything, I would like to have those mixins available to me. 
---

❓ **Q5** - **Theme ("reasonable defaults")**: Options:

- **(a)** `MantineProvider` with no theme: Mantine's defaults (blue primary, system font stack).
- **(b)** A `theme` from `createTheme()` in its own file (e.g. `src/theme.ts`, next to `queryClient.ts`). It starts almost empty (say, only `primaryColor`) and gives future customisation an obvious home.
- **(c)** A fuller theme now: fonts, radius, custom palette.

➡️ (b), with `primaryColor` and `defaultRadius` set explicitly and nothing else. It's the "configured" part of the Definition of Done without inventing a design.

**Answer:**
yes as recommended
---

❓ **Q6** - **Color scheme**: Mantine supports `light`, `dark` or `auto` (follows the OS). `auto`/`dark` need a small script in `index.html` so the page doesn't flash light before React mounts; Mantine's `ColorSchemeScript` is a React component, which a Vite SPA can't render into `index.html`. Options: **(a)** light only, **(b)** `auto` with the inline script, **(c)** `auto` plus a toggle button on Home as part of the demo.

➡️ (a) light only for now. It needs no `index.html` changes, and dark mode can be its own small feature later.

**Answer:**
as recommended
---

❓ **Q7** - **What "importable from anywhere" means**: Either **(a)** components import straight from `@mantine/core` wherever they're used, or **(b)** we re-export the Mantine components we use through our own barrel/wrappers (e.g. `@/components`) so the library can be swapped later.

➡️ (a) direct imports. Wrapping a whole component library is heavy and rarely pays off, and the `@/components` barrel is reserved for real Shared Components (`CLAUDE.md`).

**Answer:**
as recommended
---

❓ **Q8** - **Demo on the Home page**: Options:

- **(a)** Rebuild the existing Home with Mantine: `Container`, `Title`, `Text` for the intro, `Loader` while pending, `Alert` on error, and the Items as a `Stack` of `Card`s or a `List`. It shows Mantine next to real data, and nothing fake is added.
- **(b)** Keep Home's Item list as is and add a separate showcase block (buttons, inputs, badges) under it.
- **(c)** Both.

➡️ (a). It exercises layout, typography, feedback and data display in one place, and it's what the app will look like anyway once Items give way to real resources.

**Answer:**
as recommended