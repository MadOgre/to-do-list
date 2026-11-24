# to-do-list

A to-do list web app built with React and TypeScript.

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

## API

**Resource**:
One kind of thing that the API stores and serves, with its own table, routes and folder, such as todos.
_Avoid_: entity, model, collection

**Route**:
One method and path that the API answers, listed in `api/routes.json`, such as `PATCH /api/todos/{todo_id}`.
_Avoid_: endpoint

**Route Handler**:
The function that answers one Route and returns its outcome, its log message and its response.
_Avoid_: controller, lambda

**Repository**:
The one file that reads and writes one Resource's table.
_Avoid_: DAO, store, service

**Outcome**:
The fixed code for how one request ended, such as `not_found`. The log line has it, and so does an error's body.
_Avoid_: status, result code, error code

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

**Owner**:
The person a Todo belongs to. Until the app has logins, every Todo has the same Owner, the Demo Owner.
_Avoid_: user, account

**Version**:
A number on each Todo that grows by one with each change. A change that names an older Version fails, so two tabs can't overwrite each other's changes.
_Avoid_: revision, etag

**Demo Todos**:
The six Todos from the design that Restore Demo Todos puts in the list. They exist only until the app has logins.
_Avoid_: original, default, seed, sample, starter todos

## Operations

**List Todos**:
Reading every Todo of one Owner, newest first.
_Avoid_: get, fetch, load

**Create Todo**:
Adding one new Active Todo.
_Avoid_: add, insert

**Set Todo Completed**:
Marking one Todo as Completed, or as Active again.
_Avoid_: update, toggle, check, complete

**Delete Todo**:
Removing one Todo for good.
_Avoid_: remove, destroy

**Clear Completed Todos**:
Deleting every Completed Todo of one Owner at once.
_Avoid_: purge, delete completed

**Restore Demo Todos**:
Replacing the user's whole list with the Demo Todos.
_Avoid_: reset, clear all
