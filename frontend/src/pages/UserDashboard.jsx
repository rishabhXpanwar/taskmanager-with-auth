import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../api/taskApi";

export default function UserDashboard() {
  const [tasks, setTasks] = useState([]);

  // form state
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");

  // filters
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");

  // fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await getTasks({
        status: statusFilter,
        priority: priorityFilter,
        q: search,
      });

      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter, search]);

  // add task
  const handleAdd = async () => {
    if (!title) return alert("Title required");

    await createTask({
      title,
      priority, // 👈 now sending priority
    });

    setTitle("");
    setPriority("");
    fetchTasks();
  };

  // delete task
  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  // update status
  const handleStatusChange = async (id, status) => {
    await updateTask(id, { status });
    fetchTasks();
  };

  // update priority
  const handlePriorityChange = async (id, priority) => {
    await updateTask(id, { priority });
    fetchTasks();
  };

  // logout
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="page-shell dashboard-shell user-dashboard-shell">
      <div className="dashboard">
        <h2>User Dashboard</h2>

        <button onClick={logout}>Logout</button>

        <hr />

        <div className="dashboard-panel add-task-panel">
          {/* Add Task */}
          <h3>Add Task</h3>

          <input
            value={title}
            placeholder="Enter task..."
            onChange={(e) => setTitle(e.target.value)}
          />

          <select onChange={(e) => setPriority(e.target.value)} value={priority}>
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button onClick={handleAdd}>Add</button>
        </div>

        <hr />

        <div className="dashboard-panel filters-panel">
          {/* Filters */}
          <h3>Filters</h3>

          <select onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="todo">Todo</option>
            <option value="in progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            placeholder="Search tasks..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <hr />

        <div className="dashboard-panel tasks-panel">
          {/* Task List */}
          <h3>Tasks</h3>

          {tasks.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            tasks.map((t) => (
              <div key={t._id} className="task-card">
                <p><b>{t.title}</b></p>

                {/* Status change */}
                <select
                  value={t.status}
                  onChange={(e) =>
                    handleStatusChange(t._id, e.target.value)
                  }
                >
                  <option value="todo">Todo</option>
                  <option value="in progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                {/* Priority change */}
                <select
                  value={t.priority}
                  onChange={(e) =>
                    handlePriorityChange(t._id, e.target.value)
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>

                <button onClick={() => handleDelete(t._id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}