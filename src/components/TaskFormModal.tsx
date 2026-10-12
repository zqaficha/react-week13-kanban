import { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { addTask, editTask, type Board } from "../store";
import iconCross from "../assets/icon-cross.svg";

type Props = {
  board: Board;
  boardIndex: number;
  picked?: { column: number; task: number };
  close: () => void;
};

function TaskFormModal({ board, boardIndex, picked, close }: Props) {
  const dispatch = useDispatch();
  const oldTask = picked && board.columns[picked.column].tasks[picked.task];
  const [title, setTitle] = useState(oldTask?.title || "");
  const [description, setDescription] = useState(oldTask?.description || "");
  const [subtasks, setSubtasks] = useState(
    oldTask?.subtasks || [
      { title: "", isCompleted: false },
      { title: "", isCompleted: false },
    ],
  );
  const [status, setStatus] = useState(
    picked ? board.columns[picked.column].name : board.columns[0].name,
  );
  const [tried, setTried] = useState(false);

  function save() {
    if (!title.trim()) return setTried(true);
    const task = {
      title,
      description,
      status,
      subtasks: subtasks.filter((s) => s.title.trim()),
    };
    if (picked)
      dispatch(
        editTask({
          board: boardIndex,
          column: picked.column,
          task: picked.task,
          newTask: task,
        }),
      );
    else dispatch(addTask({ board: boardIndex, task }));
    close();
  }

  return (
    <Overlay onClick={close}>
      <Box onClick={(e) => e.stopPropagation()}>
        <h2>{picked ? "Edit Task" : "Add New Task"}</h2>
        <label>
          Title
          <input
            className={tried && !title.trim() ? "error" : ""}
            placeholder={
              tried && !title.trim()
                ? "Can't be empty"
                : "e.g. Take coffee break"
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Description
          <textarea
            placeholder="e.g. It's always good to take a break."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Subtasks
          {subtasks.map((sub, i) => (
            <div className="row" key={i}>
              <input
                placeholder="e.g. Make coffee"
                value={sub.title}
                onChange={(e) =>
                  setSubtasks(
                    subtasks.map((s, j) =>
                      j === i ? { ...s, title: e.target.value } : s,
                    ),
                  )
                }
              />
              <button
                className="x"
                onClick={() => setSubtasks(subtasks.filter((_, j) => j !== i))}
              >
                <img src={iconCross} alt="remove" />
              </button>
            </div>
          ))}
        </label>
        <button
          className="light"
          onClick={() =>
            setSubtasks([...subtasks, { title: "", isCompleted: false }])
          }
        >
          + Add New Subtask
        </button>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {board.columns.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>
        </label>
        <button onClick={save}>
          {picked ? "Save Changes" : "Create Task"}
        </button>
      </Box>
    </Overlay>
  );
}

export default TaskFormModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: #00000080;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Box = styled.div`
  width: 480px;
  max-width: 92vw;
  max-height: 90vh;
  overflow: auto;
  padding: 32px;
  border-radius: 6px;
  background: var(--card);
  display: flex;
  flex-direction: column;
  gap: 24px;
  label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 12px;
    font-weight: 700;
    color: var(--grey);
  }
  input,
  textarea,
  select {
    height: 40px;
    padding: 0 16px;
    border-radius: 4px;
    background: transparent;
    color: inherit;
    border: 1px solid #828fa340;
  }
  textarea {
    height: 100px;
    padding-top: 8px;
    resize: none;
  }
  option {
    color: #000;
  }
  .error {
    border-color: var(--red);
  }
  .row {
    display: flex;
    gap: 16px;
    align-items: center;
  }
  .row input {
    flex: 1;
  }
  button {
    height: 48px;
    border-radius: 24px;
    background: var(--purple);
    color: #fff;
    font-weight: 700;
  }
  button.light {
    background: #635fc71a;
    color: var(--purple);
  }
  button.x {
    height: auto;
    background: none;
  }
`;
