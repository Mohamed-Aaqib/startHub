import express from "express"
import { deleteMessage, sendMedia, sendMessage, updateMessage } from "../controllers/messageController";
import { isAuthenticated } from "@starthub/auth-middleware";

const router = express.Router()

router.post('/',isAuthenticated,sendMessage)
router.post('/media',isAuthenticated,sendMedia)

router.patch('/:messageId',isAuthenticated,updateMessage)
router.delete('/:messageId',isAuthenticated,deleteMessage)



export default router;