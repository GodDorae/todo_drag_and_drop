# Todo with Drag & Drop

## About the project

This is a small todo application.  
The biggest feature of this application is that  
users can manage their todos by drag & drop.  
This could be done thanks to an open source library,  
'react-beautiful-dnd'.

At first, there are 3 basic boards  
which are 'TO_DO', 'DOING', and 'DONE'.  
By writing a task on a board,  
user can register the task on the board.  
User can also easily change the board of the task  
by dragging the task and dropping it on the other board.  
When user want to edit a task,  
user can click a pencil button on the task  
and type a content that user wants.  
When user want to delete a task,  
user can drag it to a trash bin block and delete it.  

In the aspect of board, user can add another board  
with a specific name that user wants.  
(Note that user can only have boards up to 4  
due to the screen issue.)  
User can switch position of each board  
by dragging and dropping the board.  
Same as each task, user can edit and delete a board  
by clicking pencil button and trash bin button.  

Every features including tasks, boards, and position of them  
are all stored in local storage.  
Therefore, users can have a same result  
even though they get out of the page and open the page again.  

## Built with  

<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">  
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
