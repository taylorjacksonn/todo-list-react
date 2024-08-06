import {React} from 'react';
import TodoItem from './TodoItem';


function TodoList({ tasks, title, deleteTask, completeTask, toggleForm, handleEdit }) {

    return (
        <div className='todo-list-container'>
            <h1>{title}</h1>
            <ul className='todo-list'>
                <TodoItem title={title} deleteTask={deleteTask} completeTask={completeTask} tasks={tasks} toggleForm={toggleForm} handleEdit={handleEdit}/>
            </ul>
        </div>
    );
}
export default TodoList;