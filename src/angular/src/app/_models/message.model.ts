import { Action } from "./action.model";
import { User } from "./user.model";

export interface Message {
  room: string;
  from: User;
  action?: Action;
  content?: any;
  last_modified?: number;
}