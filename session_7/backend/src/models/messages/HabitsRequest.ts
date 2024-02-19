import {Habit} from "../db/Habit";
import {OrmTodo} from "../orm/OrmTodo";

export interface HabitsRequest{
    session_token: string;
    habits:Habit[];
    modified: number; // unix timestamp
}
