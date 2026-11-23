// A valid todo ID: 1 to 64 letters, digits or hyphens.
const TODO_ID_REGEX = /^[a-zA-Z0-9-]{1,64}$/;

export const isValidTodoId = (id: string | undefined): id is string =>
  typeof id === "string" && TODO_ID_REGEX.test(id);
