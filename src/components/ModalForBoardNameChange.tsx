import React, { Dispatch, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { columnOrder, toDoState } from "../atom";

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

interface IBoardNameModalProps {
  show: boolean;
  boardId: string;
  controlShow: Dispatch<React.SetStateAction<boolean>>;
}

function ModalForBoardNameChange({
  show,
  boardId,
  controlShow,
}: IBoardNameModalProps) {
  const [name, setName] = useState("");
  const setToDos = useSetRecoilState(toDoState);
  const setColumns = useSetRecoilState(columnOrder);

  const close = () => {
    controlShow(false);
  };

  const escClose = (e: React.KeyboardEvent) => {
    if (show && e.key === "Escape") {
      controlShow(false);
    }
  };

  const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setName(value);
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setToDos((allBoards) => {
      const allBoardsCopy = { ...allBoards };
      const theBoard = [...allBoards[boardId]];
      delete allBoardsCopy[boardId];
      return {
        ...allBoardsCopy,
        [name]: theBoard,
      };
    });
    setColumns((allColumns) => {
      const allColumnsCopy = [...allColumns];
      const theColumnIndex = allColumnsCopy.indexOf(boardId);
      allColumnsCopy.splice(theColumnIndex, 1, name);
      return allColumnsCopy;
    });
    controlShow(false);
  };

  return (
    <Overlay className="overlay" overlay={show} onKeyUp={escClose}>
      <Window>
        <Title>Edit board</Title>
        <Form onSubmit={submit}>
          <Input
            placeholder="Write your board name!"
            onChange={nameChange}
            value={name}
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
export default ModalForBoardNameChange;
