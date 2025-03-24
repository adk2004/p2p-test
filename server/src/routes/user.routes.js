import { Router } from "express";
import { getGroupMessages, getDirectMessages,getUsers, getFiles,requestFileIp } from "../controller/user.controller.js";

const router = Router();

router.route("/groupMessages").get(getGroupMessages);
router.route("/directMessages/:userId").get(getDirectMessages);
router.route("/users").get(getUsers);
router.route("/files/:owner").get(getFiles);
router.route("/fileIp/:fileId").get(requestFileIp);

export default router;
