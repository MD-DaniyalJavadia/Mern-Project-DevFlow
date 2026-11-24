import Model from "../models/Snippet.js";
import { makeCrud } from "./crudController.js";
export const {list,get,create,update,remove}=makeCrud(Model,"Snippet");
