import { Link } from "react-router-dom";

export default function PlantCard({ plant }) {
  return (
    <div className="border rounded-xl p-4 shadow-md hover:shadow-xl hover:scale-105 transition bg-white relative">
      <img
        src={plant.imageUrl || "https://via.placeholder.com/600x400?text=Plant"}
        alt={plant.name}
        className="w-full h-48 object-cover rounded-lg mb-3"
      />

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-green-800">{plant.name}</h3>
        <span className="text-green-600 text-sm font-medium">
          ⭐ {Number(plant.rating ?? 0)}
        </span>
      </div>

      {plant.categories?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {plant.categories.map((c, i) => (
            <span
              key={i}
              className="bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {/* Origin */}
      <p className="text-sm text-gray-600 mt-2">
        Origin: {plant.origin || "Unknown"}
      </p>

      {/* Price + Stock */}
      <div className="mt-3 flex items-center justify-between">
        <p className="font-bold text-green-900">₹{plant.price}</p>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            plant.inStock
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {plant.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* View Details Link */}
      <Link
        to={`/plants/${plant._id}`}
        className="inline-block mt-3 text-sm text-green-700 font-medium hover:underline"
      >
        View Details →
      </Link>
    </div>
  );
}
