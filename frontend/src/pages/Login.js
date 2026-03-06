import { useState } from "react";
import API from "../services/api";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const res = await API.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") {
        window.location.href = "/admin";
      } else if (res.data.role === "manager") {
        window.location.href = "/manager";
      } else {
        window.location.href = "/employee";
      }

    } catch (error) {

      alert("Invalid email or password");

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">

      <div className="bg-white p-8 rounded-xl shadow-lg w-96">

        <h1 className="text-3xl font-bold text-center mb-6">
          Task Manager
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Login to continue
        </p>

        <input
          type="email"
          placeholder="Email"
          className="border p-3 w-full mb-4 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 w-full mb-6 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full p-3 rounded"
        >
          Login
        </button>
        <p className="text-center mt-4 text-gray-600">
          Don't have an account? 
          <a href="/register" className="text-indigo-600 font-semibold ml-1">
            Register
          </a>
        </p>
      </div>

    </div>

  );
}

export default Login;