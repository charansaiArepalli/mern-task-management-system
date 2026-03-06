import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../services/api";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/tasks/my-tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/tasks/${taskId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchTasks();
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length;

  return (
    <DashboardLayout>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Total Tasks</p>
          <h3 className="text-2xl font-bold">{totalTasks}</h3>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">In Progress</p>
          <h3 className="text-2xl font-bold text-blue-600">{inProgressTasks}</h3>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Completed</p>
          <h3 className="text-2xl font-bold text-green-600">{completedTasks}</h3>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-6 w-full rounded"
      />

      <h2 className="text-2xl font-bold mb-6">My Tasks</h2>

      {tasks.length === 0 && (
        <p className="text-gray-500">No tasks assigned</p>
      )}

      {tasks
        .filter((task) =>
          task.title.toLowerCase().includes(search.toLowerCase())
        )
        .map((task) => (
          <div
            key={task._id}
            className="bg-white p-5 mb-4 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {task.title}
            </h3>
            <p className="text-gray-500 text-sm mb-3">
              Project: {task.projectId?.title}
            </p>

            <div className="mb-3">
              {task.status === "todo" && (
                <span className="bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-semibold select-none cursor-default">
                  Todo
                </span>
              )}
              {task.status === "in-progress" && (
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold select-none cursor-default">
                  In Progress
                </span>
              )}
              {task.status === "completed" && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold select-none cursor-default">
                  Completed
                </span>
              )}
            </div>

            {task.status !== "in-progress" && task.status !== "completed" && (
              <button
                onClick={() => updateStatus(task._id, "in-progress")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2 cursor-pointer transition select-none"
              >
                Start Task
              </button>
            )}

            {task.status !== "completed" && (
              <button
                onClick={() => updateStatus(task._id, "completed")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer transition select-none active:scale-95"
              >
                Mark Completed
              </button>
            )}
          </div>
        ))}
    </DashboardLayout>
  );
}

export default EmployeeDashboard;