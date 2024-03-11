import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const App = () => {
  const [name, setName] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState<number | null>(null); // Ensure editingTask is typed correctly
  const inputRef = useRef<HTMLInputElement>(null); // Ensure inputRef is typed correctly

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = (await axios.get('http://localhost:4000/tasks/')).data;
      setTasks(response.tasks);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const deleteTask = async (taskId: number) => {
    try {
      await axios.delete(`http://localhost:4000/tasks/${taskId}`);
      alert('Task deleted successfully!!!');
      loadTasks();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const markTaskCompleted = async (taskId: number, isCompleted: boolean) => {
    try {
      await axios.put(`http://localhost:4000/tasks/${taskId}`, { is_completed: !isCompleted });
      alert(`Task marked as ${isCompleted ? 'incomplete' : 'completed'}!!!`);
      loadTasks();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<EventTarget | HTMLButtonElement>) => {
    e.preventDefault();
    setName('');

    try {
      if (editingTask) {
        await axios.put(`http://localhost:4000/tasks/${editingTask}`, { name });
        alert('Task updated successfully!!!');
        setEditingTask(null);
      } else {
        await axios.post('http://localhost:4000/tasks/', { name });
        alert('New task added successfully!!!');
      }
      loadTasks();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='container'>
      <div className='fixed-top'>
        <div className="header">
          <h1>Todo Application</h1>
        </div>
        <div className='container'>
          <form className="input-group" onSubmit={handleSubmit}>
            <input
              type="text"
              id="name"
              value={name}
              placeholder="Enter a task"
              onChange={handleTaskChange}
              className="form-control me-3"
              ref={inputRef}
              required
            />
            <button className="btn btn-primary" type="submit">{editingTask ? 'Update Task' : 'Add Task'}</button>
          </form>
        </div>
      </div>
      <div className='container mt-5' style={{ maxHeight: '680px', overflowY: 'auto' }}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">id</th>
              <th scope="col">isComplete</th>
              <th scope="col">Task </th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task: any) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.isCompleted ? (
                  <span className="text text-success">Yes</span>
                ) : (
                  <span className="text text-warning">No</span>
                )}</td>
                <td>
                  {
                    task.name
                  }
                </td>
                <td>
                  {
                    <>
                      <button className='btn btn-info m-2' onClick={() => markTaskCompleted(task.id, task.isCompleted)}>Mark {task.isCompleted ? 'Incomplete' : 'Completed'}</button>
                      <button className='btn btn-warning m-2' onClick={() => setEditingTask(task.id)}>Edit</button>
                      <button className='btn btn-danger m-2' onClick={() => deleteTask(task.id)}>Delete</button>
                    </>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
