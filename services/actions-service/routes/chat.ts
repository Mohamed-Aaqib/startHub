import express from "express";
import { addMember, createChat, createGroupChat, getAllChats, getChatInfo, getMessages, promoteMember, removeMember } from "../controllers/chatController";
import { isAuthenticated } from "@starthub/auth-middleware";

const router = express.Router();

router.post("/direct/:userId",isAuthenticated,createChat)
router.post("/",isAuthenticated,createGroupChat)
router.get("/",isAuthenticated,getAllChats)


router.get("/:chatId",isAuthenticated,getChatInfo)
router.get("/:chatId/messages",isAuthenticated,getMessages)

router.post("/:chatId/members",isAuthenticated,addMember)
router.delete("/:chatId/members/:userId",isAuthenticated,removeMember)
router.patch("/:chatId/members",isAuthenticated,promoteMember)



export default router;