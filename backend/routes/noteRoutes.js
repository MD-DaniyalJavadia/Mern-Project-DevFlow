import {Router} from "express"; import {list,get,create,update,remove} from "../controllers/noteController.js"; import {protect} from "../middleware/authMiddleware.js";
const r=Router(); r.use(protect); r.route("/").get(list).post(create); r.route("/:id").get(get).put(update).delete(remove); export default r;
