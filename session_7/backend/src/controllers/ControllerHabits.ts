import {Body, Controller, Post, Get, Route, FormField, Query} from "tsoa";
import {UserLoginRequest} from "../models/messages/UserLoginRequest";
import {UserLoginResponse} from "../models/messages/UserLoginResponse";
import moment from "moment";
import * as _ from "lodash";
import {HabitsRequest} from "../models/messages/HabitsRequest";
import {HabitsResponse} from "../models/messages/HabitsResponse";
import {forEach} from "lodash";
import {ControllerDatabase} from "./ControllerDatabase";
import {OrmTodo} from "../models/orm/OrmTodo";
import {Habit} from "../models/db/Habit";
import {OrmUser} from "../models/orm/OrmUser";

@Route("habits")
export class ControllerHabits {

    @Post("update")
    public async update(@Body() request: HabitsRequest): Promise<HabitsResponse> {
        let result = {
            is_success: false,
            habits: [],
        } as HabitsResponse;

        if(request.habits.length!=0){
            let todos: OrmTodo[] = [];
            for(const requestHabit of request.habits){
                let todo = new OrmTodo();
                todo.habit = requestHabit.description;
                todo.user_id = requestHabit.user_id;
                todo.is_deleted = requestHabit.is_deleted;
                todo.number_of_times_in_week = requestHabit.number_of_times_in_week;
                todo.created = "";
                todos.push(todo);
            }
            await ControllerDatabase.instance.updateHabits(todos);
        }

        console.log('update habits');
        console.log(request);
        return result;
    }

    @Get("list")
    public async list(): Promise<HabitsResponse> {
        let result = {
            is_success: false,
            habits: [],
        } as HabitsResponse;

        let habitsList:OrmTodo[] = [];
        habitsList = await ControllerDatabase.instance.listTodo();

        for(const data of habitsList){
                result.habits.push({
                    habitId: data.habit_id,
                    user_id: data.user_id,
                    description: data.habit,
                    number_of_times_in_week: data.number_of_times_in_week,
                    is_deleted: data.is_deleted
                })
        }

        return result;
    }
}
