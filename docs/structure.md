# Folder structure

A map of this repo: what each folder and file is for. It shows what exists today, not plans. Update it whenever a file or folder is added, moved or removed. Files that repeat (one per component, one per planning round) are described by their pattern instead of listed one by one. Terms such as Page, Shared Component, API Function and API Hook are defined in `GLOSSARY.md`.

Generated files aren't listed: `node_modules/` (installed packages), `dist/` (build output, including the zip Terraform uploads), Terraform's `.terraform/` folders (downloaded providers) and the local state file in `infra/bootstrap/`. All are gitignored.

```
to-do-list/
├── .gitattributes          makes git store every text file with LF (Linux) line endings, so Windows
│                           checkouts don't produce noisy diffs
├── .gitignore              what git leaves out: installed packages, build output, local env overrides
│                           (*.local, api/.env), editor and OS files, and Terraform's working folders,
│                           state files, variable files, crash logs and saved plans
├── .nvmrc                  pins Node 26 for version managers such as fnm and nvm
├── package.json            the workspace's root: pinned Node (engines) and pnpm (packageManager), the
│                           scripts that run in each package that has them (pnpm dev, build,
│                           typecheck, lint), pnpm deploy:dev (build the API, then terraform apply
│                           in infra/envs/dev),
│                           and the tools every package shares (TypeScript, ESLint and its plugins)
├── pnpm-workspace.yaml     which folders are the workspace's packages, and the install scripts pnpm
│                           skips (esbuild's and @parcel/watcher's), with why each is safe to skip,
│                           and the catalog: the one version of each dependency that two or more
│                           packages list, as "catalog:" (TypeScript locked to one exact version)
├── pnpm-lock.yaml          the exact version of every installed package; written by pnpm, committed
├── tsconfig.base.json      the TypeScript settings every package shares
├── eslint.config.base.js   the lint rules every package shares: quotes, commas, semicolons, indent,
│                           spaces inside object braces and after async, destructuring, arrow functions, the import
│                           and export order (through eslint-plugin-perfectionist) and named exports only
├── eslint.config.js        lints the root's own files (such as eslint.config.base.js) with those rules;
│                           each package has its own eslint.config.js
├── README.md               the quick start: prerequisites, install and run, the scripts, the docs
├── CLAUDE.md               instructions for AI coding agents: the code map (pointers to the CLAUDE.md
│                           in frontend/, api/, common/ and infra/), where issues, specs and domain docs live,
│                           and the working rules for this repo (workflow, keep the build green, AWS
│                           and Terraform, review until clean, code conventions, grilling sessions)
├── GLOSSARY.md             the project's terms and the synonyms to avoid, in five sections: the
│                           source layout, data access, the API, the to-do list, and the operations
│                           on Todos, one name for each through every layer
│
├── .claude/
│   └── settings.json       shared Claude Code project settings: enables the official Figma plugin, so
│                           the design can be read from the Figma file
├── .vscode/
│   ├── extensions.json     recommends the ESLint extension when the folder is opened in VS Code
│   └── settings.json       shared workspace settings: 2-space indentation, ESLint fixes on save
│                           instead of a formatter, and the workspace's own TypeScript version
│
├── docs/
│   ├── structure.md        this file
│   ├── local-development.md   how to run the app on your machine, and what that doesn't imitate
│   ├── logging.md          how the API's two logs work and how to follow one request through both
│   ├── adding-and-removing-resources.md   every place a resource touches, the steps to add or
│   │                                      remove one, and a code template for each file
│   ├── adr/                architecture decision records, one per decision: NNNN-<decision>.md
│   │   └── 0001-mantine-components-with-scss-modules.md   Mantine provides the UI components, and
│   │                                                       custom styles stay in SCSS modules, using
│   │                                                       Mantine's Sass helpers
│   ├── agents/
│   │   ├── domain.md       tells AI coding agents to read GLOSSARY.md and the ADRs before exploring,
│   │   │                   and to use the glossary's terms
│   │   ├── issue-tracker.md   tells AI coding agents that issues and specs are markdown files under
│   │   │                      docs/planning/, how they're laid out, and that each feature folder
│   │   │                      starts from the developer's INTENT.md, with its template
│   │   └── triage-labels.md   maps the agent skills' triage roles to the issue files' status labels
│   ├── code-audit/         one file per audit of the whole repo: code-audit-<date>.md
│   │   └── code-audit-2026-11-24.md   46 issues found: 33 fixed, 13 closed after discussion, and
│   │                                  none left unfixed. A summary on top, then the working record
│   └── planning/           one folder per feature: its planning record
│       ├── <feature>/INTENT.md          the goal, definition of done, constraints and acceptance
│       │                                criteria, in the developer's own words
│       ├── <feature>/round_N_questions.md   one per grilling round: its questions and the answers
│       ├── <feature>/spec.md            the spec derived from the intent and the grilling rounds
│       ├── <feature>/issues/NN-<ticket>.md   one per ticket
│       ├── mantine-install/    installing Mantine and its Sass helpers
│       └── todo-list-mvp/      the to-do list from the Figma design. Also has design/: the Figma
│                               screenshots (1.png … 4.png), STYLEGUIDE.md (layout widths, colors,
│                               typography) and FIGMA.md (the Figma file's link and frame IDs, and the
│                               sizes and colors measured from it, so Figma needn't be queried again)
│
├── frontend/               the React app, as the package @to-do-list/frontend
│   ├── package.json        its libraries (React, Mantine, React Router, React Query, axios, the shared schemas from common/), its tools
│   │                       (Vite and its plugins, Sass, the React lint plugins), and its scripts:
│   │                       dev, build, lint, preview
│   ├── GUIDE.md            the frontend's conventions, and where the project came from
│   ├── CLAUDE.md           for AI coding agents: the frontend's data flow and where to find each part
│   ├── index.html          the HTML page Vite serves and builds from. Sets the favicon and the "Todo
│   │                       app" title, loads Josefin Sans from Google Fonts, applies the stored or OS
│   │                       color scheme before the app loads (Mantine's ColorSchemeScript, inlined),
│   │                       holds the root element and loads src/main.tsx
│   ├── .env                environment variables for every mode: VITE_API_BASE_URL, the base URL of
│   │                       the shared axios instance, is /api. Override it in a gitignored .env.local
│   ├── vite.config.ts      Vite config: the React plugin, the checker plugin that shows TypeScript and
│   │                       ESLint errors during pnpm dev, the dev server on localhost and fixed port
│   │                       9000, the proxy that sends /api to the API's dev server on port 3000, the
│   │                       injection of Mantine's Sass helpers into every SCSS file, and the @/ alias
│   ├── eslint.config.js    starts from eslint.config.base.js and adds typescript-eslint's type-aware
│   │                       rules, the React Hooks and React Refresh rules, and browser globals
│   ├── tsconfig.json       only references the two configs below, so tsc -b checks both
│   ├── tsconfig.app.json   extends tsconfig.base.json for the app code in src/: browser libraries,
│   │                       bundler module resolution, JSX, unused-code checks and the @/ alias
│   ├── tsconfig.node.json  extends tsconfig.base.json for vite.config.ts, which runs in Node
│   ├── public/
│   │   └── favicon-32x32.png   the design's 32×32 favicon, served as is
│   └── src/
│       ├── main.tsx        the entry point. Loads Mantine's styles, then the global styles, and
│       │                   renders the app with the Mantine provider (the theme, its CSS variables
│       │                   resolver, and the color scheme starting from the OS setting), the pop-up
│       │                   messages, the React Query provider, the router and React Query Devtools
│       │                   (development only)
│       ├── routes.tsx      every route, in React Router's data mode: the Home Page at / and the
│       │                   NotFound Page for anything else
│       ├── query-client.ts the React Query client. Its MutationCache shows a red pop-up message for
│       │                   every failed change, with the text from api/error-text.ts
│       ├── vite-env.d.ts   types the environment variables, and makes reading an undeclared one a
│       │                   type error
│       ├── api/
│       │   ├── api-client.ts   the shared axios instance that the API Functions use, with its base URL
│       │   │                   from VITE_API_BASE_URL
│       │   ├── error-text.ts   the text that people see for each error outcome of the API, and
│       │   │                   getErrorText, which reads the outcome from a failed request's error body
│       │   ├── todos.ts        the Todo API Functions, one request each: list, create, set completed,
│       │   │                   delete, clear Completed, and the temporary Restore Demo Todos
│       │   └── index.ts        barrel for the API Functions, getErrorText and the shared axios instance
│       ├── api-hooks/
│       │   ├── todos.ts        the Todo API Hooks: one query and five mutations. Each mutation
│       │   │                   refreshes the Todo list when it settles, whether it worked or failed
│       │   └── index.ts        barrel for the API Hooks
│       ├── components/     the Shared Components, one folder each: <Name>/<Name>.tsx and its scoped
│       │   │               styles in <Name>/<Name>.module.scss
│       │   ├── NewTodoInput/   "Create a new todo…" with a decorative circle. On Enter it creates the
│       │   │                   trimmed, non-empty title, and clears once the create succeeds
│       │   ├── PageLayout/     what every Page shares: the background image for the color scheme and
│       │   │                   layout, the "TODO" header with the theme toggle, and the column width
│       │   ├── ThemeToggle/    a moon in light and a sun in dark, switching the color scheme
│       │   ├── TodoRow/        a round check in a clickable gutter, and the title, struck through when
│       │   │                   Completed
│       │   ├── TodoFilters/    the All, Active and Completed filters, with the selected one in blue
│       │   ├── TodoFooter/     the card's footer: the "items left" count, the filters (from the small
│       │   │                   breakpoint up) and Clear Completed
│       │   └── index.ts        barrel for the Shared Components
│       ├── images/
│       │   ├── bg-{mobile,desktop}-{light,dark}.jpg   the design's header backgrounds, one per color
│       │   │                                          scheme and layout, used by PageLayout's SCSS module
│       │   ├── icon-{moon,sun,check,cross}.svg   the design's icons: the theme toggle's moon and sun,
│       │   │                                     the Completed check, and the ✕ for deleting
│       │   └── index.ts        barrel for the images imported from TypeScript
│       ├── pages/          the Pages, one folder each: <Name>/<Name>.tsx and, when it has styles,
│       │   │               <Name>/<Name>.module.scss
│       │   ├── Home/       in the PageLayout: the new-todo input, the Todo rows and footer in a
│       │   │               card (with the filters in a card of their own below the small
│       │   │               breakpoint), and the temporary Restore Demo Todos link. Asks before deleting, clearing or restoring.
│       │   │               Shows an error alert if the Todos can't be loaded
│       │   ├── NotFound/   shown for any unknown URL: in the PageLayout, a card with a link back to
│       │   │               the Todo list
│       │   └── index.ts    barrel for the Pages
│       ├── styles/
│       │   ├── global.scss     global styles for every Page, loaded once in main.tsx after Mantine's
│       │   │                   base styles: the page's own background color
│       │   ├── _mantine.scss   Mantine's Sass helpers (rem, the breakpoints and the hover,
│       │   │                   smaller-than, larger-than, light, dark, rtl and ltr mixins), copied
│       │   │                   from Mantine's "Usage with Sass" guide. vite.config.ts injects it into
│       │   │                   every SCSS file as mantine. Its breakpoints must match the theme's
│       │   └── _text-button.scss   the text-button mixin: a transparent Mantine Button cut down to its
│       │                           text, as the footer's filters and Clear Completed are drawn
│       ├── theme/
│       │   ├── theme.ts        the Mantine theme from the style guide: Blue 500 as the primary color,
│       │   │                   Josefin Sans and the design's 5px radius, plus the CSS variables resolver
│       │   │                   that sets the design's light and dark colors, the check gradient and the
│       │   │                   card shadow
│       │   ├── theme.module.scss   theme-wide overrides of Mantine components, attached through
│       │   │                       classNames in theme.ts: Button labels centered on their capitals, and
│       │   │                       cards in the design's card color
│       │   └── index.ts        barrel for the theme and its CSS variables resolver
│       └── types/          shared types, one file per type and the types derived from it
│           ├── todo.ts         the Todo type and the two request bodies' types, from common/
│           ├── todo-filter.ts  which Todos the list shows: all, active or completed
│           └── index.ts        barrel for the shared types
│
├── api/                    the API's code, as the package @to-do-list/api
│   ├── package.json        its libraries (Powertools Logger, the AWS SDK's DynamoDB client and document
│   │                       client, DynamoDB Toolbox, zod, the shared schemas from common/), its tools
│   │                       (esbuild, Express, nodemon, Node and Lambda types, typescript-eslint), and
│   │                       its scripts: dev, typecheck, lint, invoke, bundle, build
│   ├── tsconfig.json       extends tsconfig.base.json with the settings for Node code; covers src/
│   │                       and dev/
│   ├── eslint.config.js    starts from eslint.config.base.js and adds typescript-eslint's type-aware
│   │                       rules and Node globals
│   ├── .env.example        the settings pnpm dev and pnpm invoke read, with their values; committed
│   ├── .env                your own copy of .env.example; gitignored
│   ├── CLAUDE.md           for AI coding agents: the request path and where to find each part
│   ├── routes.json         the one list of the API's routes (method, path, handler name);
│   │                       infra/modules/app/ makes one API Gateway route from each entry
│   ├── src/
│   │   ├── index.ts                  the function's entry point: Lambda calls index.handler, which is the
│   │   │                             router's handler
│   │   ├── router/                   runs for every request
│   │   │   ├── router.ts             checks at startup that every route in routes.json has a route handler,
│   │   │   │                         then sends each request to its route handler and writes one log line
│   │   │   │                         with the request's outcome
│   │   │   ├── routes.ts             HttpMethod (the methods a route can use); loads routes.json, and
│   │   │   │                         checks each entry at startup with a zod schema: a known method, a
│   │   │   │                         path and a handler name
│   │   │   ├── handler-registry.ts   re-exports every route handler, under the name routes.json uses
│   │   │   └── logger.ts             the one Powertools Logger the whole function writes with
│   │   ├── route-handler-tools/      what a route handler uses to read the request and write the response
│   │   │   ├── route-handler.ts      RouteHandler (the shape every route handler has) and Result (what a
│   │   │   │                         route handler returns)
│   │   │   ├── outcome-codes.ts      every outcome a request can end with, as used in the logs; the error
│   │   │   │                         codes come from common/
│   │   │   ├── json-body.ts          readJsonBody: reads a request body as JSON and checks it against a
│   │   │   │                         schema from @to-do-list/common, or gives the 400 result
│   │   │   └── responses.ts          json, noContent and errorResult (a failed request's whole result, with
│   │   │                             the error body): build HTTP responses
│   │   └── resources/                one folder per resource
│   │       └── todos/
│   │           ├── todos-repository.ts   the todos table and the Todo entity (DynamoDB Toolbox), and
│   │           │                         DEMO_OWNER_ID, the one owner until the login: creates, lists,
│   │           │                         changes and deletes one owner's Todos; the table name comes from
│   │           │                         TODOS_TABLE
│   │           ├── todo-id.ts            checks a Todo ID: 1 to 64 letters, digits or hyphens
│   │           ├── demo-todos.ts         the six Demo Todos' titles, and which one is Completed
│   │           └── route-handlers/       one file per route
│   │               ├── list-todos.ts             GET /api/todos: the owner's Todos, newest first
│   │               ├── create-todo.ts            POST /api/todos: checks the body, makes the ID (a version
│   │               │                             7 UUID), writes the Todo and returns it with 201
│   │               ├── set-todo-completed.ts     PATCH /api/todos/{todo_id}: sets completed if the version
│   │               │                             is the stored one, and returns the Todo; 409 for a stale
│   │               │                             version
│   │               ├── delete-todo.ts            DELETE /api/todos/{todo_id}: 204, also when there's no
│   │               │                             such Todo
│   │               ├── clear-completed-todos.ts  DELETE /api/todos?completed=true: deletes every Completed
│   │               │                             Todo
│   │               └── restore-demo-todos.ts     POST /api/demo-todos/restore: replaces every Todo with the
│   │                                             Demo Todos. Temporary, for the frontend's Restore Demo
│   │                                             Todos link
│   └── dev/                the tools that run only on your machine, never in Lambda
│       ├── server.ts       the local dev server: an Express app that plays API Gateway's part, calls
│       │                   the router in src/router/router.ts, and warns when you're not logged in to AWS
│       ├── invoke.ts       runs the built function (dist/index.mjs) with a sample event and a
│       │                   stand-in Lambda context
│       ├── local-context.ts  the stand-in Lambda context that server.ts and invoke.ts pass
│       └── sample-events/  sample API Gateway events for pnpm invoke, one folder per resource.
│           │               The dev server doesn't restart when one changes
│           └── todos/      one file per route, and the bad requests: create-todo-invalid-body.json
│                           and clear-completed-todos-missing-query.json
│
├── common/                 the shared contract, as the package @to-do-list/common: the zod schemas
│   │                       that api/ and frontend/ both import. No build of its own: esbuild, Vite
│   │                       and Node read its TypeScript as it is
│   ├── package.json        its library (zod), its lint tools, its scripts (typecheck, lint), and
│   │                       exports, which points to src/index.ts
│   ├── tsconfig.json       extends tsconfig.base.json with no Node or browser types, because both
│   │                       sides run this code
│   ├── eslint.config.js    starts from eslint.config.base.js and adds typescript-eslint's type-aware
│   │                       rules
│   ├── CLAUDE.md           for AI coding agents: where to find each schema
│   └── src/
│       ├── index.ts        the package's one entry point: re-exports every schema and type
│       ├── error-body.ts   the body of every API error ({ outcome, message }) and its outcome codes
│       └── todos.ts        the Todo, and the bodies of POST /api/todos and PATCH /api/todos/{todo_id}
│
└── infra/                  Terraform, one folder per separate configuration.
    │                       Each has its own state and is planned and applied on its own.
    │
    ├── CLAUDE.md           for AI coding agents: each configuration, and which resource holds which
    │                       setting
    │
    ├── bootstrap/          the S3 bucket that holds the other configurations' state
    │   ├── main.tf                 state kept in a local file, which git ignores
    │   └── .terraform.lock.hcl     the exact provider versions this folder uses
    │
    ├── account/            account-wide settings: the monthly cost budget and its email alerts
    │   ├── main.tf                 state kept in S3, under account/terraform.tfstate
    │   ├── terraform.tfvars.example   the variables this folder needs, with placeholders; committed
    │   ├── terraform.tfvars        your own copy, with the alert email address; gitignored
    │   └── .terraform.lock.hcl
    │
    ├── modules/
    │   └── app/            the app's AWS resources for one environment, named
    │       │               tdl-<environment>-api: the function's role, its log group (kept 14
    │       │               days), and the function itself, uploaded as a zip of api/dist/ (Node.js 26,
    │       │               arm64, 512 MB, 10 seconds); the HTTP API in front of it, with one route for
    │       │               each entry in api/routes.json, its access log group (kept 14 days, keys in
    │       │               snake_case, the request ID as correlation_id) and a request limit of 10 per
    │       │               second (burst 20); and the permission that lets API Gateway call the
    │       │               function
    │       ├── main.tf             the function, its role and its policies (logs, and the todos table), and the HTTP API
    │       ├── dynamodb.tf         the todos table, tdl-<environment>-todos: partition key owner_id, sort key todo_id
    │       ├── variables.tf        the module's input: environment
    │       └── outputs.tf          the module's output: api_url
    │
    └── envs/               one folder per environment, each using the app module once
        └── dev/            the dev environment
            ├── main.tf             state kept in S3, under envs/dev/terraform.tfstate; the tags
            │                       project = to-do-list and environment = dev on every resource
            └── .terraform.lock.hcl     the exact versions of the aws and archive providers
```
