import {Router} from "express"; import {list,create} from "../controllers/sessionController.js"; import {protect} from "../middleware/authMiddleware.js";
const r=Router(); r.use(protect); r.route("/").get(list).post(create); export default r;
