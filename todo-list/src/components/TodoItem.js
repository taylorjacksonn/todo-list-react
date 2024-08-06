import React, { useEffect } from 'react';
import moment from 'moment';

function TodoItem({ tasks, deleteTask, completeTask, title, handleEdit }) {
    let taskList = [];
    let dueDate = '';


    function handleButton(btnType, task) {
        if (btnType === 'delete') {
            deleteTask(task);
        }   
        if (btnType === 'complete') {
            completeTask(task);
        }
    }
    
    // Change color of each item based on when it's due 
    useEffect(() => {
        let indicators = document.getElementsByClassName('color-indicator');

        let colorMap = {
            'OVERDUE': 'red',
            'TODAY': 'orange', 
            'TOMORROW': 'blue',
            'NEXT 7 DAYS': 'purple',
            'FUTURE': 'gray',
            'COMPLETED': 'green'
        }

        for (const indicator of indicators) {
            indicator.style.backgroundColor = colorMap[indicator.title];
        }
    });

    // Each task item to have a delete and complete button
    for (const task of tasks) {
        dueDate = moment(task.dueDate).format('MMM D h:mm A')
        taskList.push(
            <li key={task.id} id='list-item'>
                <span title={title} className='color-indicator'></span>
                <div className='todo-item-container'>
                    <div onClick={(event) => handleEdit(task)} className='todo-item'>
                        <span className='todo-item-text'>{task.text}</span>
                        <span className='todo-item-due-date'>{dueDate}</span>
                    </div>
                    <div className='time-from-now-container'>
                        <span id='time-from-now'>{moment(task.dueDate).fromNow()}</span>
                        <button className='icon-buttons' type='button' onClick={(event) => handleButton('delete', task)}>
                            <i className='material-icons delete'>delete</i>
                            </button>
                        <button className='icon-buttons' type='button' onClick={(event) => handleButton('complete', task)}>
                        <i className='material-icons checkmark'>checkmark</i>
                            </button>
                    </div>
                </div>
            </li>    
        );
    }

    return (
        <div id="items-container">
            {taskList}
        </div>
    );
}
export default TodoItem;