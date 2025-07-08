import express from "express";
import { addMember, createChat, createGroupChat, getAllChats, getChatInfo, getMessages, promoteMember, removeMember } from "../controllers/chatController";
import { isAuthenticated } from "@starthub/auth-middleware";
import { inGroup } from "../customMiddleware/inGroup";
import { isAdmin } from "../customMiddleware/isAdmin";

const router = express.Router();

router.post("/direct/:userId",isAuthenticated,createChat)
router.post("/",isAuthenticated,createGroupChat)
router.get("/",isAuthenticated,getAllChats)


router.get("/:chatId",isAuthenticated,inGroup,getChatInfo)
router.get("/:chatId/messages",isAuthenticated,inGroup,getMessages)

router.post("/:chatId/members",isAuthenticated,inGroup,isAdmin,addMember)
router.delete("/:chatId/members/:userId",isAuthenticated,inGroup,removeMember)
router.patch("/:chatId/members",isAuthenticated,inGroup,isAdmin,promoteMember)



export default router;