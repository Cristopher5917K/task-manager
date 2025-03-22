import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate } from "react-router-dom";
import "../../styles/tasks.css";

const initialTask = {
    task: "",
    date: "",
    importance: ""
};

const Tasks = () => {
    const navigate = useNavigate();
    const [task, setTask] = useState(initialTask);
    const { store, actions } = useContext(Context);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        actions.getTasks();
    }, []);

    const handleChange = ({ target }) => {
        setTask({
            ...task,
            [target.name]: target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!task.task || !task.date || !task.importance) {
            alert("All fields are required.");
            return;
        }

        try {
            let response;

            if (editingTask) {
                response = await actions.editTask(task, editingTask.id);
                if (response === 200) {
                    setTask(initialTask);
                    setEditingTask(null);  // Clear the editing state
                    alert("Task updated");
                }
            } else {
                response = await actions.addTask(task);
                if (response === 201) {
                    setTask(initialTask);
                    await actions.getTasks();
                    alert("Task added");
                }
            }

            if (response !== 200 && response !== 201) {
                alert("Something went wrong, please try later");
            }
        } catch (error) {
            console.log(error);
            alert("An error occurred. Please try again.");
        }
    };

    const sortedTasks = [...store.tasks].sort((a, b) => {
        const order = { HIGH: 1, MEDIUM: 2, LOW: 3 };
        return order[a.importance] - order[b.importance];
    });

    const handleEdit = (taskToEdit) => {
        setTask({
            task: taskToEdit.task,
            date: taskToEdit.date,
            importance: taskToEdit.importance
        });
        setEditingTask(taskToEdit);  
    };

    return (
        store.currentUser ? (
            <div className="task-container py-4">
                <h1 className="task-title mb-4">Welcome, {store.currentUser["name"]}</h1>
                <h3 className="mb-4">
                    You have <span>{store.tasks.length}</span> tasks
                </h3>

                <h4 className="mb-3">{editingTask ? "Edit Task" : "Add New Task"}</h4>
                <form className="task-card p-4 mb-5 shadow" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Task</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Task"
                            name="task"
                            value={task.task}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="date"
                            value={task.date}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Importance</label>
                        <select
                            className="form-select"
                            name="importance"
                            value={task.importance}
                            onChange={handleChange}
                        >
                            <option value="">Choose...</option>
                            <option value="HIGH">HIGH</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="LOW">LOW</option>
                        </select>
                    </div>
                    <button className="task-button btn btn-primary" type="submit">
                        {editingTask ? "Update Task" : "Add Task"}
                    </button>
                </form>

                <h4>Tasks List</h4>
                <div className="task-list">
                    {sortedTasks.length > 0 ? (
                        sortedTasks.map((task, index) => (
                            <div
                                key={index}
                                className={`task-item ${task.importance.toLowerCase()} mb-2 p-3 shadow-sm`}
                                title={`Due date: ${task.date}`}
                            >
                                <span className="task-name">{task.task}</span>
                                <span className="task-badge">{task.importance}</span>
                                <span className="due-date">{task.date}</span>
                                <button
                                    className="btn btn-danger button-delete"
                                    onClick={() => actions.deleteTask(task.id)}
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                                <button
                                    className="btn btn-warning buton-edit"
                                    onClick={() => handleEdit(task)}
                                >
                                    <i className="fa-solid fa-pen"></i>
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="task-no-tasks">No tasks yet.</p>
                    )}
                </div>
            </div>
        ) : store.currentUser == null ? (
            <h1>Loading private route...</h1>
        ) : (
            <Navigate to={"/login"} />
        )
    );
};

export default Tasks;
