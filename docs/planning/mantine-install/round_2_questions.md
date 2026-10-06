# Mantine install: grilling round 2

Settled in round 1:

- Folder renamed to `docs/planning/mantine-install/`.
- Install only `@mantine/core` + `@mantine/hooks`.
- SCSS modules stay for layout and custom styles, Mantine provides the components, and `global.scss` drops what Mantine already sets.
- `createTheme()` in `src/theme.ts`, with `primaryColor` and `defaultRadius` set and nothing else.
- Light color scheme only.
- Import directly from `@mantine/core`, with no wrappers.
- Rebuild the existing Home with Mantine components.
- Round 1 Q4 said yes to the PostCSS preset. Q1 below reopens it because of a fact I found afterwards.

---

❓ **Q1** - **PostCSS preset and SCSS don't mix**: I compiled the preset's syntax with the project's Sass (`sass-embedded` 1.105.0). Vite runs Sass first and PostCSS on its output, so the preset only sees what survives Sass:

| Preset feature | In a `.scss` file |
| --- | --- |
| `@mixin hover { … }`, `@mixin dark`, `@mixin smaller-than sm` | **Silently dropped.** Sass reads it as *defining* a Sass mixin, so the styles never reach the page and there's no error. |
| `rem(16px)` | **Build error.** Sass has its own `rem()` (a modulo function) that needs 2 arguments. |
| `$mantine-breakpoint-sm` | **Build error.** Undefined Sass variable. |
| `em(16px)`, `light-dark(…)` | Works: Sass passes them through to PostCSS. |

So in our SCSS modules the preset gives us only `em()` and `light-dark()`, and `light-dark()` doesn't matter while we're light-only. Answering "if it's not going to hurt anything": inside `.scss` the mixins would hurt, because they fail silently. Options:

- **(a)** Install the preset. Pages keep their `.module.scss`, and a component that wants Mantine's mixins uses a `.module.css` file instead, where everything works. That gives two style formats, and the rule for which to use goes into `CLAUDE.md`.
- **(b)** Switch style modules to `.module.css` + the preset (Mantine's own setup), and drop SCSS modules. This changes an existing convention: Pages would sit next to a CSS module, not an SCSS one.
- **(c)** Skip the preset. Add a small `src/styles/_mantine.scss` partial with Sass versions of the mixins you'd use (`hover`, `smaller-than`/`larger-than` with Mantine's breakpoint values), so you get the same mixins with a single format. These are hand-written copies that we maintain ourselves.
- **(d)** Skip the preset and the mixins. Use Mantine's CSS variables in SCSS only.

➡️ (a). You get Mantine's real mixins, maintained by Mantine, and the SCSS convention stays as it is. The cost is one extra rule: use `.module.css` when you need Mantine mixins, otherwise `.module.scss`.

**Answer:**
Okay, I decided I no longer care about Mantine's mixin nonsense. If it's going to be that complicated and potentially break my build, I want to keep SCSS rules and use Mantine's recommendation for how to use SCSS with Mantine. I want to basically lean into SCSS usage, and if Mantine provides something that doesn't work with SCSS, I want to use the SCSS variant of that.

---

❓ **Q2** - **Theme values**: Round 1 settled that `src/theme.ts` sets `primaryColor` and `defaultRadius`. Which values? Mantine's defaults are `blue` and `sm`. Primary color is any of Mantine's palettes (`blue`, `indigo`, `violet`, `teal`, `green`, `cyan`, `grape`, `pink`, `red`, `orange`, `yellow`, `lime`, `gray`, `dark`). Radius is `xs`–`xl`.

➡️ `primaryColor: "blue"`, `defaultRadius: "md"`. Blue keeps the stock look, and `md` gives cards and buttons slightly softer corners than the default. Easy to change later.

**Answer:**
radius is md but switch primary color to green

---

❓ **Q3** - **What's left of `global.scss`**: Mantine's `styles.css` covers the box-sizing reset, the font stack and the line height. The rebuilt Home sits in a Mantine `Container`, which provides page padding and a max width, so `body { padding: 2rem }` becomes redundant too. That leaves the file with no rules. Options: **(a)** keep `global.scss` with only its header comment, imported after `@mantine/core/styles.css` in `main.tsx`, as the place for future global rules; **(b)** delete the file and its import, and recreate it when a global rule is needed.

➡️ (a). The import order (Mantine first, our globals after, so ours win) is fixed now and doesn't need rediscovering later. The file is two lines.

**Answer:**
as recommended

---

❓ **Q4** - **How Home shows the Items**: Round 1 offered a `Stack` of `Card`s or a `List`. **(a)** One `Card` per Item, with `name` as the card title and `description` as dimmed `Text` underneath. **(b)** A Mantine `List`, which looks like today's bullet list but in Mantine's typography.

➡️ (a). Cards demonstrate more of Mantine (surfaces, spacing, radius from the theme), which is the point of the demo.

**Answer:**
as recommended

---

❓ **Q5** - **Home's style module**: Today `Home.module.scss` only styles `.intro` (gray italic). Mantine can do that with props (`<Text c="dimmed" fs="italic">`), which would leave the module empty. **(a)** Keep the module and rewrite `.intro` with Mantine's CSS variables (`color: var(--mantine-color-dimmed)`). That demonstrates SCSS and Mantine working together, which is what round 1 Q3 decided on. **(b)** Use props and delete the module.

➡️ (a). It keeps the "Page + its SCSS module" convention visible in the one real Page, and shows how SCSS reads Mantine's theme.

**Answer:**
as recommended

---

❓ **Q6** - **Record the decision as an ADR**: Adopting Mantine is hard to reverse (every component will use it), and it had real alternatives (another component library, or none). Write `docs/adr/0002-mantine-component-library.md`, covering Mantine for components, SCSS modules for custom styles, and the Q1 outcome?

➡️ Yes. The style-format decision (Q1) is the kind of "why" that gets lost.

**Answer:**
yes

---

❓ **Q7** - **Code conventions in `CLAUDE.md`**: Review checks the conventions listed in `CLAUDE.md`. Add a bullet during implementation, along the lines of: "UI components come from `@mantine/core`, imported directly; custom styles go in the Page's SCSS module using Mantine's CSS variables" (plus the Q1 rule on style formats)? Grilling only writes documents, so this would be part of the implementation work, not this session.

➡️ Yes, one bullet, written during implementation.

**Answer:**
as recommended