import React from 'react';
import {Dimensions, StatusBar, View} from 'react-native';
import {useAuth} from "../../providers/authProvider";
import {Button, Container, Content, Icon, Segment, Spinner, Text} from "native-base";
import Modal from "react-native-modal";
import {styles} from "../../styles";
import moment from "moment";
import {COLOURS} from "../../colours";
import ContributionGraph from "react-native-chart-kit/dist/contribution-graph";
import {LineChart, YAxis, Grid} from "react-native-svg-charts";


export const Dashboard = ({navigation}) => {
    const {handleUserLogOut} = useAuth();
    const time = moment().local();
    const [load, setLoad] = React.useState(false);
    const [skinRating, setSkinRating] = React.useState([]);
    const [monthLogs, setMonthLogs] = React.useState([]);
    const [settings, setSettings] = React.useState(false);
    const [calTime, setCalTime] = React.useState(time.clone());
    const screenWidth = Dimensions.get('window').width;
    const [past30Btn, setPast30Btn] = React.useState(true);
    const [past90Btn, setPast90Btn] = React.useState(false);
    const [pastYearBtn, setPastYearBtn] = React.useState(false);

    React.useEffect(() => {
        // TODO: get cur month data
        console.log(time);
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

    // TODO: fetching skin ratings from logs too...maybe have an effect hook for when there are changes to that btn?
    // TODO: How to handle when to fetch logs again???

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

    // PLACEHOLDER DATA for calendar heatmap
    const values = [
        {date: '2020-08-01'},
        {date: '2020-07-02'},
        {date: '2020-07-03'},
        {date: '2020-07-04'},
        {date: '2020-08-05'},
        {date: '2020-07-06'},
        {date: '2020-07-07'}
    ];

    // PLACEHOLDER DATA for skin rating history
    const data = [1, 2, 3, 4, 6, 7, 8, 4, 5, 6, 3, 3, 4, 5, 3, 6, 6, 2, 3, 5, 7, 5, 8, 3, 7, 1, 5, 7];

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
                                <Button hasText transparent style={styles.button} onPress={async () => {
                                    await onLogOutSubmitted();
                                }}>
                                    <Text style={{color: COLOURS.celleryGreen}}>
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
                                onDayPress={() => alert('You touched the squarse')} // TODO: change later to go to detailed cal view
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

                        <View style={styles.flexRow}>
                            <Button small
                                    style={{
                                        backgroundColor: COLOURS.celleryDarkGrey,
                                        borderTopLeftRadius: 10,
                                        borderTopRightRadius: 10
                                    }}>
                                <Text>Skin Rating History</Text>
                            </Button>
                        </View>
                        <View style={{height: 200, flexDirection: 'row'}}>
                            <YAxis
                                data={data}
                                contentInset={{top: 10, bottom: 10}}
                                svg={{
                                    fill: COLOURS.celleryMedGrey,
                                    fontSize: 15,
                                }}
                                numberOfTicks={10}
                                formatLabel={(value) => `${value}`}
                                min={1}
                                max={10}
                            />
                            <LineChart
                                style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    marginRight: 10,
                                    backgroundColor: COLOURS.celleryLightGrey,
                                    borderRadius: 20
                                }}
                                data={data}
                                yMin={1}
                                xMin={1}
                                yMax={10}
                                contentInset={{top: 10, bottom: 10, left: 30, right: 30}}
                                svg={{
                                    strokeWidth: 2.5,
                                    stroke: COLOURS.celleryGreen,
                                    strokeLinecap: 'round'
                                }}
                            >
                            <Grid svg={{stroke: COLOURS.celleryWhite}}/>
                            </LineChart>
                        </View>

                        <View style={styles.flexRow}>
                            <Segment>
                                <Button style={{
                                    borderColor: past30Btn ? COLOURS.celleryDarkGrey : COLOURS.celleryLightGrey,
                                    backgroundColor: past30Btn ? COLOURS.celleryDarkGrey : COLOURS.celleryLightGrey
                                }}
                                        first active={past30Btn}
                                        onPress={() => {
                                            if (!past30Btn) {
                                                setPast90Btn(false);
                                                setPastYearBtn(false);
                                                setPast30Btn(true);
                                            }
                                        }}>
                                    <Text style={{color: past30Btn ? COLOURS.celleryWhite : COLOURS.celleryDarkGrey}}>
                                        Past 30 days
                                    </Text>
                                </Button>

                                <Button style={{
                                    borderColor: past90Btn ? COLOURS.celleryDarkGrey : COLOURS.celleryLightGrey,
                                    backgroundColor: past90Btn ? COLOURS.celleryDarkGrey : COLOURS.celleryLightGrey
                                }}
                                        active={past90Btn}
                                        onPress={() => {
                                            if (!past90Btn) {
                                                setPast30Btn(false);
                                                setPastYearBtn(false);
                                                setPast90Btn(true);
                                            }
                                        }}>
                                    <Text style={{color: past90Btn ? COLOURS.celleryWhite : COLOURS.celleryDarkGrey}}>
                                        Past 90 days
                                    </Text>
                                </Button>

                                <Button style={{
                                    borderColor: pastYearBtn ? COLOURS.celleryDarkGrey : COLOURS.celleryLightGrey,
                                    backgroundColor: pastYearBtn ? COLOURS.celleryDarkGrey : COLOURS.celleryLightGrey
                                }}
                                        active={pastYearBtn} last
                                        onPress={() => {
                                            if (!pastYearBtn) {
                                                setPast30Btn(false);
                                                setPast90Btn(false);
                                                setPastYearBtn(true);
                                            }
                                        }}>
                                    <Text style={{color: pastYearBtn ? COLOURS.celleryWhite : COLOURS.celleryDarkGrey}}>
                                        Past year
                                    </Text>
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
