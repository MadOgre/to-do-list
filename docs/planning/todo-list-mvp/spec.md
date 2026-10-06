Status: ready-for-agent

# Spec: Todo list MVP

Derived from `INTENT.md` and grilling rounds 1–4 in this folder. Follows ADR-0002 (Mantine provides the components; custom styles stay in SCSS modules). Terms are as defined in `CONTEXT.md`: Todo, Active, Completed, Demo Todos, Restore Demo Todos, Page, Shared Component, API Function, API Hook.

`INTENT.md` says "no saving functionality". Grilling round 2 replaced that with `localStorage` persistence through the Todo API. Where they disagree, the rounds and this spec win. `INTENT.md` stays as the developer wrote it.

## Problem Statement

The app's Home Page is still a placeholder that lists sample Items. The developer has a finished Figma design for a to-do list, with a style guide and image assets: light and dark themes, mobile and desktop layouts. The app doesn't implement any of it. The developer wants the design working as a real to-do list: add, complete, delete, filter and clear Todos, and switch between light and dark. Todos should survive a reload. The way they're stored now should be easy to swap for a real API later, and nothing should get in the way of adding drag and drop afterwards.

## Solution

The Home Page becomes the to-do list from the design. It is built with Mantine components and themed from the style guide, with Josefin Sans, the design's colors and the design's background images.

The user types a Todo and presses Enter to add it to the top of the list. They complete a Todo with its round check, delete it with its ✕ after confirming, filter by All / Active / Completed, and clear every Completed Todo after confirming. They see how many Todos are left, and they toggle light/dark with the sun/moon icon.

Every change goes through the Todo API Functions and API Hooks. For now the API Functions keep the list in the browser's `localStorage`, so it survives reloads. Each API Function carries its real axios call commented out next to the storage code, and one comment lists the steps to switch to a real API.

Until the user changes anything, the list shows the six **Demo Todos** from the design. A link in the style of the design's "Drag and drop to reorder list" hint brings them back after confirming (**Restore Demo Todos**). Drag and drop itself is not built.

## User Stories

1. As a user, I want the to-do list on the home page, so that I can start using it as soon as the app opens.
2. As a user, I want the page to look like the Figma design, so that the app feels finished and consistent.
3. As a user, I want a "TODO" header at the top, so that I know what the app is.
4. As a user, I want the six Demo Todos shown on my first visit, so that I can see how the list works before adding my own.
5. As a user, I want one Demo Todo already Completed, so that I can see what a Completed Todo looks like.
6. As a user, I want to type a new Todo into the "Create a new todo…" input, so that I can add things I need to do.
7. As a user, I want pressing Enter to add my Todo, so that adding is quick and needs no extra button.
8. As a user, I want a new Todo to appear at the top of the list, so that I see what I just added straight away.
9. As a user, I want a new Todo to start Active, so that it counts as something still to do.
10. As a user, I want the input cleared after my Todo is added, so that I can type the next one at once.
11. As a user, I want the input kept as typed if adding fails, so that I don't lose what I wrote.
12. As a user, I want leading and trailing spaces trimmed, so that my Todos look tidy.
13. As a user, I want pressing Enter on an empty or spaces-only input to do nothing, so that I don't create blank Todos by accident.
14. As a user, I want to add two Todos with the same title, so that I'm never blocked from writing what I mean.
15. As a user, I want long titles to wrap onto more lines, so that I can always read the whole Todo.
16. As a user, I want to mark a Todo Completed by clicking its round check, so that I can track progress.
17. As a user, I want the clickable area to include the space around the check, so that I don't need pixel-perfect aim.
18. As a user, I want clicking a Todo's text to do nothing, so that I don't complete Todos by accident (and so that the text stays free for drag and drop later).
19. As a user, I want to click a Completed Todo's check to make it Active again, so that I can undo a mistake.
20. As a user, I want a Completed Todo to show a gradient-filled check with a tick and struck-through, faded text, so that I can tell Completed from Active at a glance.
21. As a user, I want to delete a Todo with its ✕, so that I can remove things I no longer need.
22. As a mouse user, I want the ✕ to show only on the row I'm hovering (or have focused), so that the list stays uncluttered.
23. As a touch user, I want the ✕ always visible, so that I can delete without hover.
24. As a user, I want a confirmation dialog before a Todo is deleted, naming the Todo, so that I don't delete one by accident.
25. As a user, I want to cancel that dialog and keep my Todo, so that a misclick costs nothing.
26. As a user, I want to see how many Active Todos are left, so that I know how much remains.
27. As a user, I want the count to say "1 item left" for one and "N items left" otherwise, so that it reads correctly.
28. As a user, I want the count to stay the same whichever filter is selected, so that it always means the same thing.
29. As a user, I want to filter the list to All, Active or Completed, so that I can focus on what matters now.
30. As a user, I want the selected filter shown in blue, so that I know which one is applied.
31. As a user, I want the filter to go back to All on reload, so that I always start from the full list.
32. As a user, I want "Clear Completed" to delete every Completed Todo at once, so that I can tidy up in one click.
33. As a user, I want a confirmation dialog saying how many Completed Todos will be deleted, so that I don't clear them by accident.
34. As a user, I want "Clear Completed" to do nothing when no Todo is Completed, so that I'm not asked to confirm something that changes nothing.
35. As a user, I want "Clear Completed" always visible, so that the footer layout doesn't jump around.
36. As a user, I want "Nothing to do. Add a todo above." when I have no Todos, so that the empty list doesn't look broken.
37. As a user, I want "No active todos." when the Active filter matches nothing, so that I know why the list is empty.
38. As a user, I want "No completed todos." when the Completed filter matches nothing, so that I know why the list is empty.
39. As a user, I want my Todos to still be there after I reload or come back later, so that I don't lose my list.
40. As a user, I want my list to stay empty after I've deleted every Todo and reloaded, so that the Demo Todos don't come back uninvited.
41. As a user, I want a "Restore demo todos" link under the list, so that I can get back to the starting list.
42. As a user, I want a confirmation dialog before Restore Demo Todos replaces my list, so that I don't lose my Todos by accident.
43. As a user, I want the Restore link to work even when my stored list can't be loaded, so that I can recover from bad data.
44. As a user, I want a sun/moon toggle in the header to switch between light and dark, so that I can pick what's comfortable.
45. As a user, I want the app to start in my OS's light or dark setting, so that it matches my system on first visit.
46. As a user, I want my light/dark choice remembered, so that I don't have to switch again each visit.
47. As a user, I want the header background image to match the theme (mountains in light, the corridor in dark), so that the whole page changes with the theme.
48. As a mobile user, I want the mobile background images and a layout that fits a narrow screen, so that the app works well on my phone.
49. As a mobile user, I want the filters in their own card under the list, so that the footer isn't cramped.
50. As a user on any screen from 320px up, I want the page to stay usable without horizontal scrolling, so that the app works on every device.
51. As a user, I want a red message in place of the list if my Todos can't be loaded, so that I know something is wrong.
52. As a user, I want a red message above the list if a change can't be saved, with the list left as it was, so that I know my change didn't happen.
53. As a screen reader user, I want the theme toggle to say "Switch to dark theme" or "Switch to light theme", so that I know what it does.
54. As a screen reader user, I want each ✕ labeled "Delete “<title>”", so that I know which Todo it deletes.
55. As a screen reader user, I want each check labeled with its Todo's title, so that I know which Todo I'm completing.
56. As a screen reader user, I want the input labeled "Create a new todo", so that I know what it's for.
57. As a keyboard user, I want to reach every control with Tab and toggle a check with Space, so that I can use the app without a mouse.
58. As a user, I want the browser tab to show the design's favicon and the title "Todo app", so that I can find the tab easily.
59. As a developer, I want every change to go through the Todo API Functions and API Hooks, so that swapping in a real API later doesn't touch the components.
60. As a developer, I want each API Function to keep its real axios call commented out next to the storage code, so that switching is uncommenting and deleting.
61. As a developer, I want one short comment listing the switch steps, so that I don't have to rediscover them.
62. As a developer, I want everything that exists only for `localStorage` (the storage key, the Demo Todos, the read/write helpers) in one module, so that the switch deletes it whole.
63. As a developer, I want Restore Demo Todos to be demo-only, so that the switch deletes it too instead of needing a server endpoint.
64. As a developer, I want no artificial delay in the API Functions, so that every click shows immediately without optimistic-update code.
65. As a developer, I want Item renamed to Todo throughout the data access layers, so that the code uses the glossary's term.
66. As a developer, I want the unused mock adapter removed, so that no dead code is left.
67. As a developer, I want the style guide's colors and font in the Mantine theme, so that all color decisions live in one place and SCSS modules only use Mantine CSS variables.
68. As a developer, I want the page split into Shared Components (theme toggle, new-todo input, Todo row, footer with filters), so that each part stays small and the Todo row is ready to wrap for drag and drop.
69. As a developer, I want the Figma screenshots and style guide kept with this feature's planning files, so that the spec and tickets can link to the design.
70. As a developer, I want the install, lint, build and dev-server checks to pass with my existing pnpm and Node, so that the build stays green.
71. As a developer, I want to be asked to stop my dev server before the new dependency is installed, so that the shared Vite dependency cache isn't corrupted.

## Implementation Decisions

### Data: the Todo type

- **The Todo interface replaces the Item interface** in the shared interfaces area (one file, with its derived types):

  ```ts
  interface Todo { id: string; title: string; completed: boolean }
  type CreateTodoInput = Pick<Todo, "title">;
  type UpdateTodoInput = Partial<Omit<Todo, "id">>;
  ```

  A new Todo is always Active. A real server would set `id` and `completed` itself, which is why `CreateTodoInput` is the title only.

### Data: the Todo API Functions

- **They replace the Item API Functions.** Each is `async` and returns the same types it would with a real API, so nothing above it changes at the switch.
  - `getTodos()` returns `Todo[]` in display order.
  - `getTodo(id)` returns `Todo`. It is kept, though nothing uses it yet.
  - `createTodo(input)` returns the new `Todo`, added at the top.
  - `updateTodo(id, input)` returns the updated `Todo`. It is used to toggle `completed`.
  - `deleteTodo(id)`.
  - `clearCompletedTodos()` deletes every Completed Todo in **one** request.
  - `restoreTodos()` performs Restore Demo Todos. It is demo-only: it has no real-API version and is deleted at the switch.
- **Real-API calls are commented out.** Each function except `restoreTodos` keeps its real call commented out above its `localStorage` code, as a "REAL API" block, followed by a "LOCAL STORAGE" block. The real calls use the shared `apiClient`:
  - `GET /todos`
  - `GET /todos/:id`
  - `POST /todos`
  - `PATCH /todos/:id`
  - `DELETE /todos/:id`
  - `DELETE /todos?completed=true`

  The `apiClient` import is commented out too, because lint fails on unused imports.
- **One comment at the top of the Todo API module lists the switch steps:**
  1. Set `VITE_API_BASE_URL` in `.env.local`.
  2. Uncomment the `apiClient` import and each function's REAL API lines, and delete its LOCAL STORAGE lines.
  3. Delete the storage module and `restoreTodos`, together with its API Hook and the Restore Demo Todos link in Home.

  Keep the comment concise but complete.
- **Shape of a function.** Agreed in round 4, trimmed:

  ```ts
  export const createTodo = async (input: CreateTodoInput) => {
    // REAL API:
    // const { data } = await apiClient.post<Todo>("/todos", input);
    // return data;

    // LOCAL STORAGE:
    const todo: Todo = { id: crypto.randomUUID(), completed: false, ...input };
    writeTodos([todo, ...readTodos()]);
    return todo;
  };
  ```

### Data: the storage module

- **A new module in the API area holds everything that exists only for `localStorage`:**
  - the storage key
  - the six Demo Todos, matching the design's titles and order, with "Complete online JavaScript course" Completed and the rest Active
  - `readTodos()`, which returns the Demo Todos when nothing is stored, and otherwise the stored list as stored, **including an empty one**
  - `writeTodos(todos)`

  If stored data doesn't parse, `readTodos` throws: the load fails and the error Alert shows. The Demo Todos are never shown silently in its place. The Demo Todos aren't written to storage until the first change.
- **`restoreTodos` removes the stored list**, so the next read falls back to the Demo Todos. This also clears bad data.
- **The mock adapter module is deleted**, since nothing uses it. The `apiClient` module and `VITE_API_BASE_URL` stay for the switch.
- **No artificial delay.** The mock adapter's 500 ms existed only to show loading states.

### Data: the Todo API Hooks

- **They replace the Item API Hooks:** `useTodos`, `useTodo(id)`, `useCreateTodo`, `useUpdateTodo`, `useDeleteTodo`, `useClearCompletedTodos`, `useRestoreTodos`.
- **Every mutation invalidates the Todo list on success**, as the Item hooks did. No optimistic updates.

### Page and components

- **Home** lays out the page and owns the data. It reads the list from `useTodos()`, calls the mutation hooks, and holds the selected filter in component state. The filter starts at All and isn't put in the URL or stored. The filtered list and the Active count are derived from the hook's data on each render. There is no separate list state: Mantine's `useListState` is not used.
- **Shared Components**, each in its own folder under the components area with its SCSS module, typed `FC<ComponentNameProps>`:
  - **Theme toggle.** A Mantine `ActionIcon` showing the design's moon icon in light and sun icon in dark. It uses `useMantineColorScheme` and has an aria-label of "Switch to dark theme" or "Switch to light theme".
  - **New-todo input.**
    - A Mantine `TextInput` with placeholder "Create a new todo…" and a visually hidden label "Create a new todo". Its left section is an empty, decorative circle.
    - On Enter it trims the value and ignores it if empty. Otherwise it calls an `onCreate` callback, and clears only once the create succeeds.
  - **Todo row.**
    - A Mantine `Checkbox` (round, gradient fill and the design's check icon when checked), labeled for screen readers with the Todo's title. It sits in a clickable left gutter that covers the row's full height up to the text.
    - The title text is not part of the checkbox's label and doesn't toggle it.
    - The ✕ is a Mantine `ActionIcon` with the design's cross icon, labeled "Delete “<title>”". On devices with hover it shows on row hover and focus-within; on touch devices it is always visible.
    - Completed styling: struck-through, faded title.
  - **Footer.**
    - Shows "N items left" ("1 item left" in the singular) and "Clear Completed" as a transparent Mantine `Button`.
    - The filters are three Mantine `Button`s with `variant="transparent"`, blue when selected.
    - From `sm` up the filters sit inline in the footer. Below `sm` they move to their own card under the list.
- **The components barrel** is created with the first Shared Component, per the code conventions.
- **Confirmation dialogs** use `@mantine/modals` `modals.openConfirmModal`, with `ModalsProvider` added at the app root inside `MantineProvider`. Each has a red confirm button and **Cancel**:
  - **Delete:** title "Delete todo?", body "“<title>” will be deleted.", confirm **Delete**.
  - **Clear Completed:** title "Delete completed todos?", body "N completed todos will be deleted." (singular for one), confirm **Delete**. It only opens when at least one Todo is Completed.
  - **Restore Demo Todos:** title "Restore demo todos?", body "Your current todos will be replaced by the six demo todos.", confirm **Restore**.
- **Restore link.** "Restore demo todos" is a Mantine `Anchor` rendered as a button, with a hover state. It sits where the design shows the drag-and-drop hint (small, dimmed, centered under the list card) and is always visible. It is demo-only, and removed at the switch.
- **Empty states**, in dimmed text inside the list card above the footer:
  - "Nothing to do. Add a todo above." when there are no Todos at all, whatever the filter
  - "No active todos." when the Active filter matches nothing
  - "No completed todos." when the Completed filter matches nothing
- **Errors.** These are red Mantine `Alert`s:
  - **Load fails:** "Could not load your todos." in place of the list. The Restore link still shows and works.
  - **A change fails:** "Could not save your change." above the list, which stays as it was.
- **Loading state:** nothing extra, since `localStorage` answers immediately.

### Theme and styling

- **The Mantine theme carries the style guide.** Blue 500 (`hsl(220, 98%, 61%)`) is the primary color, as a custom color tuple. Josefin Sans (400 and 700) is the font family. The light and dark surface and text colors come through Mantine's theme (custom colors and a CSS variables resolver):
  - **Light:** page Gray 50; cards White; text Navy 850; dimmed Gray 600; dividers and the Completed title Gray 300.
  - **Dark:** page Navy 950; cards Navy 900; text Purple 300; hover Purple 100; dimmed Purple 600; Completed title Purple 700; dividers Purple 800.

  Match the screenshots where the style guide leaves a role open. The green primary color goes. `defaultRadius` and breakpoints stay as they are.
- **SCSS modules use only Mantine CSS variables and the injected `mantine` helpers** (ADR-0002): `mantine.rem()`, `@include mantine.light` / `mantine.dark` for the theme-dependent background images, `@include mantine.hover`, and `mantine.smaller-than(mantine.$mantine-breakpoint-sm)` / `larger-than` for the mobile/desktop switch. No hard-coded colors.
- **Check gradient:** `hsl(192, 100%, 67%)` to `hsl(280, 87%, 65%)`, from the style guide.
- **Background images:** the light/dark × mobile/desktop images from the images area. They are full-width at the top of the page behind the header, with the page color below, as in the screenshots.
- **Typography** follows the design's text presets: 18px body on desktop with -0.25px letter spacing, and smaller presets (14px / 12px) on mobile and in the footer. The header "TODO" is bold, white and widely letter-spaced.
- **Layout** is centered, with the design's widths at 375px and 1440px. It works without horizontal scrolling from 320px up.
- **Light/dark:** Mantine's color scheme with `defaultColorScheme="auto"`, so the OS setting applies first. Mantine's default `localStorage` color scheme manager remembers the choice. Add Mantine's `ColorSchemeScript` (or its equivalent attribute script) to the HTML entry page, to avoid a flash of the wrong theme.

### HTML entry page and assets

- Google Fonts `<link>`s for Josefin Sans 400 and 700, with preconnect.
- The favicon becomes the design's 32×32 PNG, served from the public folder and replacing the current SVG.
- The title becomes "Todo app".
- The Figma screenshots and `STYLEGUIDE.md` move from the untracked root folder into a `design` folder inside this feature's planning folder, and are committed.

### Dependencies

- Add `@mantine/modals` at the same version range as `@mantine/core` (`^9.6.3`). It is the only new dependency. The developer stops their `pnpm dev` before it is installed.

### Domain glossary

- `CONTEXT.md` already has Todo, Active, Completed, Demo Todos and Restore Demo Todos, and no longer has Item. No further change.

## Testing Decisions

- **No test runner and no automated tests.** The developer's intent rules them out, and this was confirmed when choosing the seams.
- **Seam 1: the Keep the build green checks** (`pnpm install`, `pnpm lint`, `pnpm build`, a short `pnpm dev` start), with the developer's pnpm and Node. `pnpm build` type-checks the Todo types, the API Functions and Hooks, the components' props and the theme. It also compiles every SCSS module through the injected helpers. Lint checks the conventions, including that no unused `apiClient` import is left active.
- **Seam 2: the Home Page in the running app.** This checks external behavior only, what the user sees. Open `/` and confirm:
  1. **First visit** (empty storage for the app's key): the six Demo Todos show, the first Completed, with "5 items left".
  2. **Adding:**
     - Enter adds a trimmed Todo at the top and clears the input.
     - Empty or spaces-only input adds nothing.
     - A duplicate title is added.
     - A long title wraps.
  3. **Completing:**
     - The check and its gutter toggle Completed.
     - Clicking the title does nothing.
     - Completed styling shows, and the count updates.
  4. **Deleting:**
     - The ✕ shows on hover with a mouse and always in a touch-emulated view.
     - The dialog names the Todo. Cancel keeps it and Delete removes it.
  5. **Filters:**
     - All / Active / Completed filter the list, and the selected one is blue.
     - The count stays the same whichever filter is selected.
     - Each empty-state message appears in its case.
  6. **Clear Completed:**
     - The dialog shows the count, and confirming deletes them all.
     - With none Completed, clicking it does nothing.
  7. **Persistence:**
     - Changes survive a reload, and the stored list is visible in devtools.
     - Deleting every Todo and reloading leaves the list empty.
     - The filter resets to All.
  8. **Restore Demo Todos:** the dialog shows. Confirming brings back the six and removes the stored key.
  9. **Load error:** put invalid JSON under the storage key in devtools and reload. "Could not load your todos." shows, and Restore recovers. No code change is needed.
  10. **Theme:**
      - It starts from the OS setting.
      - The toggle switches the colors, icon and background image, and the choice survives a reload.
      - There is no flash of the wrong theme.
  11. **Responsive:**
      - Check at 320px, 375px, just below and above 768px, and 1440px.
      - The mobile images and the separate filter card show below `sm`.
      - There is no horizontal scroll.
  12. **Accessibility:**
      - Tab reaches every control, and Space toggles a check.
      - The labels on the toggle, the ✕s, the checks and the input read as specified.
  13. **Assets:** the favicon, the "Todo app" title and the Josefin Sans font.
- **The "change failed" Alert is checked by reading the code.** It can't be triggered from devtools without a code change: blocking storage or filling the quota is browser-specific.
- **Prior art:** none in the repo. The mantine-install spec used the same two seams.

## Out of Scope

- Drag-and-drop reordering, and its hint text. Drag and drop is planned for a later feature, and the Todo row and its non-clickable title are kept ready for it.
- Editing a Todo's title.
- A real backend, and the switch to it. Only the commented calls and the switch comment are delivered.
- Optimistic updates, and any artificial delay.
- A test runner and automated tests.
- Storing the selected filter or putting it in the URL.
- Undo after deleting, beyond the confirmation dialogs.
- Changes to the NotFound Page.
- Any new dependency other than `@mantine/modals`, including drag-and-drop libraries, `@mantine/notifications` and `@fontsource` packages.

## Further Notes

- The developer must stop their `pnpm dev` before `@mantine/modals` is installed (Keep the build green rule).
- The design's frames disagree on the ✕: one desktop frame shows it on every row. The hover behavior follows the interaction frame (4.png) and the mobile frames.
- Mantine's color scheme choice is stored in `localStorage` under Mantine's own key. It is separate from the Todo storage key, and Restore Demo Todos doesn't touch it.
- The demo-only parts (the storage module, the Demo Todos, `restoreTodos`, its hook and the Restore link) are what the switch deletes. Keep them clearly marked so a later reader finds them all from the switch comment.
- No ADR: the `localStorage` approach is built so the switch is easy, so it doesn't meet the "hard to reverse" bar.
