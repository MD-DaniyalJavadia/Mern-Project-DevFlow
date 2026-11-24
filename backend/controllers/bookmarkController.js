import Model from "../models/Bookmark.js";
import { makeCrud } from "./crudController.js";
export const {list,get,create,update,remove}=makeCrud(Model,"Bookmark");
