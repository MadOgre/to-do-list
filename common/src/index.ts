// Everything the API and the frontend share. Import it as "@to-do-list/common".
export { type ErrorBody, errorBodySchema, type ErrorOutcome, errorOutcomeSchema } from "./error-body.ts";
export {
  type CreateTodoBody,
  createTodoBodySchema,
  type SetTodoCompletedBody,
  setTodoCompletedBodySchema,
  type Todo,
  todoSchema,
} from "./todos.ts";
