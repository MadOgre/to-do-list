export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

// A new Todo is always Active, and a real server sets its id.
export type CreateTodoInput = Pick<Todo, "title">;

export type UpdateTodoInput = Partial<Omit<Todo, "id">>;
