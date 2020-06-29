import React from 'react';
import {View, Text} from 'react-native';
import {useAuth} from "../../providers/authProvider";
import {Button} from "native-base";

export const Dashboard = () => {
    const { handleUserLogOut } = useAuth();
    const onLogOutSubmitted = async ()=>{
       try{
           await handleUserLogOut();
       } catch(e){
           alert(e);
       }
    };

    return (
        <View>
            <Text>Home sweet home</Text>
            <Button onPress={async ()=>{
                await onLogOutSubmitted();
            }}>
                <Text>
                    LOGOUT
                </Text>
            </Button>
        </View>
    );
}
