import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { toDoState, columnOrder } from "./atom";
import Board from "./components/Board";
import Modal from "./components/Modal";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  gap: 50px;
`;

const AddBoardButton = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50px;
  right: 50px;
  border-radius: 50%;
  text-align: center;
  font-size: 200%;
  font-weight: bold;
  background-color: aquamarine;
  color: white;
  cursor: pointer;
`;

const Boards = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 100px;
`;

const TrashWrapper = styled.div`
  width: 260px;
  height: 100px;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
`;

const TrashArea = styled.div<{ isDraggingOver: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.isDraggingOver ? props.theme.boardColor : "gray"};
  transition: all 0.3s ease-in-out;
`;

const TrashBin = styled.img`
  width: 50px;
  height: 50px;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [columns, setColumns] = useRecoilState(columnOrder);
  const [showOverlay, setShowOverlay] = useState(false);
  const onDragEnd = (info: DropResult) => {
    const { destination, source, type } = info;
    if (!destination) return;
    if (type === "board") {
      setColumns((allColumns) => {
        const columnsCopy = [...allColumns];
        const target = columnsCopy[source.index];
        columnsCopy.splice(source.index, 1);
        columnsCopy.splice(destination.index, 0, target);
        return columnsCopy;
      });
    }
    if (destination.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (destination.droppableId !== source.droppableId) {
      if (destination.droppableId === "trash") {
        setToDos((allBoards) => {
          const sourceBoard = [...allBoards[source.droppableId]];
          const taskObj = sourceBoard[source.index];
          const newBoard = sourceBoard.filter((task) => task.id !== taskObj.id);
          return {
            ...allBoards,
            [source.droppableId]: newBoard,
          };
        });
      } else {
        setToDos((allBoards) => {
          const sourceBoard = [...allBoards[source.droppableId]];
          const taskObj = sourceBoard[source.index];
          const targetBoard = [...allBoards[destination.droppableId]];
          sourceBoard.splice(source.index, 1);
          targetBoard.splice(destination.index, 0, taskObj);
          return {
            ...allBoards,
            [source.droppableId]: sourceBoard,
            [destination.droppableId]: targetBoard,
          };
        });
      }
    }
  };

  const addBoardButtonClick = () => {
    setShowOverlay(true);
  };

  useEffect(() => {
    localStorage.setItem("toDo", JSON.stringify(toDos));
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [toDos, columns]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <AddBoardButton onClick={addBoardButtonClick}>
        Add
        <br />
        Board
      </AddBoardButton>
      <Droppable droppableId="board" direction="horizontal" type="board">
        {(dropMagic) => (
          <Wrapper>
            <Boards ref={dropMagic.innerRef} {...dropMagic.droppableProps}>
              {columns.map((boardId, index) => (
                <Board
                  key={boardId}
                  boardId={boardId}
                  toDos={toDos[boardId]}
                  index={index}
                />
              ))}
              {dropMagic.placeholder}
            </Boards>
            <TrashWrapper>
              <Droppable droppableId="trash">
                {(magic, snapshot) => (
                  <TrashArea
                    isDraggingOver={snapshot.isDraggingOver}
                    {...magic.droppableProps}
                    ref={magic.innerRef}
                  >
                    <TrashBin src={`${import.meta.env.BASE_URL}assets/bin.png`} />
                  </TrashArea>
                )}
              </Droppable>
            </TrashWrapper>
          </Wrapper>
        )}
      </Droppable>
      {showOverlay && <Modal show={showOverlay} controlShow={setShowOverlay} />}
    </DragDropContext>
  );
}

export default App;
