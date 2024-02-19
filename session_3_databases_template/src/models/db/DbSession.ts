import {DbUser} from "./DbUser";
import {Db} from "typeorm";

export interface DbSession
{
    session_id: number;
    user_id: number;
    device_uuid: string;
    is_valid: boolean;
    token: string;

    user?: DbUser;
}
