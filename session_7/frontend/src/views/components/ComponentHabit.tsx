import {Habit} from "../../../../backend/src/models/db/Habit"
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { trim } from "lodash";

interface Props{
  habit: Habit;
  onHabitChange: (habit)=>void;
  onHabitDelete: (habit)=>void;
}
export const ComponentHabit = (props: Props): React.JSX.Element =>{

  const [isEditing, setIsEditing] = useState(false);
  const[habitDescription,setHabitDesc]= useState(props.habit.description);
  const[numberOfTimesInWeek,setNumberOfTimesInWeek]=useState(props.habit.number_of_times_in_week);
  const onEditHabit = () => {
    setIsEditing(true);
  };
  const onDeleteHabit = () => {
    if(props.onHabitDelete){
      props.onHabitDelete({...props.habit,
        number_of_times_in_week: props.habit.number_of_times_in_week,
        description: props.habit.description} as Habit);
    }
  };

  const onSaveHabit = () =>{
    setIsEditing(false);
    if(props.onHabitChange){
      props.habit.description = habitDescription;
      props.habit.number_of_times_in_week = numberOfTimesInWeek;
      props.onHabitChange({...props.habit,
        number_of_times_in_week: props.habit.number_of_times_in_week,
        description: props.habit.description} as Habit);
    }
  };

  return(
  <View style ={{
    flex: 1,
    flexDirection: "row",
    marginBottom:10,
    justifyContent: "center",
  }}>
    <View style={{flex:1,
    justifyContent: "center",
    paddingLeft:10,}}>
      {isEditing ?
        (<TextInput onChangeText={(text)=>setHabitDesc(text)}>{habitDescription}</TextInput>)
        :
        (<Text>{habitDescription}</Text>)
      }
    </View>
    <View style={{flex:1,
      justifyContent: "center",
      paddingLeft:10,}}>
      <Text style={{
        fontWeight:"bold",
      }}>Number of times in week: </Text>
      <TextInput onChangeText={(text)=>setNumberOfTimesInWeek(parseInt(text))}>{numberOfTimesInWeek}</TextInput>
    </View>
    {isEditing ? (  <Button title={"Save"} onPress={onSaveHabit}/>)
      : (<View style={{flexDirection: "row"}}>
    <View style={{marginRight:10}}>
    <Button title={"Edit"} onPress={onEditHabit}/>
    </View>
    <View style={{marginRight:10}}>
    <Button title={"Delete"} onPress={onDeleteHabit}/>
    </View>
  </View>)}
  </View>
)
}
