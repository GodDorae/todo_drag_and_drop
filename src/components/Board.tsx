import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";
import { useForm } from "react-hook-form";
import { IToDo, toDoState } from "../atom";
import { useSetRecoilState } from "recoil";
import { useState } from "react";
import ModalForBoardNameChange from "./ModalForBoardNameChange";
import ModalForTodoChange from "./ModalForTodoChange";

const Wrapper = styled.div`
  width: 300px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

const Area = styled.div<IAreaProps>`
  padding: 20px;
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Input = styled.input`
  width: 260px;
  height: 30px;
  border: none;
  border-radius: 10px;
`;

const Delete = styled.img`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Pencil = styled.img`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 10px;
  right: 40px;
  cursor: pointer;
`;

interface IBoardProps {
  toDos: IToDo[];
  boardId: string;
  index: number;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId, index }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const [showTitleOverlay, setShowTitleOverlay] = useState(false);
  const [showTaskOverlay, setShowTaskOverlay] = useState(false);
  const [taskId, setTaskId] = useState(0);
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });
    setValue("toDo", "");
  };

  const deleteBoard = () => {
    setToDos((allBoards) => {
      const copy = { ...allBoards };
      delete copy[boardId];
      return copy;
    });
  };

  return (
    <>
      <Draggable draggableId={boardId} index={index}>
        {(magic) => (
          <Wrapper ref={magic.innerRef} {...magic.draggableProps}>
            <Title {...magic.dragHandleProps}>{boardId}</Title>
            <Delete src="/assets/bin.png" onClick={deleteBoard} />
            <Pencil
              src="/assets/pencil.png"
              onClick={() => {
                setShowTitleOverlay(true);
              }}
            />
            <Form onSubmit={handleSubmit(onValid)}>
              <Input
                {...register("toDo", { required: true })}
                type="text"
                placeholder="Add task on here!"
              />
            </Form>
            <Droppable droppableId={boardId}>
              {(magic, snapshot) => (
                <Area
                  isDraggingOver={snapshot.isDraggingOver}
                  isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
                  ref={magic.innerRef}
                  {...magic.droppableProps}
                >
                  {toDos.map((toDo, toDoindex) => (
                    <DraggableCard
                      key={toDo.id}
                      toDoId={toDo.id}
                      toDoText={toDo.text}
                      index={toDoindex}
                      overlay={setShowTaskOverlay}
                      setTaskId={setTaskId}
                    />
                  ))}
                  {magic.placeholder}
                </Area>
              )}
            </Droppable>
          </Wrapper>
        )}
      </Draggable>
      {showTitleOverlay && <ModalForBoardNameChange show={showTitleOverlay} controlShow={setShowTitleOverlay} boardId={boardId}/>}
      {showTaskOverlay && <ModalForTodoChange show={showTaskOverlay} controlShow={setShowTaskOverlay} boardId={boardId} toDoId={taskId} />}
    </>
  );
}

export default Board;
