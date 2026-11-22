export interface Todo {
  todo_id: string;
  title: string;
  completed: boolean;
}

// A new Todo is always Active, and a real server sets its todo_id.
export type CreateTodoInput = Pick<Todo, "title">;

export type UpdateTodoInput = Partial<Omit<Todo, "todo_id">>;
