import React from 'react';
import {
    Accordion,
    Body,
    Button,
    Container,
    Content,
    Header,
    Icon,
    Left,
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


export function Products({navigation}) {
    const {state} = useAuth();
    const [productsArray, setProductsArray] = React.useState([]);
    const [load, setLoad] = React.useState(false);

    // makes sure to fetch user's products when user enters the screen
    // (even if component has mounted)
    useFocusEffect(
        React.useCallback(() => {
            retrieveProducts();
            console.log('boom!');
        }, [])
    );

    const retrieveProducts = () => {
        productsApi.userProducts(state.jwtToken)
            .then(resp => {
                setProductsArray(resp.data);
                setLoad(true);
            })
            .catch(err => {
                alert('Uh oh...couldn\'t get your products'); // TODO: A diff way to deal with errors?
                setLoad(true);
            });
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
            productsApi.deleteProduct(productId, state.jwtToken)
                .then(resp => {
                    retrieveProducts();
                })
                .catch(err => {
                    console.log(err);
                    alert('Uh oh, something went wrong when trying to delete the product');
                });
        }

    }

    const _renderHeader = (item, expanded) => {
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
                    <Button small bordered rounded success onPress={() => {
                        navigation.navigate('Product form', item);
                        setLoad(false);
                    }}>
                        <Icon type='FontAwesome' name='edit'/>
                    </Button>
                </View>
            </>
        );
    }

    return (
        <Container>
            <Header>
                <Left>
                    <Button transparent onPress={() => {
                        navigation.navigate('home');
                        setLoad(false);
                    }}>
                        <Icon type='MaterialIcons' name='chevron-left'/>
                    </Button>
                </Left>
                <Body>
                    <Title>Products</Title>
                </Body>
                <Right>
                    <Button transparent onPress={() => {
                        navigation.navigate('Product form');
                        setLoad(false);
                    }}>
                        <Icon name='add-circle'/>
                    </Button>
                </Right>
            </Header>

            {load ?
                productsArray.length ? <Content padder>
                        <Accordion
                            dataArray={productsArray}
                            renderContent={_renderContent}
                            renderHeader={_renderHeader}
                        />
                    </Content> :
                    <Content padder>
                        <Text style={{textAlign: 'center'}}>You have no products. Add some!</Text>
                    </Content>
                : <Content>
                    <Spinner color='#000000'/>
                </Content>}


        </Container>
    );
}