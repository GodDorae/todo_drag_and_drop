import React, { Dispatch, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atom";

const Overlay = styled.div<{ overlay: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: ${(props) => (props.overlay ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 5;
`;

const Window = styled.div`
  width: 300px;
  height: 300px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 200%;
`;

const Form = styled.form`
  width: 100%;
  padding: 20px;
`;

const Input = styled.input`
  width: 100%;
  height: 30px;
  border: none;
  border-radius: 10px;
  margin-bottom: 50px;
`;

const ButtonList = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 30px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;

interface ITodoModalProps {
  show: boolean;
  toDoId: number;
  boardId: string;
  controlShow: Dispatch<React.SetStateAction<boolean>>;
}

function ModalForTodoChange({
  show,
  toDoId,
  boardId,
  controlShow,
}: ITodoModalProps) {
  const [content, setContent] = useState("");
  const setToDos = useSetRecoilState(toDoState);

  const close = () => {
    controlShow(false);
  };

  const escClose = (e: React.KeyboardEvent) => {
    if (show && e.key === "Escape") {
      controlShow(false);
    }
  };

  const contentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setContent(value);
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setToDos((allBoards) => {
      const targetBoard = [...allBoards[boardId]];
      const targetTask = targetBoard.find((task) => task.id === toDoId);
      const targetTaskIndex = targetBoard.findIndex(
        (task) => task.id === toDoId
      );
      if (targetTask) {
        const newTask = { id: toDoId, text: content };
        targetBoard.splice(targetTaskIndex, 1, newTask);
        return {
          ...allBoards,
          [boardId]: targetBoard,
        };
      } else {
        return { ...allBoards };
      }
    });
    controlShow(false);
  };

  return (
    <Overlay className="overlay" overlay={show} onKeyUp={escClose}>
      <Window>
        <Title>Edit task</Title>
        <Form onSubmit={submit}>
          <Input
            placeholder="Write your new task!"
            onChange={contentChange}
            value={content}
          />
          <ButtonList>
            <Button type="submit">Submit</Button>
            <Button onClick={close}>Close</Button>
          </ButtonList>
        </Form>
      </Window>
    </Overlay>
  );
}
export default ModalForTodoChange;
