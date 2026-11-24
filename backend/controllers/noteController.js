import Model from "../models/Note.js";
import { makeCrud } from "./crudController.js";
export const {list,get,create,update,remove}=makeCrud(Model,"Note");
