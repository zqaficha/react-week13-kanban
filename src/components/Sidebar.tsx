import styled from "styled-components";
import { NavLink } from "react-router-dom";
import type { Board } from "../store";
import logoDark from "../assets/logo-dark.svg";
import logoLight from "../assets/logo-light.svg";
import iconBoard from "../assets/icon-board.svg";
import iconHide from "../assets/icon-hide-sidebar.svg";
import iconLight from "../assets/icon-light-theme.svg";
import iconDark from "../assets/icon-dark-theme.svg";

type Props = {
  boards: Board[];
  dark: boolean;
  setDark: (v: boolean) => void;
  hide: () => void;
  addBoard: () => void;
};

function Sidebar({ boards, dark, setDark, hide, addBoard }: Props) {
  return (
    <Side>
      <div>
        <img className="logo" src={dark ? logoLight : logoDark} alt="kanban" />
        <p
          style={{
            padding: "0 32px 16px",
            color: "var(--grey)",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          ALL BOARDS ({boards.length})
        </p>
        {boards.map((board, i) => (
          <Link key={i} to={"/" + i}>
            <img src={iconBoard} alt="" />
            {board.name}
          </Link>
        ))}
        <Plain $purple onClick={addBoard}>
          <img src={iconBoard} alt="" />+ Create New Board
        </Plain>
      </div>
      <div style={{ paddingBottom: 32 }}>
        <ThemeBox>
          <img src={iconLight} alt="light" />
          <Switch $dark={dark} onClick={() => setDark(!dark)} />
          <img src={iconDark} alt="dark" />
        </ThemeBox>
        <Plain onClick={hide}>
          <img src={iconHide} alt="" />
          Hide Sidebar
        </Plain>
      </div>
    </Side>
  );
}

export default Sidebar;

const Side = styled.aside`
  grid-row: 1 / 3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  white-space: nowrap;
  background: var(--card);
  border-right: 1px solid var(--line);
  img.logo {
    margin: 32px;
  }
`;
const Link = styled(NavLink)`
  display: flex;
  gap: 12px;
  align-items: center;
  height: 48px;
  padding: 0 32px;
  margin-right: 24px;
  border-radius: 0 100px 100px 0;
  font-weight: 700;
  color: var(--grey);
  text-decoration: none;
  &.active {
    background: var(--purple);
    color: #fff;
  }
  &.active img {
    filter: brightness(0) invert(1);
  }
`;
const Plain = styled.button<{ $purple?: boolean }>`
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0 32px;
  background: none;
  font-weight: 700;
  color: ${(p) => (p.$purple ? "var(--purple)" : "var(--grey)")};
`;
const ThemeBox = styled.div`
  margin: 0 24px 8px;
  height: 48px;
  border-radius: 6px;
  background: var(--bg);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
`;
const Switch = styled.button<{ $dark: boolean }>`
  width: 40px;
  height: 20px;
  border-radius: 12px;
  background: var(--purple);
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: ${(p) => (p.$dark ? "23px" : "3px")};
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
  }
`;
