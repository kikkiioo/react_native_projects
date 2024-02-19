import * as express from "express";
import {Application} from "express";
import * as fs from "fs";
import * as multer from "multer";
import {ControllerDatabase} from "./controllers/ControllerDatabase";
import {DbHabit} from "./models/db/DbHabit";


const main = async () => {
    try {
        const app: Application = express();
        const mult = multer();
        app.use(express.json());
        app.use(express.urlencoded({extended: true})); // get data from HTML forms
        app.use(mult.array("data"));

        await ControllerDatabase.instance.connect();

        let sessionToken = null;

        app.post('/login', async (req, res) => {
            let response = {
                session_token: "",
                success: true
            };

            let request = req.body;
            let session = await ControllerDatabase.instance.login(
                request.username.trim(),
                request.password.trim(),
            )

            if(session){
                response.session_token = session.token;
                response.success = true;
                sessionToken = response.session_token;
            }

            res.json(response);
        });

        app.put('/add_habit', async (req, res) => {

            let response = {
                habit: "",
                success: true
            };

            let request = req.body;
            let habit: DbHabit = await ControllerDatabase.instance.add_habit(
                sessionToken,
                request.label.trim(),
            )

            if(habit){
                response.habit= habit.label;
                response.success = true;
            }

            res.json(response);
        });

        app.get('/list_habits', async (req, res) => {

            let response = {
                habits: [],
                success: true
            };

            let request = req.body;
            let habits = await ControllerDatabase.instance.list_habits(sessionToken)

            if(habits){
                response.habits = habits;
                response.success = true;
            }

            res.json(response);
        });

        app.post('/delete_habit', async (req, res) => {

            let response: {habit: DbHabit, success:boolean} = {
                habit: null,
                success: true,
            };

            let request = req.body;
            let habit = await ControllerDatabase.instance.delete_habit(sessionToken, request.habit_id)

            if(habit){
                response.habit= habit;
                response.success = true;
            }

            res.json(response);
        });


        app.listen(
            8000,
            () => {
                // http://127.0.0.1:8000
                console.log('Server started http://localhost:8000');
            }
        )
    }
    catch (e) {
        console.log(e);
    }
}
main();

