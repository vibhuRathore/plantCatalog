import Plant from "../models/Plant.js";

// GET all plants (no pagination, no backend search)
export const getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find();
    res.status(200).json({ plants });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch plants" });
  }
};

// GET plant by ID (with populated reviews)
export const getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id)
      .populate("reviews.user", "name email");
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.status(200).json(plant);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch plant" });
  }
};

// CREATE plant
export const createPlant = async (req, res) => {
  try {
    const plant = await Plant.create(req.body);
    res.status(201).json(plant);
  } catch (err) {
    res.status(400).json({ message: "Failed to create plant" });
  }
};

// UPDATE plant
export const updatePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.status(200).json(plant);
  } catch (err) {
    res.status(400).json({ message: "Failed to update plant" });
  }
};

// DELETE plant
export const deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.status(200).json({ message: "Plant deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete plant" });
  }
};

// ADD review
export const addReview = async (req, res) => {
  try {
    const { stars, comment } = req.body;
    if (!stars) return res.status(400).json({ message: "Stars required" });

    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found" });

    plant.reviews.push({
      user: req.user._id,
      stars: Number(stars),
      comment: comment || "",
      createdAt: new Date(),
    });

    // recalc rating
    const total = plant.reviews.reduce((sum, r) => sum + r.stars, 0);
    plant.rating = Number((total / plant.reviews.length).toFixed(1));

    await plant.save();
    res.status(201).json({ message: "Review added" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add review" });
  }
};

// UPDATE review
export const updateReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const { comment, stars } = req.body;

    const plant = await Plant.findById(id);
    if (!plant) return res.status(404).json({ message: "Plant not found" });

    const review = plant.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const isOwner = String(review.user) === String(req.user._id);
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed to update this review" });
    }

    if (comment !== undefined) review.comment = comment;
    if (stars !== undefined) review.stars = Number(stars);

    const total = plant.reviews.reduce((sum, r) => sum + r.stars, 0);
    plant.rating = Number((total / plant.reviews.length).toFixed(1));

    await plant.save();
    res.json({ message: "Review updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update review" });
  }
};

// DELETE review
export const deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const plant = await Plant.findById(id);
    if (!plant) return res.status(404).json({ message: "Plant not found" });

    const review = plant.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const isOwner = String(review.user) === String(req.user._id);
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed to delete this review" });
    }

    review.deleteOne();

    if (plant.reviews.length > 0) {
      const total = plant.reviews.reduce((sum, r) => sum + r.stars, 0);
      plant.rating = Number((total / plant.reviews.length).toFixed(1));
    } else {
      plant.rating = 0;
    }

    await plant.save();
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review" });
  }
};
