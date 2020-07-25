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
import {useAuth} from "../../providers/authProvider";
import {useFocusEffect} from "@react-navigation/native";
import {routinesApi} from "../../api";
import Modal from 'react-native-modal';
import {styles} from "../../styles";
import {FlatList} from 'react-native';
import AlertAsync from "react-native-alert-async";


export function Routines({navigation}) {
    const {state} = useAuth();
    const noRoutinesMsg = 'You have not created this routine yet!';
    const noDesc = <><Text style={{fontStyle: 'italic'}}>No description</Text></>;
    const [load, setLoad] = React.useState(false);
    const [isActive, setIsActive] = React.useState(true);
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
                    <Button rounded small onPress={() => handleProductPress(item)}><Icon
                        type='FontAwesome5'
                        name='glasses'/></Button>
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
                        <Icon type='FontAwesome' name='edit'/> :
                        <Icon type='Ionicons' name='add-circle'/>}
                </Button>

            </>);
    }

    return (
        <Container>
            <Header hasSegment>
                <Left>
                    <Button transparent disabled={apiInUse} onPress={() => navigation.navigate('home')}>
                        <Icon type='MaterialIcons' name='chevron-left'/>
                    </Button>
                </Left>
                <Body>
                    <Segment>
                        <Button first active={isActive} onPress={() => setIsActive(!isActive)}>
                            <Icon type='FontAwesome' name='sun-o'/>
                        </Button>
                        <Button last active={!isActive} onPress={() => setIsActive(!isActive)}>
                            <Icon type='FontAwesome' name='moon-o'/>
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
                : <Content padder><Spinner color="#000000"/></Content>}
        </Container>
    );
}