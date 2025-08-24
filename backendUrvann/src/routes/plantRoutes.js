import { Router } from "express";
import {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  addReview,
  updateReview,
  deleteReview,
} from "../controllers/plantController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllPlants);
router.get("/:id", getPlantById);

router.post("/", protectRoute, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
}, createPlant);

router.put("/:id", protectRoute, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
}, updatePlant);

router.delete("/:id", protectRoute, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
}, deletePlant);

// Reviews
router.post("/:id/reviews", protectRoute, addReview);
router.put("/:id/reviews/:reviewId", protectRoute, updateReview);
router.delete("/:id/reviews/:reviewId", protectRoute, deleteReview);

export default router;
