import styled from "styled-components";
import type { Column as ColumnType } from "../store";

type Props = { column: ColumnType; openTask: (taskIndex: number) => void };

function Column({ column, openTask }: Props) {
  return (
    <Wrapper>
      <h2>
        {column.name.toUpperCase()} ({column.tasks.length})
      </h2>
      {column.tasks.map((task, i) => (
        <Card key={i} onClick={() => openTask(i)}>
          <h3>{task.title}</h3>
          <p>
            {task.subtasks.filter((s) => s.isCompleted).length} of{" "}
            {task.subtasks.length} subtasks
          </p>
        </Card>
      ))}
    </Wrapper>
  );
}

export default Column;

const Wrapper = styled.section`
  width: 280px;
  flex: none;
  h2 {
    font-size: 12px;
    letter-spacing: 2.4px;
    color: var(--grey);
    margin-bottom: 24px;
  }
`;
const Card = styled.div`
  background: var(--card);
  padding: 23px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px #364e7e1a;
  margin-bottom: 20px;
  cursor: pointer;
  h3 {
    font-size: 15px;
    margin-bottom: 8px;
  }
  p {
    font-size: 12px;
    font-weight: 700;
    color: var(--grey);
  }
  &:hover h3 {
    color: var(--purple);
  }
`;
