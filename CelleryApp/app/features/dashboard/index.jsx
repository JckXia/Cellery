import React from 'react';
import {View, Text} from 'react-native';
import {useAuth} from "../../providers/authProvider";
import {Button} from "native-base";
import {styles} from "../../styles";
import CalendarHeatmap from 'react-native-calendar-heatmap';
import moment from "moment";


export const Dashboard = () => {
    const {handleUserLogOut} = useAuth();
    let time = moment().local();

    const onLogOutSubmitted = async () => {
        try {
            await handleUserLogOut();
        } catch (e) {
            alert(e);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Home sweet home</Text>
            <Button onPress={async () => {
                await onLogOutSubmitted();
            }}>
                <Text>
                    LOGOUT
                </Text>
            </Button>

            <CalendarHeatmap // needs to be fixed
                endDate={new Date(time.clone().date(time.daysInMonth()).format('YYYY-MM-DD'))}
                numDays={time.daysInMonth()}
                values={[
                    {date: '2020-07-01'},
                    {date: '2020-07-02'},
                    {date: '2020-07-03'},
                    {date: '2020-07-04'},
                    {date: '2020-07-05'},
                    {date: '2020-07-06'},
                    {date: '2020-07-07'}
                ]} // call to get which days user has log records
                gutterSize={20}
                horizontal={false}
                showMonthLabels={false}
            ></CalendarHeatmap>

        </View>
    );
}
