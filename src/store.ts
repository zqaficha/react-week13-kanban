import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import data from './data.json'

export type Subtask = { title: string; isCompleted: boolean }
export type Task = { title: string; description: string; status: string; subtasks: Subtask[] }
export type Column = { name: string; tasks: Task[] }
export type Board = { name: string; columns: Column[] }
type Where = { board: number; column: number; task: number }

const boardsSlice = createSlice({
  name: 'boards',
  initialState: data.boards as Board[],
  reducers: {
    toggleSubtask(state, action: PayloadAction<Where & { subtask: number }>) {
      const { board, column, task, subtask } = action.payload
      const item = state[board].columns[column].tasks[task].subtasks[subtask]
      item.isCompleted = !item.isCompleted
    },
    moveTask(state, action: PayloadAction<Where & { newColumn: number }>) {
      const { board, column, task, newColumn } = action.payload
      const [moved] = state[board].columns[column].tasks.splice(task, 1)
      moved.status = state[board].columns[newColumn].name
      state[board].columns[newColumn].tasks.push(moved)
    },
    addTask(state, action: PayloadAction<{ board: number; task: Task }>) {
      const { board, task } = action.payload
      state[board].columns.find(c => c.name === task.status)?.tasks.push(task)
    },
    editTask(state, action: PayloadAction<Where & { newTask: Task }>) {
      const { board, column, task, newTask } = action.payload
      const columns = state[board].columns
      const newColumn = columns.findIndex(c => c.name === newTask.status)
      if (newColumn === column) columns[column].tasks[task] = newTask
      else {
        columns[column].tasks.splice(task, 1)
        columns[newColumn].tasks.push(newTask)
      }
    },
    deleteTask(state, action: PayloadAction<Where>) {
      const { board, column, task } = action.payload
      state[board].columns[column].tasks.splice(task, 1)
    },
    addBoard(state, action: PayloadAction<Board>) {
      state.push(action.payload)
    },
    editBoard(state, action: PayloadAction<{ board: number; name: string; columns: Column[] }>) {
      const { board, name, columns } = action.payload
      state[board].name = name
      state[board].columns = columns.map(c => ({ name: c.name, tasks: c.tasks.map(t => ({ ...t, status: c.name })) }))
    },
    deleteBoard(state, action: PayloadAction<number>) {
      state.splice(action.payload, 1)
    },
  },
})

export const { toggleSubtask, moveTask, addTask, editTask, deleteTask, addBoard, editBoard, deleteBoard } = boardsSlice.actions
export const store = configureStore({ reducer: { boards: boardsSlice.reducer } })
export type RootState = ReturnType<typeof store.getState>
