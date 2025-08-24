import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api("/signup", { method: "POST", body: form });
      alert("Signup successful");
      navigate("/login");
    } catch (err) {
      alert(err.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form
        onSubmit={handleSignup}
        className="bg-white/90 border border-emerald-100 shadow-md rounded-2xl p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-emerald-800">Create account</h2>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full name"
          className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
          type="email"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
          required
        />
        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
