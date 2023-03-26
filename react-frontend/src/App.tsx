//import logo from './Pokytex.png';
//import logo2 from './Pokytex-2.png';

import React, { useState } from 'react'

import './App.css';
import { TodoTable } from './components/TodoTable';
import { NewTodoForm } from './components/NewTodoForm';

function App() {

  const [showAddTodoForm, setShowAddTodoForm] = useState(false);

  const [todoList, setTodos] = useState([
    { rowNumber: 1, rowDescription: 'Get Haircut', rowAssigned: 'Eric' },
    { rowNumber: 2, rowDescription: 'Jeg', rowAssigned: 'Eric' },
    { rowNumber: 3, rowDescription: 'Cacat', rowAssigned: 'Eric' },
    { rowNumber: 4, rowDescription: 'Cacat', rowAssigned: 'Eric' },
  ])

  const addTodo = (description: string, assigned: string) => {

    let rowNumber = 1;

    if (todoList.length > 0) {
      rowNumber = todoList[todoList.length - 1].rowNumber + 1;
    }

    if (todoList.length > 0) {
      const newTodo = {
        rowNumber: rowNumber,
        rowDescription: description,
        rowAssigned: assigned
      }
      setTodos([...todoList, newTodo]);
      console.log(todoList);
    }
  }

  const deleteTodo = (rowNumber: number) => {
    const newTodoList = todoList.filter((todo) => todo.rowNumber !== rowNumber);
    setTodos(newTodoList);
  }

  return (
    <div className='mt-5 container'>
      <div className="card">
        <div className="card-header">
          Your Todo's
        </div>
        <div>
          <TodoTable todoList={todoList} deleteTodo={deleteTodo} />
          <button className='btn btn-primary' onClick={() => setShowAddTodoForm(!showAddTodoForm)}>
            {showAddTodoForm ? 'Hide Form' : 'Show Form'}
          </button>
          {showAddTodoForm &&
            <NewTodoForm addTodo={addTodo} />
          }
        </div>
      </div>
    </div>
  );
}

export default App;
