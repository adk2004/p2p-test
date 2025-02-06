import { Router } from "express";
import { getGroupMessages, getDirectMessages } from "../controller/user.controller.js";

const router = Router();

router.route("/groupMessages").get(getGroupMessages);
router.route("/directMessages/").get(getDirectMessages);

export default router;
