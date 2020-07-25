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
    Title,
    View
} from 'native-base';
import {useAuth} from "../../providers/authProvider";
import {productsApi} from '../../api/index';
import AlertAsync from 'react-native-alert-async';
import {useFocusEffect} from '@react-navigation/native';
import Modal from "react-native-modal";
import {styles} from "../../styles";
import {FlatList} from "react-native";


export function Products({navigation}) {
    const {state} = useAuth();
    const noDesc = <><Text style={{fontStyle: 'italic'}}>No description</Text></>;
    const select = 'Select All';
    const unselect = 'Unselect All';
    const [productsArray, setProductsArray] = React.useState([]);
    const [productsToDelete, setProductsToDelete] = React.useState([]);
    const [load, setLoad] = React.useState(false);
    const [apiInUse, setApiUse] = React.useState(false);
    const [popup, setPopup] = React.useState(false);
    const [activeProduct, setActiveProduct] = React.useState([]);
    const [deleteMode, setDeleteMode] = React.useState(false);

    // makes sure to fetch user's products when user enters the screen
    // (even if component has mounted)
    useFocusEffect(
        React.useCallback(() => {
            retrieveProducts();
        }, [])
    );

    // this is for when the user selects some products on delete mode but toggles back to view mode
    React.useEffect(() => {
        if (!deleteMode) {
            setProductsToDelete([]);
        }
    }, [deleteMode]);

    const retrieveProducts = () => {
        setApiUse(true);
        setLoad(false);
        productsApi.userProducts(state.jwtToken)
            .then(resp => {
                setProductsArray(resp.data);
                setLoad(true);
            })
            .catch(err => {
                alert('Uh oh...couldn\'t get your products'); // TODO: A diff way to deal with errors?
                setLoad(true);
            });
        setApiUse(false);
    }

    const handleProductDelete = async (productId) => {
        const response = await AlertAsync(
            'Are you sure?',
            'Deleting this product will remove it from any routine(s) it is currently in.',
            [
                {text: 'Yes', onPress: () => 'yes'},
                {text: 'No', onPress: () => Promise.resolve('no')}
            ],
            {cancelable: true, onDismiss: () => "no"}
        );

        if (response === 'yes') {
            setApiUse(true);
            productsApi.deleteProduct(productId, state.jwtToken)
                .then(resp => {
                    retrieveProducts();
                })
                .catch(err => {
                    console.log(err);
                    alert('Uh oh, something went wrong when trying to delete the product');
                });
            setApiUse(false);
        }

    }

    /*const _renderHeader = (item, expanded) => {
        return (
            <View style={{
                flexDirection: "row",
                padding: 10,
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#e8e8e8"
            }}>
                <Text style={{fontWeight: "500"}}>
                    {" "}{item.name}
                </Text>
                {expanded
                    ? <Icon style={{fontSize: 18}} name="arrow-up"/>
                    : <Icon style={{fontSize: 18}} name="arrow-down"/>}
            </View>
        );
    }

    const _renderContent = (item) => {
        return (
            <>
                <Text style={{padding: 10}}>{item.description}</Text>

                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
                    <Button small bordered rounded danger onPress={() => handleProductDelete(item.productId)}>
                        <Icon name='trash'></Icon>
                    </Button>
                    <Button small bordered rounded success onPress={() => navigation.navigate('Product form', item)}>
                        <Icon type='FontAwesome' name='edit'/>
                    </Button>
                </View>
            </>
        );
    }*/

    const togglePopup = () => {
        setPopup(!popup);
    }

    const handleProductPress = (product) => {
        setActiveProduct(product);
        togglePopup();
    }

    const handleCheckbox = (product) => {
        const idx = productsToDelete.indexOf(product.productId);

        if (idx !== -1) {
            // remove from to-be-deleted arr
            setProductsToDelete((old) => [...old.slice(0, idx), ...old.slice(idx + 1)]);
        } else {
            // add to to-be-deleted arr
            setProductsToDelete((old) => old.concat(product.productId));
        }
    }

    const renderProducts = ({item}) => {
        return (<>
            <ListItem>
                <Left>
                    <Text>{item.name}</Text>
                </Left>
                <Right>
                    {deleteMode ? <CheckBox checked={productsToDelete.includes(item.productId)} color='red'
                                            onPress={() => handleCheckbox(item)}/> :
                        <Button rounded small onPress={() => handleProductPress(item)}>
                            <Icon type='FontAwesome5' name='glasses'/>
                        </Button>}
                </Right>
            </ListItem>
        </>);
    }

    const displayAllProducts = (products) => {
        return (
            <>
                <Modal isVisible={popup} animationIn='fadeIn' animationOut='fadeOut'
                       onBackdropPress={() => setPopup(false)}>

                    <View style={styles.popupContent}>
                        <Text style={styles.popupTitle}>{activeProduct.name}</Text>
                        {activeProduct.description !== "" ? <Text>{activeProduct.description}</Text> : noDesc}

                        <View style={[styles.flexRow, {padding: 20, marginTop: 10, alignSelf: 'stretch'}]}>
                            <Button small bordered rounded danger onPress={async () => {
                                await handleProductDelete(activeProduct.productId);
                                setPopup(false);
                            }}>
                                <Icon name='trash'></Icon>
                            </Button>
                            <Button small bordered rounded success onPress={() => {
                                setPopup(false);
                                navigation.navigate('Product form', activeProduct);
                            }}>
                                <Icon type='FontAwesome' name='edit'/>
                            </Button>
                        </View>

                    </View>
                </Modal>

                <FlatList
                    data={products}
                    renderItem={renderProducts}
                    keyExtractor={(item) => item.productId}/>

            </>
        );
    }

    const renderButtons = () => {
        return (
            <>
                {productsArray.length ?
                    <Button danger={!deleteMode} transparent disabled={apiInUse}
                            onPress={() => setDeleteMode((prev) => !prev)}>
                        {deleteMode ? <Icon type='FontAwesome5' name='glasses'/> : <Icon type='Ionicons' name='trash'/>}
                    </Button> : <></>}

                <Button transparent disabled={apiInUse} onPress={() => navigation.navigate('Product form')}>
                    <Icon name='add-circle'/>
                </Button>
            </>
        );
    }

    const handleSelect = (selectText) => {
        if (selectText === select) {
            // Select All
            setProductsToDelete(productsArray.map(p => p.productId));
        } else {
            // it is Unselect All
            setProductsToDelete([]);
        }
    }

    const handleBulkDelete = async () => {
        const resp = await AlertAsync(
            'Are you sure?',
            'Deleting the selected product(s) will remove them from any routine(s) they are currently in.',
            [
                {text: 'Yes', onPress: () => 'yes'},
                {text: 'No', onPress: () => Promise.resolve('no')}
            ],
            {cancelable: true, onDismiss: () => "no"}
        );

        if (resp === 'yes') {
            setApiUse(true);
            setLoad(false);
            setDeleteMode(false);

            productsApi.deleteMultipleProducts(productsToDelete, state.jwtToken)
                .then(resp => retrieveProducts())
                .catch(err => {
                    console.log(err);
                    retrieveProducts();
                    alert('Uh oh...something went wrong while deleting products...');
                });

            setApiUse(false);
        }
    }


    return (
        <Container>
            <Header>
                <Left>
                    <Button transparent disabled={apiInUse} onPress={() => navigation.navigate('home')}>
                        <Icon type='MaterialIcons' name='chevron-left'/>
                    </Button>
                </Left>
                <Body>
                    <Title>Products</Title>
                </Body>
                <Right>
                    {load ? renderButtons() : <></>}
                </Right>
            </Header>

            <Content padder>
                {load ?
                    productsArray ?
                        displayAllProducts(productsArray) :
                        <Text style={styles.centerText}>You have no products. Add some!</Text>
                    : <Spinner color='#000000'/>
                }
            </Content>

            {load && deleteMode && productsArray ?
                <Footer>
                    <FooterTab>
                        <Button onPress={() => handleSelect(select)} disabled={apiInUse}>
                            <Text>{select}</Text>
                        </Button>
                        <Button onPress={() => handleBulkDelete()} disabled={apiInUse || productsToDelete.length === 0}>
                            <Text>Delete</Text>
                        </Button>
                        <Button onPress={() => handleSelect(unselect)} disabled={apiInUse}>
                            <Text>{unselect}</Text>
                        </Button>
                    </FooterTab>
                </Footer> : <></>}

        </Container>
    );
}