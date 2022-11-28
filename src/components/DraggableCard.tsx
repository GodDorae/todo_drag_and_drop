import React, { Dispatch } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.div<{ isDragging: boolean }>`
  position: relative;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.isDragging ? "#e4f2ff" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.05)" : "none"};
`;

const Pencil = styled.img`
  position: absolute;
  width: 20px;
  height: 20px;
  right: 5px;
`;

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  overlay: Dispatch<React.SetStateAction<boolean>>;
  setTaskId: Dispatch<React.SetStateAction<number>>;
}

function DraggableCard({
  toDoId,
  toDoText,
  index,
  overlay,
  setTaskId,
}: IDraggableCardProps) {
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.draggableProps}
          {...magic.dragHandleProps}
        >
          <span>🔥 </span>
          {toDoText}
          <Pencil
            src={`${import.meta.env.BASE_URL}assets/pencil.png`}
            onClick={() => {
              overlay(true);
              setTaskId(toDoId);
            }}
          />
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);
