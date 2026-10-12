import { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { moveTask, toggleSubtask, type Board } from "../store";
import iconEllipsis from "../assets/icon-vertical-ellipsis.svg";

type Props = {
  board: Board;
  boardIndex: number;
  column: number;
  task: number;
  close: () => void;
  edit: () => void;
  remove: () => void;
};

function TaskModal({
  board,
  boardIndex,
  column,
  task,
  close,
  edit,
  remove,
}: Props) {
  const dispatch = useDispatch();
  const [menu, setMenu] = useState(false);
  const currentTask = board.columns[column].tasks[task];
  if (!currentTask) return null;

  function changeStatus(name: string) {
    const newColumn = board.columns.findIndex((c) => c.name === name);
    dispatch(moveTask({ board: boardIndex, column, task, newColumn }));
    close();
  }

  return (
    <Overlay onClick={close}>
      <Box onClick={(e) => e.stopPropagation()}>
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 16 }}
        >
          <h2>{currentTask.title}</h2>
          <button style={{ background: "none" }} onClick={() => setMenu(!menu)}>
            <img src={iconEllipsis} alt="menu" />
          </button>
        </div>
        {menu && (
          <Menu>
            <button onClick={edit}>Edit Task</button>
            <button style={{ color: "var(--red)" }} onClick={remove}>
              Delete Task
            </button>
          </Menu>
        )}
        <p style={{ color: "var(--grey)", fontSize: 13 }}>
          {currentTask.description}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <b style={{ fontSize: 12, color: "var(--grey)" }}>
            Subtasks ({currentTask.subtasks.filter((s) => s.isCompleted).length}{" "}
            of {currentTask.subtasks.length})
          </b>
          {currentTask.subtasks.map((sub, i) => (
            <Subtask key={i}>
              <input
                type="checkbox"
                checked={sub.isCompleted}
                onChange={() =>
                  dispatch(
                    toggleSubtask({
                      board: boardIndex,
                      column,
                      task,
                      subtask: i,
                    }),
                  )
                }
              />
              <span
                style={{
                  textDecoration: sub.isCompleted ? "line-through" : "none",
                }}
              >
                {sub.title}
              </span>
            </Subtask>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <b style={{ fontSize: 12, color: "var(--grey)" }}>Current Status</b>
          <Select
            value={board.columns[column].name}
            onChange={(e) => changeStatus(e.target.value)}
          >
            {board.columns.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </Select>
        </div>
      </Box>
    </Overlay>
  );
}

export default TaskModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: #00000080;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Box = styled.div`
  position: relative;
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
`;
const Menu = styled.div`
  position: absolute;
  right: 16px;
  top: 64px;
  width: 192px;
  padding: 16px;
  border-radius: 8px;
  background: var(--bg);
  box-shadow: 0 10px 20px #364e7e40;
  display: flex;
  flex-direction: column;
  gap: 16px;
  button {
    background: none;
    text-align: left;
    font-size: 13px;
    color: var(--grey);
  }
`;
const Subtask = styled.label`
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 4px;
  background: var(--bg);
  font-size: 13px;
`;
const Select = styled.select`
  height: 40px;
  padding: 0 16px;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  border: 1px solid #828fa340;
  option {
    color: #000;
  }
`;
