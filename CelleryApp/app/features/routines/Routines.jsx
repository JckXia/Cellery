import React from "react";
import {
    Body,
    Button,
    Container,
    Content,
    Header,
    Icon,
    Left,
    ListItem,
    Right,
    Segment,
    Spinner,
    Text,
    View
} from "native-base";
import {FlatList} from 'react-native';
import {useAuth} from "../../providers/authProvider";
import {useFocusEffect} from "@react-navigation/native";
import {routinesApi} from "../../api";
import Modal from 'react-native-modal';
import {styles} from "../../styles";
import AlertAsync from "react-native-alert-async";
import {COLOURS} from "../../colours";


export function Routines({navigation}) {
    const {state} = useAuth();
    const noRoutinesMsg = 'You have not created this routine yet!';
    const noDesc = <><Text style={{fontStyle: 'italic'}}>No description</Text></>;
    const [load, setLoad] = React.useState(false);
    const [isActive, setIsActive] = React.useState(true);
    const [onPmButton, setPmButton] = React.useState(false);
    const [onAmButton, setAmButton] = React.useState(true);
    const [amRoutine, setAmRoutine] = React.useState([]);
    const [pmRoutine, setPmRoutine] = React.useState([]);
    const [apiInUse, setApiUse] = React.useState(false);
    const [popup, setPopup] = React.useState(false);
    const [activeProduct, setActiveProduct] = React.useState([]);

    useFocusEffect(
        React.useCallback(() => {
            retrieveRoutines();
        }, [])
    );

    const retrieveRoutines = () => {
        setApiUse(true);
        setLoad(false);
        routinesApi.userRoutines(state.jwtToken)
            .then(resp => {
                setAmRoutine(resp.data.am);
                setPmRoutine(resp.data.pm);
                setLoad(true);
            })
            .catch(err => {
                alert('Uh oh...couldn\'t get your routine(s)'); // TODO: A diff way to deal with errors?
                setLoad(true);
            });
        console.log(pmRoutine);
        setApiUse(false);
    }

    const togglePopup = () => {
        setPopup(!popup);
    }

    const handleProductPress = (product) => {
        setActiveProduct(product);
        togglePopup();
    }

    const renderProductsInRoutine = ({item}) => {
        return (<>
            <ListItem>
                <Left>
                    <Text>{item.name}</Text>
                </Left>
                <Right>
                    <Button style={{backgroundColor: COLOURS.celleryLightGrey}} rounded small
                            onPress={() => handleProductPress(item)}>
                        <Icon
                            style={{color: COLOURS.celleryDarkGrey}}
                            type='FontAwesome5'
                            name='glasses'/>
                    </Button>
                </Right>
            </ListItem>
        </>);

    }
    const displayRoutine = (routineProducts) => {
        return (
            <>
                <Modal isVisible={popup} animationIn='fadeIn' animationOut='fadeOut'
                       onBackdropPress={() => setPopup(false)}>
                    <View style={styles.popupContent}>
                        <Text style={styles.popupTitle}>{activeProduct.name}</Text>
                        {activeProduct.description !== "" ? <Text>{activeProduct.description}</Text> : noDesc}
                    </View>
                </Modal>
                <FlatList
                    data={routineProducts}
                    renderItem={renderProductsInRoutine}
                    keyExtractor={(item) => item.productId}/>

            </>
        );
    }

    const handleRoutineAction = (routine) => {
        if (routine == null) {
            const param = {
                routineId: '',
                products: [],
                isAm: isActive
            }
            navigation.navigate('Routine edit', param);
        } else {
            const param = {
                routineId: routine.routineId,
                products: routine.products.map((product) => {
                    return product.productId;
                }),
                isAm: isActive
            }
            navigation.navigate('Routine edit', param);
        }
    }

    const handleDeleteRoutine = async () => {
        const response = await AlertAsync(
            'Are you sure?',
            'Deleting this routine cannot be undone!',
            [
                {text: 'Yes', onPress: () => 'yes'},
                {text: 'No', onPress: () => Promise.resolve('no')}
            ],
            {cancelable: true, onDismiss: () => "no"}
        );

        if (response === "yes") {
            setApiUse(true);
            if (isActive) {
                routinesApi.deleteRoutine(amRoutine.routineId, state.jwtToken)
                    .then(resp => retrieveRoutines())
                    .catch(err => alert('Uh oh...something unexpected happened...'));
            } else {
                routinesApi.deleteRoutine(pmRoutine.routineId, state.jwtToken)
                    .then(resp => retrieveRoutines())
                    .catch(err => alert('Uh oh...something unexpected happened...'));
            }
            setApiUse(false);
        }
    }

    const renderButtons = () => {
        return (
            <>
                {(isActive && amRoutine) || (!isActive && pmRoutine) ?
                    <Button danger transparent disabled={apiInUse} onPress={() => handleDeleteRoutine()}><Icon
                        type='Ionicons' name='trash'/></Button> : <></>}

                <Button transparent disabled={apiInUse}
                        onPress={() => handleRoutineAction(isActive ? amRoutine : pmRoutine)}>
                    {(isActive && amRoutine) || (!isActive && pmRoutine) ?
                        <Icon style={{color: COLOURS.celleryBlue}} type='FontAwesome' name='edit'/> :
                        <Icon style={{color: COLOURS.celleryGreen}} type='Ionicons' name='add-circle'/>}
                </Button>

            </>);
    }

    return (
        <Container>
            <Header hasSegment transparent>
                <Left>
                    <Button transparent disabled={apiInUse} onPress={() => navigation.navigate('home')}>
                        <Icon style={{color: COLOURS.celleryGreen}} type='MaterialIcons' name='chevron-left'/>
                    </Button>
                </Left>
                <Body>
                    <Segment style={{backgroundColor: `rgba(0, 0, 0, 0)`}}>
                        <Button first active={onAmButton}
                                style={{
                                    backgroundColor: onAmButton ? COLOURS.cellerySalmon : COLOURS.celleryMedGrey,
                                    borderColor: onAmButton ? COLOURS.cellerySalmon : COLOURS.celleryMedGrey
                                }}
                                onPress={() => {
                                    if (!isActive) {
                                        setIsActive(true);
                                        setAmButton(true);
                                        setPmButton(false);
                                    }
                                }}>
                            <Icon style={{color: onAmButton ? COLOURS.celleryWhite : COLOURS.celleryDarkGrey}}
                                  type='FontAwesome' name='sun-o'/>
                        </Button>
                        <Button last active={onPmButton}
                                style={{
                                    backgroundColor: onPmButton ? COLOURS.celleryBlue : COLOURS.celleryMedGrey,
                                    borderColor: onPmButton ? COLOURS.celleryBlue : COLOURS.celleryMedGrey
                                }}
                                onPress={() => {
                                    if (isActive) {
                                        setIsActive(false);
                                        setPmButton(true);
                                        setAmButton(false);
                                    }
                                }}>
                            <Icon style={{color: COLOURS.celleryWhite}}
                                  type='FontAwesome' name='moon-o'/>
                        </Button>
                    </Segment>
                </Body>
                <Right>
                    {load ? renderButtons() : <></>}
                </Right>
            </Header>

            {load ?
                isActive ? <Content padder>{amRoutine ? displayRoutine(amRoutine.products) :
                    <Text style={styles.centerText}>{noRoutinesMsg}</Text>}</Content>
                    : <Content padder>{pmRoutine ? displayRoutine(pmRoutine.products) :
                    <Text style={styles.centerText}>{noRoutinesMsg}</Text>}</Content>
                : <Content padder><Spinner color={COLOURS.celleryDarkGrey}/></Content>}
        </Container>
    );
}