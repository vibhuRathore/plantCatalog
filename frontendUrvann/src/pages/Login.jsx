import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client.js";


export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await api("/login", {
        method: "POST",
        body: { email, password },
      });
      login({ token: data.token, user: data.user });
      navigate("/");
    } catch (err) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto bg-white shadow rounded-xl p-6 space-y-3">
      <h2 className="text-xl font-semibold text-gray-800">Login</h2>
      <input
        value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
        className="w-full px-3 py-2 border rounded-lg" type="email" required
      />
      <input
        type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
        className="w-full px-3 py-2 border rounded-lg" required
      />
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg">Login</button>
    </form>
  );
}
