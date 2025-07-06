import express from "express"
import { addFriend, getFriends, getUser, removeFriend, updateUser } from "../controllers/userController";

const router = express.Router();

router.get('/:id',getUser);
router.put('/:id',updateUser);

router.get('/friends',getFriends)
router.post('/friends/:id',addFriend)
router.delete('/friends/:id',removeFriend)


export default router;