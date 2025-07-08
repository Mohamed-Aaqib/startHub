import express from "express"
import { deleteMessage, sendMedia, sendMessage, updateMessage } from "../controllers/messageController";
import { isAuthenticated } from "@starthub/auth-middleware";
import { inGroup } from "../customMiddleware/inGroup";

const router = express.Router()

router.post('/',isAuthenticated,inGroup,sendMessage)
router.post('/media',isAuthenticated,inGroup,sendMedia)

router.patch('/:messageId',isAuthenticated,inGroup,updateMessage)
router.delete('/:messageId',isAuthenticated,inGroup,deleteMessage)



export default router;