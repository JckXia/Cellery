import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import {useAuth} from "../../providers/authProvider";
import {Button} from "native-base";
import {styles} from "../../styles";
import {LineChart, ContributionGraph} from 'react-native-chart-kit';
import moment from "moment";


export const Dashboard = () => {
    const {handleUserLogOut} = useAuth();
    let time = moment().local();
    const screenWidth = Dimensions.get('window').width;
    const onLogOutSubmitted = async () => {
        try {
            await handleUserLogOut();
        } catch (e) {
            alert(e);
        }
    };

    // DEFAULT
    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#ffffff",
        backgroundGradientToOpacity: 0, // these first 4 configs make sure no bg on android
        color: () => `rgb(38, 174, 189)`, // CHANGE
    };

    // PLACEHOLDER DATA
    const values = [
        {date: '2020-07-01'},
        {date: '2020-07-02'},
        {date: '2020-07-03'},
        {date: '2020-07-04'},
        {date: '2020-07-05'},
        {date: '2020-07-06'},
        {date: '2020-07-07'}
    ];

    // PLACEHOLDER DATA
    const data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43],
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            }
        ],
    };

    return (
        <View style={{alignContent: 'center', justifyContent: 'center', flex: 1, margin: 30}}>
            <Button style = {styles.button} onPress={async () => {
                await onLogOutSubmitted();
            }}>
                <Text>
                    Logout
                </Text>
            </Button>

            <Text style={{textAlign: 'center', padding: 10}}>{time.format('MMMM')}</Text>

            <ContributionGraph style={{alignItems:'center'}}
                values={values}
                endDate={new Date(time.clone().date(time.daysInMonth()).format('YYYY-MM-DD'))}
                numDays={time.daysInMonth()}
                width={screenWidth - 50} // "centered"
                height={170} // squareSize * 5 + 4 * gutterSize
                squareSize={30}
                gutterSize={5}
                chartConfig={chartConfig}
                horizontal={false}
                showMonthLabels={false}
                onDayPress={() => alert('You touched the square')}
                />


            <View style={{padding: 10}}>
                <Button style = {styles.button}>
                    <Text>Create/Edit Today's Log</Text>
                </Button>

                <Button style = {styles.button}>
                    <Text>View Skincare Routines</Text>
                </Button>
            </View>

            <LineChart
                data={data}
                width={screenWidth - 10} // need to center
                height={200}
                withHorizontalLabels={false}
                fromZero={true}
                chartConfig={chartConfig}
            />


            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                <Button style = {styles.button}>
                    <Text>Past 30 Days</Text>
                </Button>
                <Button style = {styles.button}>
                    <Text>Past 90 Days</Text>
                </Button>
                <Button style = {styles.button}>
                    <Text>Past Year</Text>
                </Button>
            </View>
        </View>
    );
}
