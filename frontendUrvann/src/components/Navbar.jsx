import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const active =
    "px-3 py-2 rounded-xl bg-emerald-600 text-white shadow-sm transition";
  const inactive =
    "px-3 py-2 rounded-xl text-emerald-900 hover:bg-emerald-100 transition";

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-emerald-100">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="font-extrabold text-emerald-800 text-xl">
            GreenNest
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? active : inactive)}
          >
            Plants
          </NavLink>

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? active : inactive)}
            >
              Admin
            </NavLink>
          )}

          {!token ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? active : inactive)}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) => (isActive ? active : inactive)}
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-sm text-emerald-700 px-3 py-2">
                Hi, {user?.name || user?.email || "Guest"} 👋
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="px-3 py-2 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition shadow-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
