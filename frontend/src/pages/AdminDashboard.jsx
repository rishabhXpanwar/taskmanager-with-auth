import { useEffect, useState } from "react";
import {
  getAllUsers,
  getAllTasks,
  getUserById,
  updateRole,
  deleteUser,
  deleteTaskByAdmin,
} from "../api/adminApi";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserTasks, setSelectedUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await getAllUsers();
    setUsers(res.data.data);
  };

  const fetchTasks = async () => {
    const res = await getAllTasks();
    setTasks(res.data.data);
  };

  const loadDashboard = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUsers(), fetchTasks()]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await updateRole(userId, role);
      await fetchUsers();
      if (selectedUser?._id === userId) {
        const res = await getUserById(userId);
        setSelectedUser(res.data.data.user);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      if (selectedUser?._id === userId) {
        setSelectedUser(null);
        setSelectedUserTasks([]);
      }
      await loadDashboard();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const res = await getUserById(userId);
      setSelectedUser(res.data.data.user);
      setSelectedUserTasks(res.data.data.tasks);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch user details");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTaskByAdmin(taskId);
      await fetchTasks();

      if (selectedUser) {
        const res = await getUserById(selectedUser._id);
        setSelectedUser(res.data.data.user);
        setSelectedUserTasks(res.data.data.tasks);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete task");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="page-shell dashboard-shell admin-dashboard-shell">
      <div className="admin-dashboard">
        <h2>Admin Dashboard</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="admin-section">
              <h3>Users</h3>

              <div className="admin-users-list">
                {users.map((u) => (
                  <div key={u._id} className="admin-user-card">
                    <p>
                      {u.name} - {u.role}
                    </p>

                    <div className="admin-actions">
                      <button onClick={() => handleViewUser(u._id)}>
                        View Details
                      </button>

                      {u.role === "admin" ? (
                        <button onClick={() => handleRoleChange(u._id, "user")}>
                          Make User
                        </button>
                      ) : (
                        <button onClick={() => handleRoleChange(u._id, "admin")}>
                          Make Admin
                        </button>
                      )}

                      <button onClick={() => handleDeleteUser(u._id)}>
                        Delete User
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedUser && (
              <div className="admin-section">
                <h3>
                  {selectedUser.name} ({selectedUser.email}) - {selectedUser.role}
                </h3>

                {selectedUserTasks.length === 0 ? (
                  <p>No tasks for this user.</p>
                ) : (
                  <div className="admin-tasks-list">
                    {selectedUserTasks.map((task) => (
                      <div key={task._id} className="admin-task-card">
                        <p>
                          <b>{task.title}</b> - {task.status} - {task.priority}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="admin-section">
              <h3>All Tasks</h3>

              {tasks.length === 0 ? (
                <p>No tasks available.</p>
              ) : (
                <div className="admin-tasks-list">
                  {tasks.map((task) => (
                    <div key={task._id} className="admin-task-card">
                      <p>
                        <b>{task.title}</b> - {task.status} - {task.priority}
                      </p>

                      <p>
                        Owner: {task.user?.name || "Unknown"} ({task.user?.email || "No email"})
                      </p>

                      <button onClick={() => handleDeleteTask(task._id)}>
                        Delete Task
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}