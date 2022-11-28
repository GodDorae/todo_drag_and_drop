import React, { Dispatch, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
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

const Warning = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`

function Modal({
  show,
  controlShow,
}: {
  show: boolean;
  controlShow: Dispatch<React.SetStateAction<boolean>>;
}) {
  const [name, setName] = useState("");
  const [toDos, setToDos] = useRecoilState(toDoState);
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
    if (Object.keys(toDos).length < 4) {
      setToDos((allBoards) => {
        return {
          ...allBoards,
          [name]: [],
        };
      });
      setColumns((allColumns) => {
        return [...allColumns, name];
      });
      controlShow(false);
    }
  };

  return (
    <Overlay className="overlay" overlay={show} onKeyUp={escClose}>
      <Window>
        {Object.keys(toDos).length < 4 ? (
          <>
            <Title>Add board</Title>
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
          </>
        ) : (
          <Warning>
            <div>You cannot add a board.</div>
            <div>Only boards under 4 are allowed.</div>
            <Button onClick={close}>Close</Button>
          </Warning>
        )}
      </Window>
    </Overlay>
  );
}

export default Modal;
