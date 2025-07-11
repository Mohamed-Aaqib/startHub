import express from "express"
import { activateUser, logout, registerUser, signInGoogleUser, signInUser } from "../controllers/authController";
import {isAuthenticated} from "@starthub/auth-middleware"

const router = express.Router();

router.post("/sign-up",registerUser)
router.post("/activateUser",activateUser)
router.post("/sign-in",signInUser)
router.post("/sign-in-google",signInGoogleUser)
router.post("/logout",isAuthenticated,logout)


export default router