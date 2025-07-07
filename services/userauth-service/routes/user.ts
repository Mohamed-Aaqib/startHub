import express from "express"
import { addFriend, getFriends, getUser, removeFriend, updateUser } from "../controllers/userController";
import { isAuthenticated } from "@starthub/auth-middleware";

const router = express.Router();

router.get('/:id',getUser);
router.put('/:id',isAuthenticated,updateUser);

router.get('/friends',isAuthenticated,getFriends)
router.post('/friends/:id',isAuthenticated,addFriend)
router.delete('/friends/:id',isAuthenticated,removeFriend)


export default router;