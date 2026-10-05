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

**API Hook**:
A ready-made React Query hook that wraps an API Function for use in components.
_Avoid_: query hook, data hook

## To-do list

**Todo**:
Something the user wants to do, added to the list by typing it in. Every Todo is either Active or Completed.
_Avoid_: task, item, entry

**Active**:
A Todo that is not yet done. "Items left" counts the Active Todos.
_Avoid_: open, pending, incomplete

**Completed**:
A Todo the user has marked as done.
_Avoid_: done, finished, checked

**Demo Todos**:
The six Todos from the design that the list shows until the user's own list is saved, and that Restore Demo Todos brings back. They exist only until the app has a real API.
_Avoid_: original, default, seed, sample, starter todos

**Restore Demo Todos**:
Replacing the user's whole list with the Demo Todos.
_Avoid_: reset, clear all
