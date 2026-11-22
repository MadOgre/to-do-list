import * as z from "zod";

// A Todo's title: the spaces at both ends are cut off, then 1 to 500 characters must be left.
const todoTitleSchema = z.string().trim().min(1).max(500);

// A Todo's version: 1 when the Todo is created, then one more with each change.
const todoVersionSchema = z.int().min(1);

// One Todo, as the API sends it.
export const todoSchema = z.object({
  todo_id: z.string(),
  title: todoTitleSchema,
  completed: z.boolean(),
  version: todoVersionSchema,
});

export type Todo = z.infer<typeof todoSchema>;

// The body of POST /api/todos. Any other key makes the body invalid.
export const createTodoBodySchema = z.strictObject({
  title: todoTitleSchema,
});

export type CreateTodoBody = z.infer<typeof createTodoBodySchema>;

// The body of PATCH /api/todos/{todo_id}: the new value, and the version the client last saw.
// Any other key makes the body invalid.
export const setTodoCompletedBodySchema = z.strictObject({
  completed: z.boolean(),
  version: todoVersionSchema,
});

export type SetTodoCompletedBody = z.infer<typeof setTodoCompletedBodySchema>;
