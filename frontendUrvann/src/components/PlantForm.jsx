import { useEffect, useState } from "react";

export default function PlantForm({ onSubmit, initialData = {} }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    origin: "",
    imageUrl: "",
    inStock: true,
    categories: "",
    description: "",
  });

  useEffect(() => {
    setForm({
      name: initialData.name || "",
      price: initialData.price ?? "",
      origin: initialData.origin || "",
      imageUrl: initialData.imageUrl || "",
      inStock:
        typeof initialData.inStock === "boolean" ? initialData.inStock : true,
      categories: Array.isArray(initialData.categories)
        ? initialData.categories.join(", ")
        : initialData.categories || "",
      description: initialData.description || "",
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      categories: form.categories
        ? form.categories.split(",").map((c) => c.trim()).filter(Boolean)
        : [],
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h3 className="text-2xl font-bold text-emerald-800">
        {initialData?._id ? "Edit Plant" : "Add Plant"}
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm text-emerald-900">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-emerald-900">Price (₹)</label>
          <input
            name="price"
            type="number"
            min="0"
            step="1"
            value={form.price}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-emerald-900">Origin</label>
          <input
            name="origin"
            value={form.origin}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
            placeholder="e.g., India"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-emerald-900">Image URL</label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm text-emerald-900">Categories</label>
        <input
          name="categories"
          value={form.categories}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
          placeholder="e.g., Indoor, Succulent"
        />
        <p className="text-xs text-emerald-800/70">
          Comma-separated (e.g., Indoor, Succulent, Low-Light)
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-sm text-emerald-900">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
          placeholder="A friendly plant that thrives in indirect light..."
        />
      </div>

      <label className="inline-flex items-center gap-2 text-emerald-900">
        <input
          type="checkbox"
          name="inStock"
          checked={form.inStock}
          onChange={handleChange}
          className="w-4 h-4 accent-emerald-600"
        />
        In stock
      </label>

      <button
        type="submit"
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-sm transition"
      >
        {initialData?._id ? "Save Changes" : "Create Plant"}
      </button>
    </form>
  );
}
