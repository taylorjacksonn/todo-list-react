import React, { useEffect, useState } from 'react';
import moment from 'moment';

// TASK FORM: create tasks, set due date and time
function TodoForm({ addTask, toggleForm, selectedTask, updateTask, task }) {
    let currentDate = moment().format();


    // Initialize state variable including: 
        // Edit Mode: if a task is selected, fill the task input with that previous text. If it's a new task, fill with empty
        // If selecting a task for edit mode, show that task's due date
        // If creating new task, initialize with current date
    const [dueDate, updateDueDate] = useState(selectedTask ? selectedTask.dueDate : currentDate);
    useEffect(() => {
        if (selectedTask !== null) {
            updateTask(selectedTask.text);
            updateDueDate(selectedTask.dueDate);
            console.log(selectedTask)
        }
    }, [selectedTask])

    // On final submit of task, update due date with selected date
    // Adds task to task list
    function handleSubmit(event, task, dueDate) {
        event.preventDefault();  
        const actionType = selectedTask ? 'edit' : 'add'; 
        updateDueDate(event.target.value); 
        addTask(task, dueDate, false, actionType);
        toggleForm(task, actionType);
    }
    function handleClose() {
        toggleForm();
    }

    // Update due date based on user's calendar input
    // Update banner (Ex. 'in 2 hours')
    function handleDateChanges(event) {
        updateDueDate(event.target.value);
    }

    // Preset Buttons
        // Sets due date to specific time, or add minutes or hours to due date.
        // Changes banner time from current time
        // If preset time is before current date, set to next day at that time
    function handlePresetBtns(type, time) {
        let newDueDate;

        if (type === 'set') {
            newDueDate = moment(dueDate).hours(time.hour).minute(time.min)
            if (newDueDate.isBefore(currentDate)) {
                newDueDate.add(24, 'hours');
            }
            newDueDate = moment(newDueDate).format('yyyy-MM-DDTHH:mm');
            updateDueDate(newDueDate);
        }
        else if (type === 'addMin') {
            newDueDate = moment(dueDate).add(time, 'minute');
            newDueDate = newDueDate.format('yyyy-MM-DDTHH:mm');
            updateDueDate(newDueDate);
        }
        else if (type === 'subMin') {
            newDueDate = moment(dueDate).subtract(time, 'minute');
            newDueDate = newDueDate.format('yyyy-MM-DDTHH:mm');
            updateDueDate(newDueDate);
        }
        else if (type === 'addHour') {
            newDueDate = moment(dueDate).add(time, 'hour');
            newDueDate = newDueDate.format('yyyy-MM-DDTHH:mm');
            updateDueDate(newDueDate);
        }
        else if (type === 'subHour') {
            newDueDate = moment(dueDate).subtract(time, 'hour');
            newDueDate = newDueDate.format('yyyy-MM-DDTHH:mm');
            updateDueDate(newDueDate);
        }
    }

    // Changes color of date banner as the user chooses a due date
    // Ex. Red to signify it will initially be marked as overdue
    useEffect(() => {
        const dueDateBanner = document.getElementById('due-date-banner');
            if (moment(dueDate).isBefore(currentDate) || moment(dueDate).isSame(currentDate)) {
                dueDateBanner.style.backgroundColor = '#bd0404';
                dueDateBanner.style.color = 'white';
            } else if (moment(dueDate).isAfter(currentDate)) {
                dueDateBanner.style.backgroundColor = 'gray';
                dueDateBanner.style.color = 'black'; 
            }
    });

    return (
        <div className='form-container'>
            <div id='form-button-container'>
                <button className='icon-buttons close' onClick={handleClose}>
                    <i className='material-icons close'>close</i>
                </button>
                <button id='submit-button' type='submit' className='icon-buttons submit' onClick={(event) => handleSubmit(event, task, dueDate)}>OK</button>
            </div>
            <form id='task-form'>
                <input 
                    id='form-input'
                    type='text'
                    name='task'
                    autoFocus
                    placeholder='Remind me to...'
                    value={task}
                    // when you pass a value you must also pass onChange handler that updates the passed value
                    onChange={(event) => updateTask(event.target.value)}
                />
                <label htmlFor="dueDate"></label>
                <div id='due-date-banner'>{moment(dueDate).format('ddd, MMM D')} at {moment(dueDate).format('h:mm a')} {moment(dueDate).fromNow()}
                    <input
                        type="datetime-local"
                        id="due-date"
                        name="dueDate"

                        value={moment(dueDate).format("yyyy-MM-DDTHH:mm")}
                        // when onChange event occurs (user selects value in input)
                        // call updateDueDate to pass curr value of input as the arg to updateDueDate
                        onChange={(event) => handleDateChanges(event)}
                        />
                </div>
                <table rules="none" id='preset-options-table'>
                    <tbody>
                        <tr>
                            <td> 
                                <button type='button' onClick= {() => handlePresetBtns('set', {hour: 9, min: 30})} className='time-preset-button'>9:30 AM</button>
                                <button type='button' onClick= {() => handlePresetBtns('addMin', 10)}  className='time-preset-button'>+10 min</button>
                                <button type='button' onClick= {() => handlePresetBtns('subMin', 10)} className='time-preset-button'>-10min</button>
                            </td>
                            <td>
                                <button type='button' onClick= {() => handlePresetBtns('set', {hour: 12, min: 0})}  className='time-preset-button'>12:00 PM</button>
                                <button type='button' onClick= {() => handlePresetBtns('addHour', 1)}  className='time-preset-button'>+1 hr</button>
                                <button type='button' onClick= {() => handlePresetBtns('subHour', 1)}  className='time-preset-button'>-1 hr</button>
                            </td>
                            <td>
                                <button type='button' onClick= {() => handlePresetBtns('set', {hour: 18, min: 30})}  className='time-preset-button'>6:30 PM</button>
                                <button type='button' onClick= {() => handlePresetBtns('addHour', 3)}  className='time-preset-button'>+3 hr</button>
                                <button type='button' onClick= {() => handlePresetBtns('subHour', 3)}  className='time-preset-button'>-3 hr</button>
                            </td>
                            <td>
                                <button type='button' onClick= {() => handlePresetBtns('set', {hour: 22, min: 0})}  className='time-preset-button'>10:00 PM</button>
                                <button type='button' onClick= {() => handlePresetBtns('addHour', 24)}  className='time-preset-button'>+1 day</button> 
                                <button type='button' onClick= {() => handlePresetBtns('subHour', 24)}  className='time-preset-button'>-1 day</button>
                            </td>
                        </tr>
                    </tbody>    
                </table>
            </form>
        </div>
    );
}
export default TodoForm;