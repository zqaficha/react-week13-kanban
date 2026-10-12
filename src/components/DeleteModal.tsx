import styled from "styled-components";

type Props = {
  title: string;
  text: string;
  remove: () => void;
  close: () => void;
};

function DeleteModal({ title, text, remove, close }: Props) {
  return (
    <Overlay onClick={close}>
      <Box onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: "var(--red)" }}>{title}</h2>
        <p style={{ color: "var(--grey)", fontSize: 13, lineHeight: 1.8 }}>
          {text}
        </p>
        <div>
          <button style={{ background: "var(--red)" }} onClick={remove}>
            Delete
          </button>
          <button
            style={{ background: "#635FC71A", color: "var(--purple)" }}
            onClick={close}
          >
            Cancel
          </button>
        </div>
      </Box>
    </Overlay>
  );
}

export default DeleteModal;

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
  padding: 32px;
  border-radius: 6px;
  background: var(--card);
  display: flex;
  flex-direction: column;
  gap: 24px;
  div {
    display: flex;
    gap: 16px;
  }
  button {
    flex: 1;
    height: 48px;
    border-radius: 24px;
    color: #fff;
    font-weight: 700;
  }
`;
