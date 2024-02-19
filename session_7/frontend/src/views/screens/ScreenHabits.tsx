import React, { useEffect, useState } from "react";
import { Button, Platform, ScrollView, Text, View } from "react-native";
import axios, { AxiosResponse } from "axios";
import { Habit } from "../../../../backend/src/models/db/Habit";
import { HabitsRequest } from "../../../../backend/src/models/messages/HabitsRequest";
import { HabitsResponse } from "../../../../backend/src/models/messages/HabitsResponse";
import { ComponentHabit } from "../components/ComponentHabit";
import { OrmTodo } from "../../../../backend/src/models/orm/OrmTodo";

interface Props {
  title: string;
}
export const ScreenHabits = (props: Props): React.JSX.Element => {
  const [habits, setHabits] = useState<Habit[]>([]);

  const getHabits = async () => {

    console.log("getHabits");

    let URL = "http://api.habits.com";
    if (__DEV__) {
      if (Platform.OS === "android") {
        URL = "http://10.0.2.2:8000";
      } else {
        URL = "http://localhost:8000";
      }
    }

    console.log(URL);


    let response: AxiosResponse<HabitsResponse> = await axios.get(
      `${URL}/habits/list`,
      {
        headers: {
          "Content-Type": "application/json",
          responseType: "json",
        },
      },
    );

    console.log(response);

    let habitsResponse: HabitsResponse = response.data;
    console.log(habitsResponse);

    let habitsList: Habit[] = habitsResponse.habits;
    setHabits(habitsList);

    return habitsList;
  };

  const init = async ()=>{
    console.log("init");
    await getHabits();
  }


  useEffect(() => {
// constructor
      // Todo: get habits from backend
      console.log("useEffectt");
      init();

      return () => {
        // destructor
      };
    },
    []);

  const onAddHabit = () => {
    setHabits([...habits, {
      habitId: habits.length + 1,
      user_id: 0,
      description: "New habit",
      number_of_times_in_week: 0,
      is_deleted: false,
    }]);
    syncWithBackend();
  };


  const onHabitEdit = (habit: Habit) => {
    let idxHabit = habits.findIndex((h) => h.habitId === habit.habitId);
    if (idxHabit >= 0) {
      let newHabits = [...habits];
      newHabits[idxHabit] = habit;
      setHabits(newHabits);
    }
    syncWithBackend();
  };

  const onHabitDelete = (habit: Habit) => {
    let idxHabit = habits.findIndex((h) => h.habitId === habit.habitId);
    if (idxHabit >= 0) {
      let newHabits = [...habits];
      newHabits.splice(idxHabit, 1);
      console.log(newHabits);
      setHabits(newHabits);
    }
    syncWithBackend();
  };

  const syncWithBackend = async () => {
    let habitsRequest: HabitsRequest = {
      session_token: "",
      habits,
      modified: new Date().getTime(),
    };

    let URL = "http://api.habits.com";
    if (__DEV__) {
      if (Platform.OS === "android") {
        URL = "http://10.0.2.2:8000";
      } else {
        URL = "http://localhost:8000";
      }
    }

    let response: AxiosResponse<HabitsResponse> = await axios.post(
  `${URL}/habits/update`,
      habitsRequest,
      {
        headers: {
          "Content-Type": "application/json",
          responseType: "json",
        },
      },
  );
    let habitsResponse: HabitsResponse = response.data;
    console.log(habitsResponse);
  };

return (
  <View style={{
    flex: 1,
    backgroundColor: "lighgrey",
    padding: 20,
  }}
  >
    <Text style={{ fontWeight: "bold",
                  fontSize: 24,
                  textAlign: "center",
                  paddingBottom: 20 }}
    >{props.title}
    </Text>
    <ScrollView style={
      {
        backgroundColor: "white",
        flex: 1,
      }
    }
    >
      {habits.map((habit, index) => (
        <ComponentHabit
          key={index}
          habit={habit}
          onHabitChange={onHabitEdit}
          onHabitDelete={onHabitDelete}
        />
))}
    </ScrollView>
    <Button
      title="Add habit"
      onPress={onAddHabit}
    />
  </View>
);
};
