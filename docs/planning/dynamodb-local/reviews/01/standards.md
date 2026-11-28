# Standards review, ticket 01

No hard findings. Import order, quotes, arrow functions, named exports and the docs/structure.md update all follow the rules.

## S1 (judgment, new)
frontend/src/pages/Home/Home.tsx:106. Possible Speculative Generality. The hidden `Anchor` ("Restore demo todos", `display="none"`) stays in the page with no handler, and the `restoreLink` style stays with it. The comment says the developer plans to reuse it, so this is a decision of the developer's. Recommend leaving it.
