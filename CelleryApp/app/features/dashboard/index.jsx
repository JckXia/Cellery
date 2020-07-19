import React from 'react';
import {View, Dimensions} from 'react-native';
import {useAuth} from "../../providers/authProvider";
import {Button, Icon, Text, Segment, Container, Content} from "native-base";
import {styles} from "../../styles";
import {LineChart, ContributionGraph} from 'react-native-chart-kit';
import moment from "moment";


export const Dashboard = ({navigation}) => {
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
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43],
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            }
        ],
    };

    return (
        <Container>
            <Content padder>
                <Button style = {styles.button} onPress={async () => {
                    await onLogOutSubmitted();
                }}>
                    <Text>
                        Logout
                    </Text>
                </Button>

                <View style={{padding: 5, marginBottom: 10}}>
                    <Text style={{fontSize: 25}}>{time.format('MMMM Do')}</Text>
                    <Text>{time.format('dddd')}</Text>
                </View>

                <View style={styles.flexRow}>
                    <Button style={{marginLeft: 10}}>
                        <Icon type='MaterialIcons' name='chevron-left'/>
                    </Button>
                    <ContributionGraph
                        values={values}
                        endDate={new Date(time.clone().date(time.daysInMonth()).format('YYYY-MM-DD'))}
                        numDays={time.daysInMonth()}
                        width={screenWidth - screenWidth / 5}
                        height={screenWidth / 13 * 5 + 4 * 5} // squareSize * 5 + 4 * gutterSize
                        squareSize={screenWidth / 13}
                        gutterSize={5}
                        chartConfig={chartConfig}
                        horizontal={false}
                        showMonthLabels={false}
                        onDayPress={() => alert('You touched the square')} // change later to go to detailed cal view
                    />
                    <Button style={{marginRight: 10}}>
                        <Icon type='MaterialIcons' name='chevron-right'/>
                    </Button>
                </View>



                <View style={{padding: 10}}>
                    <Button iconLeft style = {styles.button}>
                        <Icon type='FontAwesome5' name='book'></Icon>
                        <Text>Create/Edit Today's Log</Text>
                    </Button>
                    <Button iconLeft style = {styles.button} onPress={() => navigation.navigate('products')}>
                        <Icon type='FontAwesome5' name='seedling'></Icon>
                        <Text>View Products</Text>
                    </Button>
                    <Button iconLeft style = {styles.button} onPress={() => navigation.navigate('routines')}>
                        <Icon type='FontAwesome5' name='scroll'></Icon>
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


                <View style={styles.flexRow}>
                    <Segment>
                        <Button first active>
                            <Text>Past 30 days</Text>
                        </Button>
                        <Button>
                            <Text>Past 90 days</Text>
                        </Button>
                        <Button last>
                            <Text>Past year</Text>
                        </Button>
                    </Segment>
                </View>
            </Content>

        </Container>
    );
}
