import React, {useState} from 'react';
import {StyleSheet, Text, View, Button, TextInput} from 'react-native';
import {ScrollView} from "react-native";
import {FlatList} from "react-native";


export default function App() {
    const [outputText, setOutputText] = useState('Open up App.js to start working');
    const [courseGoals, setCourseGoals] = useState([]);
    const goalInputHandler = (enteredText) => {
        setOutputText(enteredText);
    }

    const addGoalHandler = () => {
        // setCourseGoals(currentGoals => [...currentGoals, outputText]);
        setCourseGoals(currentGoals => [...currentGoals, {id:Math.random.toString(), key:Math.random().toString(),value: outputText}]);
    };

    return (
        <View style={styles.screen}>
            <View style={styles.inputContainer}>
                <TextInput
                           style={styles.input}
                           onChangeText={goalInputHandler}
                           value={outputText}/>
                <Button title={'Add Goals'} onPress={addGoalHandler}/>
            </View>
            <FlatList
                keyExtractor={(item,index)=>item.id}
                data={courseGoals}
                      renderItem={itemData =>(
                          <View  style={styles.item}>
                              <Text>{itemData.item.value}</Text>
                          </View>
                      )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        padding: 50
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        borderColor: '#808080',
        borderWidth: 1,
        marginRight: 10,
        padding: 10
    },
    item:{
        padding: 10,
        marginVertical:10 ,
        backgroundColor:'#808080',
        borderColor: '#808080',
        borderWidth: 41
    }
});
