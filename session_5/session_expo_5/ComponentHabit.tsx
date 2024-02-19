
import {Button, SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from "react";

interface Props {
    key: string
    name: string
    onDelete: () => void;
    onSaveName:(name:string,key:string) => void;
}


export const ComponentHabit=(props:Props)=>{

    const [isEditMode, setIsEditMode] = useState(false);
    const [localName, setLocalName] = useState(props.name);
    const onPressEdit = () => {
        setIsEditMode(true);
    };

    const onPressSave = () => {
        setIsEditMode(false);
        props.onSaveName(localName,props.name);
    };

    return<View style={styles.container}>
        <View style={styles.item}>
            {isEditMode ? (
                <TextInput
                    style={styles.textInput}
                    value={localName}
                    onChangeText={setLocalName}
                />
            ) : (
                <Text style={styles.itemName}>{props.name}</Text>
            )}
        </View>
        <View style={styles.item}>
            <Button key="uiDeleteButton"
                    title={"Delete"}
                    onPress={props.onDelete}/>
        </View>
        <View style={styles.item}>
            {!isEditMode ? (
            <Button key="uiEditButton"
                    title={"Edit"}
                    onPress={onPressEdit}/>):
                (
                    <Button key="uiSaveButton"
                            title={"Save"}
                            onPress={onPressSave}/>
                )}
        </View>
    </View>
}


const styles = StyleSheet.create({
    container: {
        flex: 3,
        flexDirection: 'row',
        flexWrap:'wrap',
        alignItems:'flex-start',
        gap:10,
        height:100,
    },
    itemName:{
        fontSize: 18,
        fontWeight: "normal",
    },
    item: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 0,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        height:40,
        margin:10,
    },
});


