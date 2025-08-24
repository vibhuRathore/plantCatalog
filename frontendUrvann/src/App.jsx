import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Plants from "./pages/Plants";
import AdminPage from "./pages/AdminPage";
import PlantDetails from "./pages/PlantDetails";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AdminRoute({ children }) {
  const { token, user } = useAuth();
  if (!token || user?.role !== "admin") return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-green-50">
          <Navbar />
          <main className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
            <Routes>
              <Route path="/" element={<Plants />} />
              <Route path="/plants/:id" element={<PlantDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
