import { Router } from "express";
import { postLogin, postSignUp } from "../controllers/loginSignUpController.js";

const router = Router();

router.post("/signup", postSignUp);
router.post("/login", postLogin);

export default router;
