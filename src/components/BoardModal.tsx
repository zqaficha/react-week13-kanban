import { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addBoard, editBoard, type Board, type Column } from "../store";
import iconCross from "../assets/icon-cross.svg";

type Props = {
  board?: Board;
  boardIndex: number;
  boardsCount: number;
  close: () => void;
};

function BoardModal({ board, boardIndex, boardsCount, close }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState(board?.name || "");
  const [columns, setColumns] = useState<Column[]>(
    board?.columns || [
      { name: "Todo", tasks: [] },
      { name: "Doing", tasks: [] },
    ],
  );
  const [tried, setTried] = useState(false);

  function save() {
    if (!name.trim()) return setTried(true);
    const list = columns.filter((c) => c.name.trim());
    if (board) dispatch(editBoard({ board: boardIndex, name, columns: list }));
    else {
      dispatch(addBoard({ name, columns: list }));
      navigate("/" + boardsCount);
    }
    close();
  }

  return (
    <Overlay onClick={close}>
      <Box onClick={(e) => e.stopPropagation()}>
        <h2>{board ? "Edit Board" : "Add New Board"}</h2>
        <label>
          Board Name
          <input
            className={tried && !name.trim() ? "error" : ""}
            placeholder={
              tried && !name.trim() ? "Can't be empty" : "e.g. Web Design"
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Board Columns
          {columns.map((column, i) => (
            <div className="row" key={i}>
              <input
                placeholder="e.g. Todo"
                value={column.name}
                onChange={(e) =>
                  setColumns(
                    columns.map((c, j) =>
                      j === i ? { ...c, name: e.target.value } : c,
                    ),
                  )
                }
              />
              <button
                className="x"
                onClick={() => setColumns(columns.filter((_, j) => j !== i))}
              >
                <img src={iconCross} alt="remove" />
              </button>
            </div>
          ))}
        </label>
        <button
          className="light"
          onClick={() => setColumns([...columns, { name: "", tasks: [] }])}
        >
          + Add New Column
        </button>
        <button onClick={save}>
          {board ? "Save Changes" : "Create New Board"}
        </button>
      </Box>
    </Overlay>
  );
}

export default BoardModal;

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
  input {
    height: 40px;
    padding: 0 16px;
    border-radius: 4px;
    background: transparent;
    color: inherit;
    border: 1px solid #828fa340;
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
