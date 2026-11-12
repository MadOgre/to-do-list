# Folder structure

A map of this repo: what each folder and file is for. It shows what exists today, not plans. Update it whenever a file or folder is added, moved or removed. Files that repeat (one per component, one per planning round) are described by their pattern instead of listed one by one. Terms such as Page, Shared Component, API Function and API Hook are defined in `CONTEXT.md`.

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
│                           skips (esbuild's and @parcel/watcher's), with why each is safe to skip
├── pnpm-lock.yaml          the exact version of every installed package; written by pnpm, committed
├── tsconfig.base.json      the TypeScript settings every package shares
├── eslint.config.base.js   the lint rules every package shares: quotes, commas, semicolons, indent,
│                           destructuring, arrow functions, the import and export order (through
│                           eslint-plugin-perfectionist) and named exports only
├── README.md               the quick start: prerequisites, install and run, the scripts, the docs
├── CLAUDE.md               instructions for AI coding agents: where issues, specs and domain docs live,
│                           and the working rules for this repo (workflow, keep the build green, AWS
│                           and Terraform, review until clean, code conventions, grilling sessions)
├── CONTEXT.md              the glossary: the project's terms (Page, Shared Component, API Function,
│                           API Hook, and the to-do list's Todo, Active, Completed, Demo Todos and
│                           Restore Demo Todos) and the synonyms to avoid
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
│   │   └── 0002-mantine-components-with-scss-modules.md   Mantine provides the UI components, and
│   │                                                       custom styles stay in SCSS modules, using
│   │                                                       Mantine's Sass helpers
│   ├── agents/
│   │   ├── domain.md       tells AI coding agents to read CONTEXT.md and the ADRs before exploring,
│   │   │                   and to use the glossary's terms
│   │   ├── issue-tracker.md   tells AI coding agents that issues and specs are markdown files under
│   │   │                      docs/planning/, how they're laid out, and that each feature folder
│   │   │                      starts from the developer's INTENT.md, with its template
│   │   └── triage-labels.md   maps the agent skills' triage roles to the issue files' status labels
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
│   ├── package.json        its libraries (React, Mantine, React Router, React Query, axios), its tools
│   │                       (Vite and its plugins, Sass, the React lint plugins), and its scripts:
│   │                       dev, build, lint, preview
│   ├── GUIDE.md            the frontend's layout and conventions, and where the project came from
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
│       ├── main.tsx        the entry point. Loads Mantine's base styles, then the global styles, and
│       │                   renders the app with the Mantine provider (the theme, its CSS variables
│       │                   resolver, and the color scheme starting from the OS setting), the React
│       │                   Query provider, the router and React Query Devtools (development only)
│       ├── routes.tsx      every route, in React Router's data mode: the Home Page at / and the
│       │                   NotFound Page for anything else
│       ├── queryClient.ts  the React Query client, in one place so its defaults are easy to change
│       ├── theme.ts        the Mantine theme from the style guide: Blue 500 as the primary color,
│       │                   Josefin Sans and the design's 5px radius, plus the CSS variables resolver
│       │                   that sets the design's light and dark colors, the check gradient and the
│       │                   card shadow
│       ├── theme.module.scss   theme-wide overrides of Mantine components, attached through
│       │                       classNames in theme.ts: Button labels centered on their capitals, and
│       │                       cards in the design's card color
│       ├── vite-env.d.ts   types the environment variables, and makes reading an undeclared one a
│       │                   type error
│       ├── api/
│       │   ├── apiClient.ts    the shared axios instance the API Functions use once a real API exists,
│       │   │                   with its base URL from VITE_API_BASE_URL
│       │   ├── todos.ts        the Todo API Functions (list, get one, create, update, delete, clear
│       │   │                   Completed, and the demo-only Restore Demo Todos). Each keeps its real
│       │   │                   axios call commented out above the localStorage code, and the comment
│       │   │                   at the top lists the steps to switch to a real API
│       │   ├── todoStorage.ts  demo only: the localStorage key, the six Demo Todos and the helpers that
│       │   │                   read, write and remove the stored list. Deleted at the switch
│       │   └── index.ts        barrel for the API Functions and the shared axios instance
│       ├── apiHooks/
│       │   ├── todos.ts        the Todo API Hooks: two queries and five mutations. Each mutation
│       │   │                   refreshes the Todo list when it succeeds. While the list lives in
│       │   │                   localStorage, the queries don't retry a failed read
│       │   └── index.ts        barrel for the API Hooks
│       ├── components/     the Shared Components, one folder each: <Name>/<Name>.tsx and its scoped
│       │   │               styles in <Name>/<Name>.module.scss
│       │   ├── NewTodoInput/   "Create a new todo…" with a decorative circle. On Enter it creates the
│       │   │                   trimmed, non-empty title, and clears once the create succeeds
│       │   ├── ThemeToggle/    a moon in light and a sun in dark, switching the color scheme
│       │   ├── TodoRow/        a round check in a clickable gutter, and the title, struck through when
│       │   │                   Completed
│       │   ├── TodoFilters/    the All, Active and Completed filters, with the selected one in blue
│       │   ├── TodoFooter/     the card's footer: the "items left" count, the filters (from the small
│       │   │                   breakpoint up) and Clear Completed
│       │   └── index.ts        barrel for the Shared Components
│       ├── images/
│       │   ├── bg-{mobile,desktop}-{light,dark}.jpg   the design's header backgrounds, one per color
│       │   │                                          scheme and layout, used by Home's SCSS module
│       │   ├── icon-{moon,sun,check,cross}.svg   the design's icons: the theme toggle's moon and sun,
│       │   │                                     the Completed check, and the ✕ for deleting
│       │   └── index.ts        barrel for the images imported from TypeScript
│       ├── interfaces/     shared types, one file per type and the types derived from it
│       │   ├── Todo.ts         the Todo type, with its create and update input types
│       │   ├── TodoFilter.ts   which Todos the list shows: all, active or completed
│       │   └── index.ts        barrel for the shared types
│       ├── pages/          the Pages, one folder each: <Name>/<Name>.tsx and, when it has styles,
│       │   │               <Name>/<Name>.module.scss
│       │   ├── Home/       the "TODO" header with the theme toggle over the background image, the
│       │   │               new-todo input, the Todo rows and footer in a card (with the filters in
│       │   │               a card of their own below the small breakpoint), and the demo-only
│       │   │               Restore Demo Todos link. Asks before deleting, clearing or restoring.
│       │   │               Shows an error alert if the Todos can't be loaded or a change can't be
│       │   │               saved
│       │   ├── NotFound/   shown for any unknown URL, with a link back home
│       │   └── index.ts    barrel for the Pages
│       └── styles/
│           ├── global.scss     global styles for every Page, loaded once in main.tsx after Mantine's
│           │                   base styles: the page's own background color
│           ├── _mantine.scss   Mantine's Sass helpers (rem, the breakpoints and the hover,
│           │                   smaller-than, larger-than, light, dark, rtl and ltr mixins), copied
│           │                   from Mantine's "Usage with Sass" guide. vite.config.ts injects it into
│           │                   every SCSS file as mantine. Its breakpoints must match the theme's
│           └── _text-button.scss   the text-button mixin: a transparent Mantine Button cut down to its
│                                   text, as the footer's filters and Clear Completed are drawn
│
├── api/                    the API's code, as the package @to-do-list/api
│   ├── package.json        its libraries (Powertools Logger, the AWS SDK's DynamoDB client), its tools
│   │                       (esbuild, Express, nodemon, Node and Lambda types, typescript-eslint), and
│   │                       its scripts: dev, typecheck, lint, invoke, bundle, build
│   ├── tsconfig.json       extends tsconfig.base.json with the settings for Node code; covers src/,
│   │                       scripts/ and dev/
│   ├── eslint.config.js    starts from eslint.config.base.js and adds typescript-eslint's type-aware
│   │                       rules and Node globals
│   ├── .env.example        the settings pnpm dev and pnpm invoke read, with their values; committed
│   ├── .env                your own copy of .env.example; gitignored
│   ├── routes.json         the one list of the API's routes (method, path, handler name);
│   │                       infra/modules/app/ makes one API Gateway route from each entry. Empty
│   │                       until the first resource
│   ├── src/
│   │   ├── index.ts                  the function's entry point and router: checks at startup that every
│   │   │                             route in routes.json has a handler, then sends each request to its
│   │   │                             handler and writes one log line with the request's outcome
│   │   ├── resource-handlers.ts      re-exports every route handler, under the name routes.json uses.
│   │   │                             No exports until the first resource
│   │   ├── route-handler-types.ts    Route (one entry in routes.json), RouteHandler (the shape every
│   │   │                             route handler has) and Result (what a handler returns)
│   │   ├── request-outcome-codes.ts  every outcome a request can end with, as used in the logs
│   │   ├── response-builders.ts      json and noContent: build HTTP responses
│   │   └── logger.ts                 the one Powertools Logger the whole function writes with
│   ├── dev/
│   │   └── server.ts       the local dev server: an Express app that plays API Gateway's part, calls
│   │                       the router in src/index.ts, and warns when you're not logged in to AWS
│   ├── scripts/
│   │   └── invoke.ts       runs the built function (dist/index.mjs) with a sample event and a
│   │                       stand-in Lambda context
│   └── sample-events/      sample API Gateway events, one folder per resource. Empty until the first
│                           resource
│
└── infra/                  Terraform, one folder per separate configuration.
    │                       Each has its own state and is planned and applied on its own.
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
    │       │               to-do-list-<environment>-api: the function's role, its log group (kept 14
    │       │               days), and the function itself, uploaded as a zip of api/dist/ (Node.js 26,
    │       │               arm64, 512 MB, 10 seconds); the HTTP API in front of it, with one route for
    │       │               each entry in api/routes.json, its access log group (kept 14 days, keys in
    │       │               snake_case, the request ID as correlation_id) and a request limit of 10 per
    │       │               second (burst 20); and the permission that lets API Gateway call the
    │       │               function
    │       ├── main.tf
    │       ├── variables.tf        the module's input: environment
    │       └── outputs.tf          the module's output: api_url
    │
    └── envs/               one folder per environment, each using the app module once
        └── dev/            the dev environment
            ├── main.tf             state kept in S3, under envs/dev/terraform.tfstate; the tags
            │                       project = to-do-list and environment = dev on every resource
            └── .terraform.lock.hcl     the exact versions of the aws and archive providers
```
