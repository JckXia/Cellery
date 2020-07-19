import React from 'react';
import {Dimensions} from 'react-native';
import {Button, Text, View} from 'native-base';
import {useAuth} from "../../providers/authProvider";
import {styles} from "../../styles";
import {ContributionGraph, LineChart} from 'react-native-chart-kit';
import moment from "moment";


export const Dashboard = ({navigation}) => {
    const {handleUserLogOut} = useAuth();
    const time = moment().local();
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
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
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

            <Text style={{fontSize: 20}}>{time.format('MMMM Do')}</Text>
            <Text>{time.format('dddd')}</Text>

            <View style={styles.flex3}>
                <Button style={styles.button}>
                    <Text>{'<'}</Text>
                </Button>
                <ContributionGraph
                                   values={values}
                                   endDate={new Date(time.clone().date(time.daysInMonth()).format('YYYY-MM-DD'))}
                                   numDays={time.daysInMonth()}
                                   width={screenWidth - screenWidth / 8}
                                   height={screenWidth / 13 * 5 + 4 * 5} // squareSize * 5 + 4 * gutterSize
                                   squareSize={screenWidth / 13}
                                   gutterSize={5}
                                   chartConfig={chartConfig}
                                   horizontal={false}
                                   showMonthLabels={false}
                                   onDayPress={() => alert('You touched the square')} // change later to go to detailed cal view
                />
                <Button style={styles.button}>
                    <Text>{'>'}</Text>
                </Button>
            </View>



            <View style={{padding: 10}}>
                <Button style = {styles.button}>
                    <Text>Create/Edit Today's Log</Text>
                </Button>
                <Button style = {styles.button} onPress={() => navigation.navigate('products')}>
                    <Text>View Products</Text>
                </Button>
                <Button style = {styles.button} onPress={() => navigation.navigate('routines')}>
                    <Text>View Skincare Routines</Text>
                </Button>
            </View>

            <LineChart
                data={data}
                width={screenWidth - screenWidth / 6}
                height={200}
                withHorizontalLabels={true}
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
