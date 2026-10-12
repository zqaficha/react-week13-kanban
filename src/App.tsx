import { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useMatch, useNavigate } from "react-router-dom";
import { deleteBoard, deleteTask, type RootState } from "./store";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Column from "./components/Column";
import TaskModal from "./components/TaskModal";
import TaskFormModal from "./components/TaskFormModal";
import BoardModal from "./components/BoardModal";
import DeleteModal from "./components/DeleteModal";
import iconShow from "./assets/icon-show-sidebar.svg";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boards = useSelector((state: RootState) => state.boards);
  const match = useMatch("/:id");
  const boardIndex = Number(match?.params.id);
  const board = boards[boardIndex];

  const [dark, setDark] = useState(localStorage.getItem("dark") === "true");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modal, setModal] = useState("");
  const [picked, setPicked] = useState({ column: 0, task: 0 });

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("dark", String(dark));
  }, [dark]);

  if (!match || (!board && boards.length > 0)) return <Navigate to="/0" />;
  const close = () => setModal("");

  return (
    <Layout $open={sidebarOpen}>
      <Sidebar
        boards={boards}
        dark={dark}
        setDark={setDark}
        hide={() => setSidebarOpen(false)}
        addBoard={() => setModal("addBoard")}
      />

      {!board && (
        <Main style={{ gridRow: "1 / 3" }}>
          <Empty>
            <p>No boards found. Create a new board to get started.</p>
            <button onClick={() => setModal("addBoard")}>
              + Create New Board
            </button>
          </Empty>
        </Main>
      )}
      {board && (
        <>
          <Header
            name={board.name}
            canAddTask={board.columns.length > 0}
            addTask={() => setModal("addTask")}
            editBoard={() => setModal("editBoard")}
            deleteBoard={() => setModal("deleteBoard")}
          />
          <Main>
            {board.columns.length === 0 && (
              <Empty>
                <p>This board is empty. Create a new column to get started.</p>
                <button onClick={() => setModal("editBoard")}>
                  + Add New Column
                </button>
              </Empty>
            )}
            {board.columns.map((column, i) => (
              <Column
                key={i}
                column={column}
                openTask={(t) => {
                  setPicked({ column: i, task: t });
                  setModal("task");
                }}
              />
            ))}
            {board.columns.length > 0 && (
              <NewColumn onClick={() => setModal("editBoard")}>
                + New Column
              </NewColumn>
            )}
          </Main>
        </>
      )}

      {!sidebarOpen && (
        <ShowButton onClick={() => setSidebarOpen(true)}>
          <img src={iconShow} alt="show sidebar" />
        </ShowButton>
      )}

      {modal === "task" && (
        <TaskModal
          board={board}
          boardIndex={boardIndex}
          column={picked.column}
          task={picked.task}
          close={close}
          edit={() => setModal("editTask")}
          remove={() => setModal("deleteTask")}
        />
      )}
      {modal === "addTask" && (
        <TaskFormModal board={board} boardIndex={boardIndex} close={close} />
      )}
      {modal === "editTask" && (
        <TaskFormModal
          board={board}
          boardIndex={boardIndex}
          picked={picked}
          close={close}
        />
      )}
      {modal === "deleteTask" && (
        <DeleteModal
          title="Delete this task?"
          text={`Are you sure you want to delete the '${board.columns[picked.column].tasks[picked.task]?.title}' task and its subtasks? This action cannot be reversed.`}
          close={close}
          remove={() => {
            dispatch(deleteTask({ board: boardIndex, ...picked }));
            close();
          }}
        />
      )}
      {modal === "addBoard" && (
        <BoardModal
          boardIndex={boardIndex}
          boardsCount={boards.length}
          close={close}
        />
      )}
      {modal === "editBoard" && (
        <BoardModal
          board={board}
          boardIndex={boardIndex}
          boardsCount={boards.length}
          close={close}
        />
      )}
      {modal === "deleteBoard" && (
        <DeleteModal
          title="Delete this board?"
          text={`Are you sure you want to delete the '${board.name}' board? This action will remove all columns and tasks and cannot be reversed.`}
          close={close}
          remove={() => {
            dispatch(deleteBoard(boardIndex));
            navigate("/0");
            close();
          }}
        />
      )}
    </Layout>
  );
}

export default App;

const Layout = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-columns: ${(p) => (p.$open ? "280px" : "0")} 1fr;
  grid-template-rows: 96px 1fr;
  height: 100vh;
`;
const Main = styled.main`
  display: flex;
  gap: 24px;
  align-items: flex-start;
  padding: 24px;
  overflow: auto;
`;
const Empty = styled.div`
  margin: auto;
  text-align: center;
  p {
    color: var(--grey);
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 32px;
  }
  button {
    height: 48px;
    padding: 0 24px;
    border-radius: 24px;
    background: var(--purple);
    color: #fff;
    font-weight: 700;
  }
`;
const NewColumn = styled.button`
  width: 280px;
  flex: none;
  align-self: stretch;
  margin-top: 39px;
  border-radius: 6px;
  background: #e9effa80;
  color: var(--grey);
  font-size: 24px;
  font-weight: 700;
`;
const ShowButton = styled.button`
  position: fixed;
  left: 0;
  bottom: 32px;
  width: 56px;
  height: 48px;
  border-radius: 0 100px 100px 0;
  background: var(--purple);
`;
