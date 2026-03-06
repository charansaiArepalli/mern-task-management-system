import { useState } from "react";
import API from "../services/api";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    try {

      await API.post("/auth/register", {
        name,
        email,
        password
      });

      alert("Registration successful. Please login.");
      window.location.href = "/";

    } catch (error) {

      alert("Registration failed");

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">

      <div className="bg-white p-8 rounded-xl shadow-lg w-96">

        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Register to start using Task Manager
        </p>

        <input
          type="text"
          placeholder="Name"
          className="border p-3 w-full mb-4 rounded"
          onChange={(e) => setName(e.target.value)}
        />

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
          onClick={handleRegister}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full p-3 rounded"
        >
          Register
        </button>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?
          <a href="/" className="text-indigo-600 font-semibold ml-1">
            Login
          </a>
        </p>

      </div>

    </div>

  );
}

export default Register;