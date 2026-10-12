import { useState } from "react";
import styled from "styled-components";
import iconEllipsis from "../assets/icon-vertical-ellipsis.svg";

type Props = {
  name: string;
  canAddTask: boolean;
  addTask: () => void;
  editBoard: () => void;
  deleteBoard: () => void;
};

function Header({ name, canAddTask, addTask, editBoard, deleteBoard }: Props) {
  const [menu, setMenu] = useState(false);

  return (
    <Bar>
      <h1>{name}</h1>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <AddButton disabled={!canAddTask} onClick={addTask}>
          + Add New Task
        </AddButton>
        <button style={{ background: "none" }} onClick={() => setMenu(!menu)}>
          <img src={iconEllipsis} alt="menu" />
        </button>
      </div>
      {menu && (
        <Menu>
          <button
            onClick={() => {
              setMenu(false);
              editBoard();
            }}
          >
            Edit Board
          </button>
          <button
            style={{ color: "var(--red)" }}
            onClick={() => {
              setMenu(false);
              deleteBoard();
            }}
          >
            Delete Board
          </button>
        </Menu>
      )}
    </Bar>
  );
}

export default Header;

const Bar = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 32px;
  background: var(--card);
  border-bottom: 1px solid var(--line);
  h1 {
    font-size: 24px;
  }
`;
const AddButton = styled.button`
  height: 48px;
  padding: 0 24px;
  border-radius: 24px;
  background: var(--purple);
  color: #fff;
  font-weight: 700;
  &:disabled {
    opacity: 0.3;
  }
`;
const Menu = styled.div`
  position: absolute;
  right: 24px;
  top: 80px;
  z-index: 5;
  width: 192px;
  padding: 16px;
  border-radius: 8px;
  background: var(--card);
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
