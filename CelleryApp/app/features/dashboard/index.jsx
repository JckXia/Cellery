import React from 'react';
import {Dimensions, StatusBar, View} from 'react-native';
import {useAuth} from "../../providers/authProvider";
import {Button, Container, Content, Icon, Segment, Spinner, Text} from "native-base";
import Modal from "react-native-modal";
import {styles} from "../../styles";
import moment from "moment";
import {COLOURS} from "../../colours";
import ContributionGraph from "react-native-chart-kit/dist/contribution-graph";
import LineChart from "react-native-chart-kit/dist/line-chart";


export const Dashboard = ({navigation}) => {
    const {handleUserLogOut} = useAuth();
    const time = moment().local();
    const [load, setLoad] = React.useState(false);
    const [skinRating, setSkinRating] = React.useState([]);
    const [monthLogs, setMonthLogs] = React.useState([]);
    const [settings, setSettings] = React.useState(false);
    const [calTime, setCalTime] = React.useState(time.clone());
    const screenWidth = Dimensions.get('window').width;

    React.useEffect(() => {
        // get cur month data
        setLoad(true);
    }, []);

    const onLogOutSubmitted = async () => {
        try {
            await handleUserLogOut();
            setSettings(false);
        } catch (e) {
            alert(e);
        }
    };

    // TODO
    const getMonthLogs = () => {
        setLoad(false);
        const logs = new Map();
        const endDate = calTime.date();

        let date = 1;
        let startDay = calTime.clone();

        for (date = 1; date <= endDate; ++date) {
            startDay.date(date);
            logs.set(startDay.unix(), false); // key is log date (epoch/unix time) and val is if a log has been created on that day or not
        }

        // TODO: call api to get logs from 1st of calTime's month to calTime and set any logs to true

        let formattedLogData = [];
        for (const [key, value] of logs.entries()) {
            formattedLogData.push()
        }

        setMonthLogs(formattedLogData);
        console.log(formattedLogData);

        setLoad(true);
    }

    // TODO
    const getCalEntryColour = (date, hasLog) => {
        if (hasLog) {
            date.format('YYYY-MM-DD').unix() === calTime.format('YYYY-MM-DD').unix() ? COLOURS.celleryWhite : COLOURS.celleryGreen;
        } else {
            COLOURS.celleryMedGrey
        }
    }

    const calConfig = {
        backgroundGradientFrom: COLOURS.celleryLightGrey,
        backgroundGradientFromOpacity: 100,
        backgroundGradientTo: COLOURS.celleryLightGrey,
        backgroundGradientToOpacity: 100, // these first 4 configs make sure no bg on android
        color: (day) => COLOURS.celleryMedGrey //getCalEntryColour(day.keys()[0], day.values()[0] ) // TODO
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

    // TODO: this line chart isn't good enough...need to replace with diff one...
    const lineConfig = {
        backgroundGradientFrom: COLOURS.celleryLightGrey,
        backgroundGradientFromOpacity: 100,
        backgroundGradientTo: COLOURS.celleryLightGrey,
        backgroundGradientToOpacity: 100,
        color: (opacity = 1) => COLOURS.celleryMedGrey, // label colors
        strokeWidth: '2', // stroke of the data line

        propsForDots: {
            r: "2",
            strokeWidth: "5",
            stroke: COLOURS.cellerySalmon
        },

        propsForLabels: {
            fontSize: 10
        },

        propsForBackgroundLines: {
            stroke: COLOURS.celleryMedGrey,
            strokeWidth: '2',
            strokeDasharray: [0]
        }
    };

    // PLACEHOLDER DATA
    const data = {
        datasets: [
            {
                data: [1, 2, 3, 4, 6, 7, 8, 4, 5, 6, 3, 3, 4, 5, 3, 6, 6, 2, 3, 5, 7, 5, 8, 3, 7, 1, 5, 7],
                color: (opacity = 1) => COLOURS.celleryGreen, // color for line
            }
        ],
    };


    return (
        <Container>
            <StatusBar/>

            <Content padder>
                {load ?
                    <>
                        <View style={[styles.flexRow, {paddingBottom: 10, justifyContent: 'space-between'}]}>
                            <View style={{alignSelf: 'flex-start'}}>
                                <Text style={{fontSize: 35, fontWeight: '500', color: COLOURS.celleryGreen}}>
                                    {time.format('MMMM Do')}
                                </Text>
                                <Text style={{fontSize: 18, color: COLOURS.celleryGreen}}>{time.format('dddd')}</Text>
                            </View>

                            <Button rounded small
                                    style={{alignSelf: 'flex-start', backgroundColor: COLOURS.celleryLightGrey}}
                                    onPress={() => setSettings(true)}>
                                <Icon type='FontAwesome5' style={{color: COLOURS.celleryDarkGrey}} name='cog'/>
                            </Button>
                        </View>

                        <Modal isVisible={settings} animationIn='fadeIn' animationOut='fadeOut'
                               onBackdropPress={() => setSettings(false)}>
                            <View style={styles.popupContent}>
                                <Button transparent style={styles.button} onPress={async () => {
                                    await onLogOutSubmitted();
                                }}>
                                    <Text style={styles.celleryGreen}>
                                        Logout
                                    </Text>
                                </Button>
                            </View>
                        </Modal>

                        <View style={styles.flexRow}>
                            <Button small
                                    style={{
                                        backgroundColor: COLOURS.celleryGreen,
                                        borderTopLeftRadius: 10,
                                        borderTopRightRadius: 10
                                    }}>
                                <Text>{calTime.format('MMMM')}</Text>
                            </Button>
                        </View>


                        <View style={[styles.flexRow, {paddingTop: 2}]}>
                            <Button transparent style={{marginLeft: 10}}>
                                <Icon style={{fontSize: 40, color: COLOURS.celleryDarkGrey}} type='FontAwesome5'
                                      name='caret-left'/>
                            </Button>
                            <ContributionGraph
                                values={values} // TODO: change to monthLogs
                                endDate={new Date(calTime.clone().date(time.daysInMonth()).format('YYYY-MM-DD'))}
                                numDays={calTime.daysInMonth()}
                                width={screenWidth - screenWidth / 5}
                                height={screenWidth / 13 * 5 + 4 * 5} // squareSize * 5 + 4 * gutterSize
                                squareSize={screenWidth / 13}
                                gutterSize={5}
                                chartConfig={calConfig}
                                accessor={'date'}
                                horizontal={false}
                                showMonthLabels={false}
                                onDayPress={() => alert('You touched the square')} // TODO: change later to go to detailed cal view
                                style={{
                                    color: COLOURS.celleryLightGrey,
                                    borderRadius: 20,
                                    paddingLeft: 10,
                                    paddingRight: 10
                                }}
                            />
                            <Button transparent style={{marginRight: 10}}>
                                <Icon style={{fontSize: 40, color: COLOURS.celleryDarkGrey}} type='FontAwesome5'
                                      name='caret-right'/>
                            </Button>
                        </View>


                        <View style={{padding: 10}}>
                            <Button iconLeft style={[styles.button, {backgroundColor: COLOURS.celleryDarkGrey}]}>
                                <Icon type='FontAwesome5' name='book'></Icon>
                                <Text>Create/Edit Today's Log</Text>
                            </Button>
                            <Button iconLeft style={[styles.button, {backgroundColor: COLOURS.celleryGreen}]}
                                    onPress={() => navigation.navigate('products')}>
                                <Icon type='FontAwesome5' name='seedling'></Icon>
                                <Text>View Products</Text>
                            </Button>
                            <Button iconLeft style={[styles.button, {backgroundColor: COLOURS.cellerySalmon}]}
                                    onPress={() => navigation.navigate('routines')}>
                                <Icon type='FontAwesome5' name='scroll'></Icon>
                                <Text>View Skincare Routines</Text>
                            </Button>
                        </View>

                        <LineChart
                            data={data} // TODO: REPLACE THIS CHART WITH ANOTHER ONE FROM DIFF LIB
                            width={screenWidth - screenWidth / 6}
                            height={220}
                            withHorizontalLabels={true}
                            chartConfig={lineConfig}
                            withInnerLines={false}
                            withDots={false}
                            style={{
                                borderRadius: 20,
                                alignItems: 'center'
                            }}
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
                    </>
                    :
                    <>
                        <View style={{alignItems: 'center'}}>
                            <Spinner color={COLOURS.celleryDarkGrey}/>
                            <Text>Getting your dashboard ready...</Text>
                        </View>

                    </>
                }
            </Content>


        </Container>
    );
}
