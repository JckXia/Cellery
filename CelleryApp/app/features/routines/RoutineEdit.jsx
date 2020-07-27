import {useAuth} from "../../providers/authProvider";
import React from 'react';
import {
    Body,
    Button,
    CheckBox,
    Container,
    Content,
    Footer,
    FooterTab,
    Header,
    Icon,
    Left,
    ListItem,
    Right,
    Spinner,
    Text,
    Title
} from "native-base";
import {productsApi, routinesApi} from '../../api/index';
import AlertAsync from "react-native-alert-async";
import {FlatList} from 'react-native';
import {styles} from "../../styles";
import {COLOURS} from "../../colours";


export function RoutineEdit({route, navigation}) {
    const {state} = useAuth();
    const select = 'Select All';
    const unselect = 'Unselect All';
    const {products, isAm, routineId} = route.params;
    const [load, setLoad] = React.useState(false);
    const [allProducts, setAllProducts] = React.useState([]);
    const [productsInRoutine, setProductsInRoutine] = React.useState(products);
    const [apiInUse, setApiUse] = React.useState(false);

    React.useEffect(() => {
        retrieveProducts();
    }, []);

    const retrieveProducts = () => {
        setApiUse(true);
        setLoad(false);
        productsApi.userProducts(state.jwtToken)
            .then(resp => {
                setAllProducts(resp.data);
                setLoad(true);
            })
            .catch(err => {
                alert('Uh oh...couldn\'t get all your products.'); // TODO: A diff way to deal with errors?
                setLoad(true);
            });
        setApiUse(false);
    }

    const handleCheckbox = (product) => {
        const idx = productsInRoutine.indexOf(product.productId);

        if (idx !== -1) {
            // remove from routine
            setProductsInRoutine((old) => [...old.slice(0, idx), ...old.slice(idx + 1)]);
        } else {
            // add to routine
            setProductsInRoutine((old) => old.concat(product.productId));
        }
    }

    const renderProducts = ({item}) => {
        return (<>
            <ListItem>
                <CheckBox checked={productsInRoutine.includes(item.productId)}
                          color={COLOURS.cellerySalmon}
                          onPress={() => handleCheckbox(item)}/>
                <Body>
                    <Text>{item.name}</Text>
                </Body>
            </ListItem>
        </>);
    }

    const displayProductsList = () => {
        if (allProducts.length) {
            return (
                <FlatList
                    data={allProducts}
                    renderItem={renderProducts}
                    keyExtractor={(item) => item.productId}/>
            );

        } else {
            return (
                <Text style={styles.centerText}>You have no products. Go and add some under Products!</Text>
            );
        }
    }

    const handleSaveRoutine = async () => {
        try {
            let msg = 'Changes saved to your routine.';
            setApiUse(true);

            if (routineId.length) {
                // is existing routine, user is modifying existing routine
                if (productsInRoutine.length) {
                    // there are still products in the routine
                    await routinesApi.patchRoutine(routineId, productsInRoutine, isAm, state.jwtToken);
                } else {
                    // same as deleting routine
                    await routinesApi.deleteRoutine(routineId, state.jwtToken);
                    msg = 'Deleted your routine.';
                }

            } else {
                // user is creating a new routine
                await routinesApi.createRoutine(productsInRoutine, isAm, state.jwtToken);
            }

            setApiUse(false);

            await AlertAsync(
                'Yay!', msg,
                [
                    {text: 'Ok', onPress: () => 'ok'},
                ],
                {cancelable: false, onDismiss: () => "ok"}
            );

            navigation.navigate('routines');

        } catch (e) {
            alert('Uh oh...something went wrong...Did you make sure to select at least one product?');
            setApiUse(false);
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

        if (response === 'yes') {
            setProductsInRoutine([]);
            await handleSaveRoutine();
        }
    }

    const handleSelect = (selectText) => {
        if (selectText === select) {
            // Select All
            setProductsInRoutine(allProducts.map(p => p.productId));
        } else {
            // it is Unselect All
            setProductsInRoutine([]);
        }
    }

    const handleBackButton = async () => {
        const noChanges = products.length === productsInRoutine.length &&
            products.every(p => productsInRoutine.includes(p));

        if (products.length === 0 && productsInRoutine.length === 0 || noChanges) {
            navigation.navigate('routines');
        } else {
            const response = await AlertAsync(
                'Are you sure?',
                'Leaving this page won\'t save any changes!',
                [
                    {text: 'Yes', onPress: () => 'yes'},
                    {text: 'No', onPress: () => Promise.resolve('no')}
                ],
                {cancelable: true, onDismiss: () => "no"}
            );

            if (response === 'yes') {
                navigation.navigate('routines');
            }
        }
    };


    return (
        <Container>
            <Header transparent>
                <Left>
                    <Button transparent disabled={apiInUse} onPress={() => handleBackButton()}>
                        <Icon style={{color: COLOURS.celleryGreen}} type='MaterialIcons' name='chevron-left'/>
                    </Button>
                </Left>
                <Body>
                    <Title style={{color: COLOURS.celleryGreen}}>
                        {routineId.length && products.length ? isAm ? 'Edit AM Routine' : 'Edit PM Routine'
                        : isAm ? 'Create AM Routine' : 'Create PM Routine'}</Title>
                </Body>
                <Right>
                    {allProducts.length ?
                        <Button hasText transparent disabled={apiInUse} onPress={() => handleSaveRoutine()}>
                            <Text style={{color: COLOURS.celleryGreen, fontWeight: '500'}}>Save</Text>
                        </Button> : <></>}
                </Right>
            </Header>

            <Content padder>
                {load ? displayProductsList() : <Spinner color={'#000000'}/>}
            </Content>

            {load && allProducts.length ?
                <>
                    <Footer>
                        <FooterTab style={{backgroundColor: COLOURS.celleryGreen}}>
                            <Button onPress={() => handleSelect(select)}>
                                <Text style={{color: COLOURS.celleryWhite}}>{select}</Text>
                            </Button>
                            <Button onPress={() => handleSelect(unselect)}>
                                <Text style={{color: COLOURS.celleryWhite}}>{unselect}</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </>
                : <></>}


        </Container>
    );
}