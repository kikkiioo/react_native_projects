import {Body, Controller, Post, Get, Route, FormField, Query, Path} from "tsoa";
import {UserLoginRequest} from "../models/messages/UserLoginRequest";
import {UserLoginResponse} from "../models/messages/UserLoginResponse";
import {UserRegisterRequest} from "../models/messages/UserRegisterRequest";
import {UserRegisterResponse} from "../models/messages/UserRegisterResponse";
import {UserConfirmationRequest} from "../models/messages/UserConfirmationRequest";
import {UserConfirmationResponse} from "../models/messages/UserConfirmationResponse";
import moment from "moment";
import * as _ from "lodash";

import {ControllerDatabase} from "./ControllerDatabase";

@Route("users")
export class ControllerUsers {


    @Post("login")
    public async login(
        @Body() request:UserLoginRequest): Promise<UserLoginResponse> {

        let result: UserLoginResponse={
            session_token: "",
            is_success: false
        }

        let timeNow = moment();

        if(request.username != ""&& request.password != ""){
            result.session_token = timeNow.utc().unix().toString(); // riga
            result.is_success = true;
            await ControllerDatabase.instance.login(request.username,request.password);
        }
        return result;
    }

    @Post("register")
    public async register(@Body() request: UserRegisterRequest) : Promise<UserRegisterResponse>{

        let result: UserRegisterResponse = {
            is_success: false
        }

        if(request.username != "" && request.password !="" && request.email != ""){
            result.is_success = true;
            await ControllerDatabase.instance.register(request.username,request.email,request.password);
        }
        return result;
    }

    @Get("confirmation/:uuid")
    public async confirmation(@Path('uuid') uuid: string) : Promise<UserConfirmationResponse>{

        let result: UserConfirmationResponse= {
            is_success: false
        }

        if(uuid != ""){
            result.is_success = true;
            await ControllerDatabase.instance.confirmUser(uuid);
        }

        return result;
    }

    // post /user/register - janosuta uz epastu apstiprinajuma url
    // get user/confirmation/:uuid - parada vai lietotajs veiksmigi aktivizets
    // post /user/login
}
