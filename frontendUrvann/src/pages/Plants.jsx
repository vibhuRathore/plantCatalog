import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

export default function Plants() {
  const [plants, setPlants] = useState([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("none");
  const [page, setPage] = useState(1);
  const limit = 9;

  useEffect(() => {
    (async () => {
      try {
        const data = await api("/plants");
        const allPlants = Array.isArray(data?.plants) ? data.plants : data;
        setPlants(allPlants);
        setPage(1);
      } catch (e) {
        alert("Failed to load plants");
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let r = [...plants];
    if (q.trim()) {
      const t = q.toLowerCase().trim();
      r = r.filter(
        (p) =>
          p.name?.toLowerCase().includes(t) ||
          p.origin?.toLowerCase().includes(t) ||
          (Array.isArray(p.categories)
            ? p.categories.join(", ").toLowerCase()
            : p.categories?.toLowerCase()
          )?.includes(t)
      );
    }

    // Sorting
    if (sort === "priceAsc") r.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") r.sort((a, b) => b.price - a.price);
    if (sort === "ratingAsc") r.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
    if (sort === "ratingDesc") r.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    return r;
  }, [plants, q, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / limit));
  const startIdx = (page - 1) * limit;
  const currentPlants = filtered.slice(startIdx, startIdx + limit);

  return (
    <div className="space-y-6">
      {/* Search + Sort */}
      <section className="rounded-2xl p-6 bg-emerald-100/50 border border-emerald-200 flex flex-col sm:flex-row gap-3 items-center">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search plants by name, origin, category..."
          className="flex-1 px-4 py-2 rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="none">Sort</option>
          <option value="priceAsc">Price ↑</option>
          <option value="priceDesc">Price ↓</option>
          <option value="ratingAsc">Rating ↑</option>
          <option value="ratingDesc">Rating ↓</option>
        </select>
      </section>

      {/* List */}
      {currentPlants.length === 0 ? (
        <p className="text-center text-emerald-900/70">No plants found 🌱</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPlants.map((p) => (
            <Link
              to={`/plants/${p._id}`}
              key={p._id}
              className="group bg-white border border-emerald-100 rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={p.imageUrl || "https://via.placeholder.com/600x400?text=Plant"}
                alt={p.name}
                className="h-44 w-full object-cover group-hover:scale-[1.02] transition"
                loading="lazy"
              />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-emerald-900">{p.name}</h3>
                  <span className="text-emerald-700 text-sm font-medium">
                    ⭐ {Number(p.rating ?? 0)}
                  </span>
                </div>
                <p className="text-sm text-emerald-800/70">
                  {p.origin || "Unknown origin"}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-emerald-700 font-bold">₹{p.price}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                    {Array.isArray(p.categories)
                      ? p.categories.join(", ")
                      : p.categories || "Plant"}
                  </span>
                </div>
              </div>
            </Link>
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
    </div>
  );
}
