import express from "express"
import { logout, registerUser, signInGoogleUser, signInUser } from "../controllers/authController";

const router = express.Router();

router.post("/sign-up",registerUser)
router.post("/sign-in",signInUser)
router.post("/sign-in-google",signInGoogleUser)
router.post("/logout",logout)


export default router