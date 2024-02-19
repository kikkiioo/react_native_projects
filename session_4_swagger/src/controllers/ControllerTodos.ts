import {Body, Controller, Post, Get, Route, FormField, Query} from "tsoa";
import {TodosRequest} from "../models/messages/TodosRequest";
import {TodosResponse} from "../models/messages/TodosResponse";
import {TodosRequestUpdate} from "../models/messages/TodosRequestUpdate";
import moment from "moment";
import * as _ from "lodash";
import {UserRegisterResponse} from "../models/messages/UserRegisterResponse";
import {OrmUser} from "../models/orm/OrmUser";
import{OrmTodo} from "../models/orm/OrmTodo";
import {ControllerDatabase} from "./ControllerDatabase";
import {describe} from "node:test";


@Route("todos")
export class ControllerTodos {

    // FormField if using file upload otherwise
    @Post("add")
    public async add(@Body() request:TodosRequest): Promise<TodosResponse> {

        let result:TodosResponse={
            is_success: false
        }

        let timeNow = moment();

        if(request.session_token!=null){
            await ControllerDatabase.instance.addTodo(request.session_token, request.todo);
            result.is_success = true;
        }
        return result;
    }

    @Post("list")
    public async list(@Body() request:TodosRequest): Promise<OrmTodo[]> {

        let result:OrmTodo[];
        if(request.session_token!=null){
            let todos = await ControllerDatabase.instance.listTodo(request.session_token);
            result = todos;
        }
        return result;
    }

    @Post("remove")
    public async remove(@Body() request:TodosRequest): Promise<OrmTodo> {

        let result:OrmTodo;
        if(request.session_token!=null){
            let result = await ControllerDatabase.instance.removeTodo(request.session_token);
        }
        return result;
    }

    @Post("update")
    public async update(@Body() request:TodosRequestUpdate): Promise<OrmTodo> {

        let result:OrmTodo;
        if(request.session_token!=null){
            let result = await ControllerDatabase.instance.updateTodo(request.session_token,request.todo,request.updatedTodo);
        }
        return result;
    }

    // post todos/add
    // post todos/list
    // post todos/remove
    // post todos/update
}
