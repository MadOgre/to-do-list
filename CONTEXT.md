# to-do-list

A to-do list web app built with React and TypeScript.

## Environments

**Host**:
The developer's own machine (Windows, macOS or Linux) where the code is checked out.
_Avoid_: local, laptop

**Dev VM**:
The Vagrant-managed Linux machine that gives every developer the same runtime, whatever their Host.
_Avoid_: box, server, guest, WSL

**Working Copy**:
The one checkout a developer edits, commits and pushes from. When using the Dev VM it lives inside the Dev VM, not on the Host.
_Avoid_: local copy, synced folder

## Source layout

**Page**:
A component that renders a whole screen and is mounted by a route.
_Avoid_: view, screen, route component

**Shared Component**:
A reusable component used by more than one Page, or large enough to live on its own.
_Avoid_: common, widget, partial

## Data access

**API Function**:
A plain function that performs one request against the JSON API and returns typed data.
_Avoid_: service, endpoint, fetcher

**Item**:
A placeholder resource that shows the data access layers end to end, until the app's own resources replace it.
_Avoid_: example, demo, todo

**API Hook**:
A ready-made React Query hook that wraps an API Function for use in components.
_Avoid_: query hook, data hook
