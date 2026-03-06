import { useNavigate } from "react-router-dom";

function DashboardLayout({ children }) {

  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}

      <div className="w-64 bg-indigo-600 text-white p-6">

        <h2 className="text-2xl font-bold mb-8">
          Task Manager
        </h2>

        <ul className="space-y-4">

          {role === "admin" && (
            <li
              className="cursor-pointer hover:text-gray-200"
              onClick={() => navigate("/admin")}
            >
              Admin Dashboard
            </li>
          )}

          {role === "manager" && (
            <li
              className="cursor-pointer hover:text-gray-200"
              onClick={() => navigate("/manager")}
            >
              Manager Dashboard
            </li>
          )}

          {role === "employee" && (
            <li
              className="cursor-pointer hover:text-gray-200"
              onClick={() => navigate("/employee")}
            >
              My Tasks
            </li>
          )}

          <li
            className="cursor-pointer hover:text-gray-200"
            onClick={logout}
          >
            Logout
          </li>

        </ul>

      </div>

      {/* Main Content */}

      <div className="flex-1 p-8">

        {children}

      </div>

    </div>

  );
}

export default DashboardLayout;