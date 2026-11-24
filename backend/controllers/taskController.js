import Model from "../models/Task.js";
import { makeCrud } from "./crudController.js";
export const {list,get,create,update,remove}=makeCrud(Model,"Task");
