import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";

function AdminDashboard() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createProject = async () => {

    const token = localStorage.getItem("token");

    await API.post(
      "/projects",
      { title, description },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Project created");

    setTitle("");
    setDescription("");
  };

  return (
    <DashboardLayout>

      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      <div className="bg-white p-6 rounded shadow w-96">

        <h3 className="font-bold mb-4">Create Project</h3>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border p-2 w-full mb-3"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={createProject}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Project
        </button>

      </div>

    </DashboardLayout>
  );
}

export default AdminDashboard;