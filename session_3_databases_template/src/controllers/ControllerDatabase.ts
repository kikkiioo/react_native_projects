import {DataSource, Db} from "typeorm";
import {DbUser} from "../models/db/DbUser";
//import sha1
import * as sha1 from "js-sha1";
import {DbSession} from "../models/db/DbSession";
import {v4 as uuidv4} from 'uuid';
import {OrmUser} from "../models/orm/OrmUser";
import {OrmSession} from "../models/orm/OrmSession";
import {query} from "express";
import {DbHabit} from "../models/db/DbHabit";

export class ControllerDatabase {
    //singleton
    private static _instance: ControllerDatabase;
    private constructor() {
        //init litesql datasource
        this.dataSource = new DataSource({
            type: "sqlite",
            database: "./database.sqlite",
            logging: false,
            synchronize: false,
            entities: [
                OrmUser,
                OrmSession
            ]
        })
    }

    public static get instance(): ControllerDatabase {
        if (!ControllerDatabase._instance) {
            ControllerDatabase._instance = new ControllerDatabase();
        }
        return ControllerDatabase._instance;
    }

    //datasource
    private dataSource: DataSource;

    public async connect(): Promise<void> {
        await this.dataSource.initialize();
    }

    //TODO

    public  async login(
        username: string,
        password: string,
    ): Promise<DbSession> {
        let session: DbSession = null;

        let passwordHashed = sha1(password);

        // if possible always use named parameters not numbered
        // never use string concat
        let rows = await this.dataSource.query(
            "SELECT * FROM users WHERE username = ? AND password = ? AND is_deleted = 0 LIMIT 1",
            [
                username, passwordHashed
            ]
        )
        if (rows.length > 0) {
            let row = rows[0];
            let user: DbUser = row as DbUser;

            let token = uuidv4();
            await this.dataSource.query(
                "INSERT INTO sessions (user_id, device_uuid, token) VALUES (?,?,?)",
                [user.user_id, "", token]
            );

            let rowLast = await this.dataSource.query("SELECT last_insert_rowid() as session_id");
            session = {
                session_id: rowLast.session_id,
                user_id: user.user_id,
                device_uuid: "",
                token: token,
                is_valid: true,
                user: user

            }
        }
        return session;
    }

    public async list_habits( session_token:string) : Promise<DbHabit[]>{

        let habits: DbHabit[] = [];

        // find user with session token
        let userId = await this.dataSource.query(
            "SELECT user_id FROM sessions WHERE token = ? AND is_valid = 1 LIMIT 1",
            [
                session_token
            ]
        )

        let rows = [];

        if(userId.length> 0){
                rows = await this.dataSource.query("SELECT * FROM habits WHERE user_id = ?",
            [
                    userId[0]?.user_id
                ]
            )
        }

        if (rows.length > 0) {
            for(let i=0; i<rows.length;i++){
                habits.push(rows[i] as DbHabit);
            }
        }

        return habits;
    }

    public  async add_habit(
        session_token:string,
        habitLabel:string,
    ): Promise<DbHabit> {

        let habit: DbHabit =null;

        // if possible always use named parameters not numbered
        // never use string concat

        // find user with session token
        let userId = await this.dataSource.query(
            "SELECT user_id FROM sessions WHERE token = ? AND is_valid = 1 LIMIT 1",
            [
                session_token
            ]
        )

        if(userId.length >0) {
            await this.dataSource.query(
                "INSERT INTO habits (user_id, label, is_deleted) VALUES (?,?,?)",
                [userId[0]?.user_id, habitLabel, 0]
            );
            let rowLast = await this.dataSource.query("SELECT * FROM habits ORDER BY habit_id DESC LIMIT 1");

            habit = {
                habit_id: rowLast[0]?.habit_id,
                user_id: rowLast[0]?.user_id,
                label: rowLast[0]?.label,
                is_deleted: true,
                created: rowLast[0]?.created,

            }
        }
        return habit;
    }

    public  async delete_habit(
        session_token:string,
        habit_id:number,
    ): Promise<DbHabit> {

        let habit: DbHabit =null;

        // find user with session token
        let userId = await this.dataSource.query(
            "SELECT user_id FROM sessions WHERE token = ? AND is_valid = 1 LIMIT 1",
            [
                session_token
            ]
        )

        if(userId.length >0) {
            // get habit which will be deleted for response
            habit = await this.dataSource.query(
                "SELECT * FROM habits WHERE habit_id = ? AND user_id = ? LIMIT 1",
                [ habit_id, userId[0]?.user_id]
            ) as DbHabit;

            // delete habit
            await this.dataSource.query(
                "DELETE FROM habits WHERE habit_id = ? AND user_id = ?",
                [ habit_id, userId[0]?.user_id]
            );

            // or update is_deleted to 1
        }
        return habit;
    }

    public  async login_Orm(
        username: string,
        password: string,
    ): Promise<OrmSession> {
        let session: OrmSession = null;

        let passwordHashed = sha1(password);


        let user: OrmUser = await  this.dataSource.manager.findOne(OrmUser,{
            where:{
                username: username,
                password: passwordHashed
            }
        });
        if(user){
            session = new OrmSession();
            session.user_id = user.user_id;
            session.token = uuidv4();
            await this.dataSource.manager.save(session); // session.session_id
        }

        return session;
    }
}
