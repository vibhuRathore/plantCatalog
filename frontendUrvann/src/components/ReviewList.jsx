// src/components/ReviewList.js
import { useAuth } from "../context/AuthContext";

export default function ReviewList({ reviews, onDelete, onEdit }) {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="border p-3 rounded-md bg-gray-50 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{review.username}</p>
            <p>{review.text}</p>
          </div>

          {user && (user.role === "admin" || user.id === review.userId) && (
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded"
                onClick={() => onEdit(review)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded"
                onClick={() => onDelete(review._id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
