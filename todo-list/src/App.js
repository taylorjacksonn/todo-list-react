import React, { useState } from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import './App.css';
import moment from 'moment';

// the App component manages the To Do list
function App() {
  
  // toggle task form visibility
  function toggleForm(task, editing) {
    // call setShowForm to update the showForm state
    // !showForm negates the current current value of showForm (hide/show)
    setShowForm(!showForm);
    if (editing) {
      setSelectedTask(task);
      updateTask(task.text);
    } else {
      setSelectedTask(null);
      updateTask('');
    }
   }

  // add new task to task list
  // or edit existing task
  function addTask(taskInput, dueDate, completed, actionType) {
    setTasks((prevTasks) => {
      let updatedTasks;
      if (actionType === 'edit') {
          // if edit, find the task w/ matching id
          updatedTasks = prevTasks.map((task) => {
              if (task.id === selectedTask.id) {
                  // update properties of the existing task
                  return {
                      ...task,
                      text: taskInput,
                      dueDate: dueDate,
                  };
              }
              return task;
          });
          setSelectedTask(null);
      } else {
          // if not an edit, add new task
          const newTask = {
              id: taskIdCounter,
              text: taskInput || "(empty)",
              dueDate: dueDate,
              completed: false,
          };

          // increment id counter for new tasks
          updateIdCounter(taskIdCounter + 1);

          // add new task to the existing tasks
          updatedTasks = [...prevTasks, newTask];
          setSelectedTask(null);
      }

      // update local storage w/ modified tasks
      localStorage.setItem(local_storage_key, JSON.stringify(updatedTasks));

      // return the updated tasks
      return updatedTasks;
  });
  }
  
  // update tasks to mark tasks completed
  // create new array so react will rerender to "actual" change in state
  function completeTask(task) {
    const newTasks = [...tasks];
    console.log('Task [', task.text,'] is completed.')
    for (let i = 0; i < newTasks.length; i++) {
      if (newTasks[i].id === task.id) {
        newTasks[i].completed = true;
      }
    }
    localStorage.setItem(local_storage_key, JSON.stringify(newTasks));
    setTasks(newTasks);
  }

// filter out task to be deleted
  function deleteTask(task) {
    let newTasks = [...tasks];
    console.log('Task [', task.text, '] is deleted.')
    newTasks = newTasks.filter((newTask) => newTask.id !== task.id);
    localStorage.setItem(local_storage_key, JSON.stringify(newTasks));
    setTasks(JSON.parse(localStorage.getItem(local_storage_key)) || []);
  }

  // reset local storage / empty
  function resetAllTasks() {
    if (window.confirm('Are you sure you want to reset your to do list?')) {
      setTasks([]);
      localStorage.clear();
      updateIdCounter(1)
    }
  } 

  // sorts each list of tasks in ascending order so soonest duedate is first
  function sortListsAsc(tasks) {
    return tasks.sort((a, b) => {
      const timeA = moment(a.dueDate, 'YYYY-MM-DDTHH:mm').format('HH:mm');
      const timeB = moment(b.dueDate, 'YYYY-MM-DDTHH:mm').format('HH:mm');
      return timeA.localeCompare(timeB);
    });
  }

  // edit mode
  function handleEdit(task) {
    setSelectedTask(task);
    toggleForm(task, true); 
  }

  const local_storage_key = "tasks";

  // Ensure no duplicate ids upon refresh - if local storage is empty, initialize id to 1
  // If local storage has items, next id will be latest id + 1
  let stored_tasks = JSON.parse(localStorage.getItem(local_storage_key)) || [];
  let init_id;
  if (stored_tasks.length > 0) {
    init_id = stored_tasks[stored_tasks.length -1].id + 1
  }
  else {
    init_id = 1
  }

  const [tasks, setTasks] = useState(stored_tasks);
  const [showForm, setShowForm] = useState(false); // new task form default set to hidden
  const [taskIdCounter, updateIdCounter] = useState(init_id); // assign ids to tasks/update by incrementing by 1
  const [selectedTask, setSelectedTask] = useState(null);
  const [task, updateTask] = useState(selectedTask ? selectedTask.text : '');

  // initialize moment variable for sorting dates
  let now = moment().format();

  // get all tasks from local storage, parse into objs, then sort
  let allTasks = JSON.parse(localStorage.getItem(local_storage_key)) || [];

  // filter tasks into specific lists to be displayed
  let overdueTasks = allTasks.filter((task) => moment(task.dueDate).isBefore(now) && task.completed === false); 
  let tomorrow = (moment(now).add(1, 'day')).startOf('day');
  let todayTasks = allTasks.filter((task) => moment(task.dueDate).isBefore(tomorrow) && moment(task.dueDate).isSameOrAfter(now) && task.completed === false);
  let tomorrowTasks = allTasks.filter((task) => moment(task.dueDate).isSame(tomorrow, 'day') && task.completed === false)
  let nextWeekEnd = (moment(now).add(7, 'day')).endOf("day");
  let nextWeekTasks = allTasks.filter((task) => moment(task.dueDate).isAfter(tomorrow.endOf("day")) && moment(task.dueDate).isBefore(nextWeekEnd) && task.completed === false);
  let futureTasks = allTasks.filter((task) => moment(task.dueDate).isAfter(nextWeekEnd) && task.completed === false);
  let completedTasks = allTasks.filter((task) => task.completed === true);

  // sorted lists
  overdueTasks = sortListsAsc(overdueTasks);
  todayTasks = sortListsAsc(todayTasks);
  tomorrowTasks = sortListsAsc(tomorrowTasks);
  nextWeekTasks = sortListsAsc(nextWeekTasks);
  futureTasks = sortListsAsc(futureTasks);
  completedTasks = sortListsAsc(completedTasks);

  
  return (
    <div className="App">
      <header className="App-header">
        <div id='header-container'>
          <button title='Reset all tasks' className='icon-buttons' type='button' onClick={resetAllTasks}>
            <i className='material-icons restart_alt'>restart_alt</i>
          </button>
          <h1 id='header-title'>To Do</h1>
          <button title='Add a new task' className='icon-buttons' id='add-button' type='button' onClick={toggleForm}>
            <i className='material-icons add'>add_circle</i>
          </button>
        </div>
      </header>
      {/* render the list of tasks using the 'tasks' state mapping through the tasks array and rendering each task item */}
        <div id='all-lists-container'>
            {/* show form below header when button is toggled */}
            {/* showForm: evaluates value of showForm state variable */}
            {/* render the TodoForm only if showForm is true */}
            {showForm && <TodoForm addTask={addTask} taskIdCounter={taskIdCounter} updateIdCounter={updateIdCounter} toggleForm={toggleForm} selectedTask={selectedTask} updateTask={updateTask} task={task}/>}

            {!showForm && (overdueTasks.length !== 0 && overdueTasks !== null) && <TodoList completeTask={completeTask} deleteTask={deleteTask} title='OVERDUE' tasks={overdueTasks} toggleForm={toggleForm} handleEdit={handleEdit} />}
            {!showForm && (todayTasks.length !== 0 && todayTasks !== null) && <TodoList completeTask={completeTask} deleteTask={deleteTask} title='TODAY' tasks={todayTasks} toggleForm={toggleForm} handleEdit={handleEdit}/>}
            {!showForm && (tomorrowTasks.length !== 0 && tomorrowTasks !== null) && <TodoList completeTask={completeTask} deleteTask={deleteTask} title='TOMORROW' tasks={tomorrowTasks} toggleForm={toggleForm} handleEdit={handleEdit}/>}
            {!showForm && (nextWeekTasks.length !== 0 && nextWeekTasks !== null) && <TodoList completeTask={completeTask} deleteTask={deleteTask} title='NEXT 7 DAYS' tasks={nextWeekTasks} toggleForm={toggleForm} handleEdit={handleEdit}/>}
            {!showForm && (futureTasks.length !== 0 && futureTasks !== null) && <TodoList completeTask={completeTask} deleteTask={deleteTask} title='FUTURE' tasks={futureTasks} toggleForm={toggleForm} handleEdit={handleEdit}/>}
            {!showForm && (completedTasks.length !== 0 && completedTasks !== null) && <TodoList completeTask={completeTask} deleteTask={deleteTask} title='COMPLETED' tasks={completedTasks} toggleForm={toggleForm} handleEdit={handleEdit}/>}

        </div>
    </div>
  );
}

export default App;
