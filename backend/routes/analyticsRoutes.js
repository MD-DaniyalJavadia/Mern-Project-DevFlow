import {Router} from "express"; import {analytics} from "../controllers/analyticsController.js"; import {protect} from "../middleware/authMiddleware.js";
const r=Router(); r.get("/",protect,analytics); export default r;
