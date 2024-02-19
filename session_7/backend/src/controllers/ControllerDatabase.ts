import {DataSource} from "typeorm";
//import sha1
import {v4 as uuidv4} from 'uuid';
import {OrmUser} from "../models/orm/OrmUser";
import {OrmSession} from "../models/orm/OrmSession";
import {OrmTodo} from "../models/orm/OrmTodo";
import moment from "moment/moment";

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
                OrmSession,
                OrmTodo,
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


    public async login(username,password):Promise<OrmSession>{

        let session: OrmSession = null;
        let user: OrmUser = await  this.dataSource.manager.findOne(OrmUser,{
            where:{
                username: username,
                password: password,
            }
        });

        let timeNow = moment();

        if(user){
            session = new OrmSession();
            session.user_id = user.user_id;
            session.token = uuidv4();
            await this.dataSource.manager.save(session); // session.session_id
        }

        return session;
    }


    public async register(username,email,password):Promise<OrmUser>{
        let session: OrmSession = null;

        let passwordHashed: any;
        //passwordHashed = sha1(password);

        let user: OrmUser = new OrmUser();

        let timeNow = moment();

        user.username = username;
        //user.email = email;
        user.password = password;
        user.is_deleted = false;
        user.is_activated = false;

        if(user){
            await this.dataSource.manager.save(user);
        }

        return user;
    }

    public async confirmUser(user_id):Promise<OrmUser>{

        let session: OrmSession = null;

        let user: OrmUser = await  this.dataSource.manager.findOne(OrmUser,{
            where:{
                user_id: user_id
            }
        });

        if(user){
            user.is_activated = true;
            await this.dataSource.manager.save(user);
        }

        return user;
    }

    public async addTodo(session_token,todoDesc):Promise<OrmTodo>{

        let session = await  this.dataSource.manager.findOne(OrmSession,{
            where:{
                token:session_token
            }
        });

        let todo = new OrmTodo();

        if(session){
            todo.user_id = session.user_id;
            //todo.todo = todoDesc;
            todo.is_deleted = false;

            await this.dataSource.manager.save(todo);
        }

        return todo;
    }

    public async listTodo():Promise<OrmTodo[]>{

        let todos: OrmTodo[] = await this.dataSource.manager.find(OrmTodo);
        return todos;
    }

    public async removeTodo(session_token):Promise<OrmTodo>{

        let session = await  this.dataSource.manager.findOne(OrmSession,{
            where:{
                token:session_token
            }
        });

        let todo: OrmTodo = await this.dataSource.manager.findOne(OrmTodo,{
            where:{
                user_id: session.user_id,
            }
        });

        if(todo){
            await this.dataSource.manager.remove(todo);
        }
        return todo;
    }

    public async updateHabits(habitsToUpdate:OrmTodo[]):Promise<OrmTodo[]>{

        /*for (const habitData of habitsToUpdate) {
            let todo = new OrmTodo();
            todo = await this.dataSource.manager.findOne(OrmTodo,{ where: { habit_id: habitData.habit_id } });

            if (todo) {
                if(habitData.is_deleted){
                    await this.dataSource.manager.remove(todo);
                }
                else{
                    await this.dataSource.manager.save(todo);
                }
            }
            else{
                await this.dataSource.manager.save(habitData);
            }
        }

        let todos: OrmTodo[] = await this.dataSource.manager.find(OrmTodo);

        return todos;*/

        // Remove existing habits
        await this.dataSource.manager.delete(OrmTodo, {});

        // Save new habits
        for (const habitData of habitsToUpdate) {
            await this.dataSource.manager.save(OrmTodo, habitData);
        }

        // Fetch and return all habits
        const todos: OrmTodo[] = await this.dataSource.manager.find(OrmTodo);
        return todos;

    }
}
