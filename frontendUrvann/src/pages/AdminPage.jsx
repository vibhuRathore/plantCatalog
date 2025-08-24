import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client.js";
import PlantForm from "../components/PlantForm";

export default function AdminPage() {
  const { token } = useAuth();
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState("");
  const [inStockFilter, setInStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("none");
  const [page, setPage] = useState(1);
  const limit = 6;

  const [showForm, setShowForm] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);

  const loadPlants = async () => {
    try {
      const data = await api("/plants");
      const allPlants = Array.isArray(data?.plants) ? data.plants : data;
      setPlants(allPlants);
      setPage(1);
    } catch {
      alert("Failed to load plants");
    }
  };

  useEffect(() => {
    loadPlants();
  }, []);

  const filtered = useMemo(() => {
    let results = [...plants];

    if (search.trim()) {
      const term = search.toLowerCase().trim();
      results = results.filter((p) => {
        const categories = Array.isArray(p.categories)
          ? p.categories.join(", ")
          : p.categories;
        return (
          p.name?.toLowerCase().includes(term) ||
          p.origin?.toLowerCase().includes(term) ||
          categories?.toLowerCase().includes(term) ||
          String(p.price).toLowerCase().includes(term) ||
          String(p.inStock).toLowerCase().includes(term)
        );
      });
    }

    if (inStockFilter !== "all") {
      const inStock = inStockFilter === "true";
      results = results.filter((p) => Boolean(p.inStock) === inStock);
    }

    if (sortBy === "priceAsc") {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
      results.sort((a, b) => b.price - a.price);
    }

    return results;
  }, [search, inStockFilter, sortBy, plants]);

  const pages = Math.max(1, Math.ceil(filtered.length / limit));
  const startIdx = (page - 1) * limit;
  const currentPlants = filtered.slice(startIdx, startIdx + limit);

  const deletePlant = async (id) => {
    if (!token) return alert("Login required");
    if (!confirm("Delete this plant?")) return;
    try {
      await api(`/plants/${id}`, { method: "DELETE", token });
      await loadPlants();
    } catch (err) {
      alert(err.message || "Failed to delete plant (admin only)");
    }
  };

  const handleSubmit = async (payload) => {
    if (!token) return alert("Login required");
    try {
      if (editingPlant) {
        await api(`/plants/${editingPlant._id}`, {
          method: "PUT",
          token,
          body: payload,
        });
      } else {
        await api("/plants", {
          method: "POST",
          token,
          body: payload,
        });
      }
      setShowForm(false);
      setEditingPlant(null);
      await loadPlants();
    } catch (err) {
      alert(err.message || "Failed to save plant");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-4xl font-extrabold text-emerald-900 tracking-tight">
            Admin Panel
          </h2>
          <p className="text-emerald-900/70">
            Manage your green catalogue — add, edit, organize.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPlant(null);
            setShowForm(true);
          }}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 transition-colors rounded-xl shadow text-white font-semibold"
        >
          + Add Plant
        </button>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-3 gap-3 bg-white p-4 rounded-xl shadow border border-emerald-100">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search plants, origin, category, price, stock..."
          className="px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
        />

        <select
          value={inStockFilter}
          onChange={(e) => setInStockFilter(e.target.value)}
          className="px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400"
        >
          <option value="all">All Stock</option>
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400"
        >
          <option value="none">Sort</option>
          <option value="priceAsc">💰 Price ↑</option>
          <option value="priceDesc">💰 Price ↓</option>
        </select>
      </div>

      {/* List */}
      {currentPlants.length === 0 ? (
        <p className="text-emerald-900/70 text-center">No plants found 🌱</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {currentPlants.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow border border-emerald-100 p-5 flex items-center gap-5 hover:shadow-lg transition"
            >
              <img
                src={p.imageUrl || "https://via.placeholder.com/100x80?text=Plant"}
                alt={p.name}
                className="w-24 h-24 object-cover rounded-xl border border-emerald-100"
              />
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-semibold text-emerald-900 truncate">
                    {p.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      p.inStock
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {p.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <p className="text-emerald-800/70 truncate">
                  {Array.isArray(p.categories)
                    ? p.categories.join(", ")
                    : p.categories || "—"}
                </p>
                <p className="text-emerald-700 font-bold mt-1">₹{p.price}</p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setEditingPlant(p);
                    setShowForm(true);
                  }}
                  aria-label={`Edit ${p.name}`}
                  className="px-3 py-1 rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deletePlant(p._id)}
                  aria-label={`Delete ${p.name}`}
                  className="px-3 py-1 rounded-lg text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                page === i + 1
                  ? "bg-emerald-600 text-white shadow"
                  : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl border border-emerald-100 transform transition-all animate-[fadeIn_0.12s_ease-out]">
            <PlantForm onSubmit={handleSubmit} initialData={editingPlant || {}} />
            <button
              onClick={() => setShowForm(false)}
              className="mt-6 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
