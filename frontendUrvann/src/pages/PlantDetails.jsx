import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client.js";

export default function PlantDetails() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [plant, setPlant] = useState(null);
  const [comment, setComment] = useState("");
  const [stars, setStars] = useState(5);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editStars, setEditStars] = useState(5);
  const [loading, setLoading] = useState(true);

  const loadPlant = async () => {
    try {
      setLoading(true);
      const data = await api(`/plants/${id}`);
      setPlant(data);
    } catch {
      alert("Failed to load plant");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlant();
  }, [id]);

  const addReview = async () => {
    if (!token) return alert("Login required");
    try {
      await api(`/plants/${id}/reviews`, {
        method: "POST",
        token,
        body: { comment, stars: Number(stars) },
      });
      setComment("");
      setStars(5);
      await loadPlant();
    } catch (err) {
      alert(err.message || "Failed to add review");
    }
  };

  const deleteReview = async (reviewId) => {
    if (!token) return alert("Login required");
    try {
      await api(`/plants/${id}/reviews/${reviewId}`, {
        method: "DELETE",
        token,
      });
      await loadPlant();
    } catch (err) {
      alert(err.message || "Failed to delete review");
    }
  };

  const startEdit = (review) => {
    setEditingReviewId(review._id);
    setEditComment(review.comment || "");
    setEditStars(review.stars);
  };

  const saveEdit = async () => {
    if (!token) return alert("Login required");
    try {
      await api(`/plants/${id}/reviews/${editingReviewId}`, {
        method: "PUT",
        token,
        body: { comment: editComment, stars: Number(editStars) },
      });
      setEditingReviewId(null);
      await loadPlant();
    } catch (err) {
      alert(err.message || "Failed to update review");
    }
  };

  if (loading) return <p className="text-center text-emerald-900/70">Loading...</p>;
  if (!plant) return <p className="text-center text-emerald-900/70">Not found</p>;

  return (
    <div className="space-y-6">
      {/* Plant Info */}
      <div className="bg-white p-6 rounded-2xl shadow border border-emerald-100">
        <img
          src={plant.imageUrl || "https://via.placeholder.com/800x400?text=Plant"}
          alt={plant.name}
          className="w-full h-72 object-cover rounded-xl mb-4"
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-3xl font-extrabold text-emerald-900">{plant.name}</h2>
          <div className="flex gap-2">
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
              Origin: {plant.origin || "Unknown"}
            </span>
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
              💰 ₹{plant.price}
            </span>
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
              ⭐ {plant.rating ?? 0}
            </span>
          </div>
        </div>
        <p className="text-emerald-900/80 mt-3">{plant.description}</p>
      </div>

      {/* Reviews */}
      <div className="bg-white p-6 rounded-2xl shadow border border-emerald-100 space-y-4">
        <h3 className="text-xl font-semibold text-emerald-900">Reviews</h3>

        {Array.isArray(plant.reviews) && plant.reviews.length > 0 ? (
          <ul className="space-y-3">
            {plant.reviews.map((r) => {
              const reviewUserId =
                typeof r.user === "string" ? r.user : r.user?._id;
              const isOwner = user && String(reviewUserId) === String(user._id);
              const isAdmin = user && user.role === "admin";

              return (
                <li
                  key={r._id}
                  className="bg-emerald-50/60 p-4 rounded-lg border border-emerald-100"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-emerald-800">
                      {r.user?.name || r.user?.email || "Anonymous"}
                    </span>
                    <span className="text-sm bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      ⭐ {r.stars} / 5
                    </span>
                  </div>

                  {editingReviewId === r._id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full border border-emerald-200 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-400"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <select
                          value={editStars}
                          onChange={(e) => setEditStars(e.target.value)}
                          className="border border-emerald-200 rounded px-2 py-1"
                        >
                          {[1, 2, 3, 4, 5].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={saveEdit}
                          className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingReviewId(null)}
                          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-emerald-900/80">
                        {r.comment || "(no comment)"}
                      </p>
                      {(isOwner || isAdmin) && (
                        <div className="mt-2 flex gap-4 text-sm">
                          <button
                            onClick={() => startEdit(r)}
                            className="text-emerald-700 hover:text-emerald-900"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => deleteReview(r._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            🗑 Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-emerald-900/70">No reviews yet 🌱</p>
        )}

        {/* Add Review Form */}
        {token && (
          <div className="mt-4 space-y-3">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="🌱 Write your review"
              className="w-full border border-emerald-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400"
              rows={3}
            />
            <div className="flex items-center gap-2">
              <label className="text-sm">Stars:</label>
              <select
                value={stars}
                onChange={(e) => setStars(e.target.value)}
                className="border border-emerald-200 rounded px-2 py-1"
              >
                {[1, 2, 3, 4, 5].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={addReview}
                className="ml-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
              >
                Add Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
