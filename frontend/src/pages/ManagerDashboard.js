import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import API from "../services/api";
import Select from "react-select";

function ManagerDashboard() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [employeeIds, setEmployeeIds] = useState([]);

  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
    fetchTasks();
  }, []);

  const fetchProjects = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get("/projects", {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Projects API response:", res.data);

    if (Array.isArray(res.data)) {
      setProjects(res.data);
    } else if (Array.isArray(res.data.projects)) {
      setProjects(res.data.projects);
    } else {
      setProjects([]);
    }

  } catch (error) {
    console.error(error);
    setProjects([]);
  }
};

  const fetchEmployees = async () => {

    const token = localStorage.getItem("token");

    const res = await API.get("/users/employees", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setEmployees(res.data);
  };

  const fetchTasks = async () => {

    const token = localStorage.getItem("token");

    const res = await API.get("/tasks", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setTasks(res.data);
  };

const createTask = async () => {

  if (!title || !projectId || !employeeIds.length === 0) {
    alert("Please fill all fields");
    return;
  }

  try {

    const token = localStorage.getItem("token");

    await API.post(
      "/tasks",
      {
        title,
        description,
        projectId,
        assignedTo: employeeIds
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Task created");

    fetchTasks();

  } catch (error) {

    console.error(error);
    alert("Failed to create task");

  }
};


  const deleteTask = async (taskId) => {

    const token = localStorage.getItem("token");

    await API.delete(`/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchTasks();
  };

  const handleDragEnd = async (result) => {

    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;

    const token = localStorage.getItem("token");

    await API.put(
      `/tasks/${taskId}`,
      { status: newStatus },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    fetchTasks();
  };
  
  const employeeOptions = employees.map((emp) => ({
  value: emp._id,
  label: emp.name
 }));

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const progressTasks = tasks.filter((task) => task.status === "in-progress");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  const getEmployeeNames = (assignedTo) => {
  if (!assignedTo) return "No employee";

  if (Array.isArray(assignedTo)) {
    return assignedTo.map(emp => emp?.name || "").join(", ");
  }

  return assignedTo?.name || "No employee";
 };

  return (

    <DashboardLayout>

      <h2 className="text-2xl font-bold mb-6">Manager Dashboard</h2>

      <div className="bg-white p-6 rounded shadow w-96">

        <h3 className="font-bold mb-4">Create Task</h3>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Task Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border p-2 w-full mb-3"
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="border p-2 w-full mb-3"
          onChange={(e) => setProjectId(e.target.value)}
        >

          <option value="">Select Project</option>

          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.title}
            </option>
          ))}

        </select>

            <Select
                isMulti
                options={employeeOptions}
                className="mb-3"
                placeholder="Select Employees"
                onChange={(selected) =>
                    setEmployeeIds(selected ? selected.map((emp) => emp.value) : [])
                  }
            />
          <button
            disabled={!title || !projectId || employeeIds.length === 0}
            onClick={createTask}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Create Task
          </button>

      </div>

      <h3 className="text-xl font-bold mt-8 mb-4">Task Board</h3>

      <DragDropContext onDragEnd={handleDragEnd}>

        <div className="grid grid-cols-3 gap-6">

          {/* TODO */}
          <Droppable droppableId="todo">

            {(provided) => (

              <div
                className="bg-gray-100 p-4 rounded"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >

                <h4 className="font-bold mb-3">Todo</h4>

                {todoTasks.map((task, index) => (

                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >

                    {(provided) => (

                      <div
                        className="bg-white p-3 mb-2 rounded shadow"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >

                        <p className="font-semibold">{task.title}</p>
                        <p className="text-sm">
                          Employees: {getEmployeeNames(task.assignedTo)}
                        </p>

                        <button
                          onClick={() => deleteTask(task._id)}
                          className="bg-red-500 text-white px-2 py-1 mt-2 rounded"
                        >
                          Delete
                        </button>

                      </div>

                    )}

                  </Draggable>

                ))}

                {provided.placeholder}

              </div>

            )}

          </Droppable>

          {/* IN PROGRESS */}
          <Droppable droppableId="in-progress">

            {(provided) => (

              <div
                className="bg-gray-100 p-4 rounded"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >

                <h4 className="font-bold mb-3">In Progress</h4>

                {progressTasks.map((task, index) => (

                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >

                    {(provided) => (

                      <div
                        className="bg-white p-3 mb-2 rounded shadow"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >

                        <p className="font-semibold">{task.title}</p>
                        <p className="text-sm">
                          Employees: {getEmployeeNames(task.assignedTo)}
                        </p>

                      </div>

                    )}

                  </Draggable>

                ))}

                {provided.placeholder}

              </div>

            )}

          </Droppable>

          {/* COMPLETED */}
          <Droppable droppableId="completed">

            {(provided) => (

              <div
                className="bg-gray-100 p-4 rounded"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >

                <h4 className="font-bold mb-3">Completed</h4>

                {completedTasks.map((task, index) => (

                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >

                    {(provided) => (

                      <div
                        className="bg-white p-3 mb-2 rounded shadow"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >

                        <p className="font-semibold">{task.title}</p>
                        <p className="text-sm">
                          Employees: {getEmployeeNames(task.assignedTo)}
                        </p>

                      </div>

                    )}

                  </Draggable>

                ))}

                {provided.placeholder}

              </div>

            )}

          </Droppable>

        </div>

      </DragDropContext>

    </DashboardLayout>

  );
}

export default ManagerDashboard;