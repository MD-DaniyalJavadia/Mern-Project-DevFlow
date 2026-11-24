import Model from "../models/Bug.js";
import { makeCrud } from "./crudController.js";
export const {list,get,create,update,remove}=makeCrud(Model,"Bug");
