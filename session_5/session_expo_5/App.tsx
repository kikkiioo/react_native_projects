import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from "react";
import {ComponentHabit} from "./ComponentHabit";


export default function App() {
  // react hooks
  let[habits,setHabits]= useState<string[]>([])
    let[habitName, setHabitName] = useState('')
    const onPressAddHabit = async ()=>{
        setHabits([...habits,habitName]);
  }
    const handleDeleteHabit = (habitName: string) => {
        let habitsAfterDelete = [];
        for (let i = 0; i < habits.length; i++) {
            if (habitName !== (habits[i])) {
                habitsAfterDelete.push(habits[i]);
            }
        }
        // tas pats tikai ar filter funkciju:
        // let habitsAfterDelete =  habits.filter((habitToDelete) => habitToDelete !== habitName);
        setHabits(habitsAfterDelete);
    };

    const onSaveName = (habitName: string, oldName:string) => {
        let updatedHabitsList = (getUpdatedHabitsList(habits,oldName,habitName));
        setHabits(updatedHabitsList);
    };

    const getUpdatedHabitsList = (habitsBefore:string[], oldName:string, habitName: string)=>{
        let updatedHabits = [];
        for (let i = 0; i < habitsBefore.length; i++) {
            if (habitsBefore[i] === oldName) {
                updatedHabits.push(habitName);
            }
            else {
                updatedHabits.push(habitsBefore[i]);
            }
        }
        // vai arī ar map funkciju:
        // habitsBefore.map((habit) => habit === oldName ? habitName : habit );
        return updatedHabits;
    }


  const init = async ()=>{
  }

    const destroy = async ()=>{
    }

  useEffect(()=>{
      init();
      return()=>{
          destroy();
      };
  }, []);


  return (
      <View style={styles.container}>
          <View style={styles.habits}>
              {habits.map(it => <ComponentHabit  key={it}
                                                        name={it}
                                                        onDelete={() => handleDeleteHabit(it)}
                                                        onSaveName={onSaveName}/>)}
          </View>

          <View style={styles.bottomContainer}>
              <TouchableOpacity style={styles.buttonAddHabits} onPress={onPressAddHabit}>
                  <Text style={styles.addHabitsText}>Add habit</Text>
              </TouchableOpacity>
              <TextInput
                  key='habitName'
                  style={styles.textInput}
                  value={habitName}
                  onChangeText={setHabitName}
              />
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin:10,
    },
    habits: {
        flex:2,
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonAddHabits: {
        backgroundColor: '#778da9',
        margin:10,
        height:40,
        width: '90%',
    },
    addHabitsText: {
        textAlign: 'center',
        fontSize: 24,
        color: 'white',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        height:40,
        padding: 10,
        margin:10,
        width: '90%',
    },
});
