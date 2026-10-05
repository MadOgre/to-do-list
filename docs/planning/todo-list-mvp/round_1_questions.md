# todo-list-mvp: Round 1 questions

What I worked from: `INTENT.md`, the four screenshots and `STYLEGUIDE.md` in `figma_screenshots/`, the files in `src/images/`, and the current code (`Home`, `theme.ts`, `index.html`, the placeholder Item data access layers).

From the screenshots, the design shows:

- A **TODO** header with a sun/moon toggle, over a background image that changes with the theme and with mobile/desktop width.
- A "Create a new todo…" input.
- A list of todos. Each has a round check (gradient fill with a tick when completed, struck-through text) and an ✕ to delete it. On desktop the ✕ shows on hover; in the middle frames and on mobile it is always visible.
- A footer with "N items left", the filters **All / Active / Completed**, and "Clear Completed". On mobile the filters move to their own card below the list.
- A "Drag and drop to reorder list" hint under the list.

---

❓ **Q1** - **Drag and drop to reorder**: The design promises drag and drop with its hint text. Mantine has no drag and drop of its own: its docs point to a separate library (`@hello-pangea/dnd`), which would be a new dependency plus reorder logic. Your intent says to clear any custom logic with you first. Options:

- (a) Leave drag and drop out of the MVP, and drop the hint text so the page doesn't promise something it can't do.
- (b) Leave drag and drop out, but keep the hint text so the page matches the design exactly.
- (c) Build it with `@hello-pangea/dnd` (new dependency, plus reorder logic).

➡️ (a). It is the one feature that needs a new dependency and real custom logic, and a hint for a feature that doesn't exist reads as a bug.

**Answer:**
as recommended

---

❓ **Q2** - **What the list holds on first load**: With no saving, every reload starts over. Should the app start with:

- (a) The six todos from the design ("Complete online JavaScript course" completed, the other five active).
- (b) An empty list.

➡️ (a). The page looks like the design on first load, and every feature (filters, count, Clear Completed) can be tried right away.

**Answer:**
as recommended

---

❓ **Q3** - **Name of the thing in the list**: `CONTEXT.md` defines **Item** as the placeholder resource and lists "todo" under _Avoid_ for it, because Item was never meant to be a to-do. The design says "todo" ("Create a new todo…") but also "5 items left". I'd add **Todo** to the glossary as the real thing a user adds, completes and deletes, keep **Item** as the placeholder it already is, and treat "items left" as UI copy only. Is **Todo** the term (rather than Task, Entry, …)?

➡️ Yes: **Todo**, with "task" and "item" under _Avoid_ for it.

**Answer:**
yes for this project Todo can replace Item, you can remove the placeholder resource as this app has no further need for it

---

❓ **Q4** - **The placeholder Item layers**: Home is currently the only user of `useItems`. Once Home becomes the to-do list, the Item API Function, API Hook, mock adapter and `Item` interface have no consumer. Todos live only in the browser's memory, so they don't go through the API layers at all. Options:

- (a) Leave the Item layers in place, unused, for a later feature that needs a real API.
- (b) Delete them in this feature.

➡️ (a). Removing them is outside "only the to-do list", and they were built as the example to copy when a real API arrives.

**Answer:**
Item should now be called Todo as per Q3 but leave all the mock routes and logic in place for future api hookup

---

❓ **Q5** - **Light/dark switch: starting theme and memory**: Mantine's colour scheme switching (`useMantineColorScheme`) is built in. By default Mantine stores the chosen scheme in `localStorage`, so it survives a reload. Your intent says no saving functionality. Two parts:

- Starting theme: (a) light, as in the first design frames, or (b) follow the OS setting.
- Memory: (a) keep Mantine's default of remembering the choice in `localStorage`, or (b) forget it on reload.

➡️ Starting theme: (b), follow the OS setting. Memory: (a), keep Mantine's default. "No saving" reads as being about the todos, and this is Mantine's out-of-the-box behaviour, not anything we'd build.

**Answer:**
as recommended

---

❓ **Q6** - **Adding a todo**: The design shows typing into the input but not how a todo gets created. My reading of the usual behaviour:

- Pressing Enter adds the todo at the bottom of the list, as active, and clears the input.
- Leading and trailing spaces are trimmed, and an empty or spaces-only input adds nothing.
- The circle in the input is decorative, not a "create as completed" toggle.

Is that right?

➡️ Yes to all three.

**Answer:**
pressing enter adds the todo to the TOP of the list as active and clears the input
yes on other two items

---

❓ **Q7** - **Completing and deleting**:

- Completing: does clicking the todo's text toggle it too, or only the round check? A Mantine `Checkbox` with the text as its label makes both work with no extra code.
- Deleting: the ✕ deletes at once, with no confirmation and no undo.
- Editing a todo's text isn't in the design, so it is out.

➡️ Clicking the text toggles too (Mantine's default behaviour). ✕ deletes at once. No editing.

**Answer:**
only clicking the checkbox or the general area around it counts as completion, I want to later implement drag and drop and having the entire item clickable will interfere
Deleting a todo should pop a basic confirmation dialog
No editing at this stage

---

❓ **Q8** - **When the ✕ is visible**: The desktop frames disagree: one shows the ✕ only on the hovered row, another shows it on every row. Mobile always shows it. Options:

- (a) On devices with a mouse, show it on hover (and on keyboard focus); on touch devices, always show it.
- (b) Always show it everywhere.

➡️ (a). It matches the hover frame in `4.png` and the mobile frames, and touch screens can't hover.

**Answer:**
as recommended

---

❓ **Q9** - **Footer behaviour**:

- "N items left" counts the active todos, whatever filter is selected. Should it read "1 item left" for one todo (a tiny bit of custom logic) or always say "items"?
- "Clear Completed" deletes every completed todo, and stays visible even when nothing is completed.
- When a filter matches no todos (e.g. Completed with none completed), the list area is simply empty, with the footer still showing. The design shows no empty-state message.

➡️ "1 item left" in the singular. Clear Completed always visible. No empty-state message.

**Answer:**
"1 item left" in the singular. Clear Completed always visible. Add a basic empty state message as appropriate

---

❓ **Q10** - **Josefin Sans**: The style guide's font isn't installed. Options:

- (a) A Google Fonts `<link>` in `index.html` (no new dependency).
- (b) The `@fontsource/josefin-sans` package (a new dependency, served from our own build, works offline).

➡️ (a). No new dependency, and it is what the style guide links to.

**Answer:**
as recommended

---

❓ **Q11** - **Favicon and page title**: `src/images/` has `favicon-32x32.png`. Should it replace `public/favicon.svg` (moved to `public/`), and should the `<title>` change from "to-do-list"? If so, to what?

➡️ Replace the favicon with `favicon-32x32.png`, and set the title to "Todo app".

**Answer:**
as recommended

---

❓ **Q12** - **The `figma_screenshots/` folder**: It is untracked and holds about 12 MB of PNGs plus `STYLEGUIDE.md`. Options:

- (a) Move it into `docs/planning/todo-list-mvp/design/` and commit it with the feature, so the spec and tickets can link to it.
- (b) Commit it where it is.
- (c) Keep it out of git (add to `.gitignore`).

➡️ (a). It is the design this feature was planned from, so it belongs with the feature's planning record. If 12 MB in git is too much, (c).

**Answer:**
as recommended
