import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const active =
    "px-3 py-2 rounded-xl bg-emerald-400 text-green-900 shadow-sm transition";
  const inactive =
    "px-3 py-2 rounded-xl text-white hover:bg-green-800 transition";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/90 border-b border-emerald-100">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="font-extrabold text-emerald-800 text-xl">
            GreenNest
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? active
                : "px-3 py-2 rounded-xl text-emerald-900 hover:bg-emerald-100 transition"
            }
          >
            Plants
          </NavLink>

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive
                  ? active
                  : "px-3 py-2 rounded-xl text-emerald-900 hover:bg-emerald-100 transition"
              }
            >
              Admin
            </NavLink>
          )}

          {!token ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? active
                    : "px-3 py-2 rounded-xl text-emerald-900 hover:bg-emerald-100 transition"
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive
                    ? active
                    : "px-3 py-2 rounded-xl text-emerald-900 hover:bg-emerald-100 transition"
                }
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

        {/* Hamburger Button */}
        <button
          className="sm:hidden text-2xl text-emerald-800 z-50"
          onClick={() => setIsOpen(true)}
        >
          ☰
        </button>
      </nav>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-green-900 text-white shadow-xl transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center px-4 py-3 border-b border-green-700">
            <span className="font-bold text-lg">Menu</span>
            <button className="text-2xl" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          {/* Sidebar Links */}
          <div className="flex flex-col flex-1 mt-4 gap-2 px-4">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? active : inactive)}
              onClick={() => setIsOpen(false)}
            >
              Plants
            </NavLink>

            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) => (isActive ? active : inactive)}
                onClick={() => setIsOpen(false)}
              >
                Admin
              </NavLink>
            )}

            {!token ? (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? active : inactive)}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className={({ isActive }) => (isActive ? active : inactive)}
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </NavLink>
              </>
            ) : (
              <>
                <span className="text-sm px-3 py-2">
                  Hi, {user?.name || user?.email || "Guest"} 👋
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                    setIsOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-emerald-500 text-green-900 hover:bg-emerald-400 transition shadow-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </header>
  );
}
