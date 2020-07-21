import React, { useRef } from 'react';
import {useAuth} from "../../providers/authProvider";
import {productsApi} from '../../api/index';
import AlertAsync from 'react-native-alert-async';
import {
    Body,
    Button,
    Container,
    Content,
    Header,
    Icon, Input, Item, Label,
    Left,
    Right,
    Text,
    Title,
    View
} from 'native-base';
import {Formik, useFormikContext} from "formik";
import * as Yup from "yup";
import {styles} from "../../styles";


export function ProductForm({route, navigation}) {
    const {state} = useAuth();
    const formRef = useRef(null);
    const {productId, name, description} = route.params;

    const productSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, 'Product name is too short!')
            .max(50, 'Product name is too long!')
            .required('Required'),
        description: Yup.string()
            .max(250, 'Description is too long (max 250 characters).')
    });

    const formData = {
        name: name,
        description: description
    };

    const handleBackButton = async () => {
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
            navigation.navigate('products');
        }
    };

    const handleSaveProduct = async (values, errs) => {
        if (!errs.name && !errs.description) {
            try {
                if (productId.length === 0) {
                    await productsApi.createProduct(values.name, values.description, state.jwtToken);
                } else {
                    await productsApi.editProduct(productId, values.name, values.description, state.jwtToken);
                }

                await AlertAsync(
                    'Yay!',
                    'Changes saved.',
                    [
                        {text: 'Ok', onPress: () => 'ok'},
                    ],
                    {cancelable: false, onDismiss: () => "ok"}
                );

                navigation.navigate('products');
            } catch (e) {
                alert('Uh oh, something went wrong trying to save your product...');
            }
        }
    };


    return (
        <Container>
            <Header>
                <Left>
                    <Button transparent onPress={() => handleBackButton()}>
                        <Icon type='MaterialIcons' name='chevron-left'/>
                    </Button>
                </Left>
                <Body>
                    <Title>{productId.length ? 'Edit Product' : 'Create Product'}</Title>
                </Body>
                <Right>
                    <Button transparent onPress={() => handleSaveProduct(formRef.current.values, formRef.current.errors)}>
                        <Text>Save</Text>
                    </Button>
                </Right>
            </Header>

            <Content>
                <Formik
                    innerRef={formRef}
                    initialValues={formData}
                    validationSchema={productSchema}
                    validateOnBlur={false}
                >
                    {({handleChange, handleBlur, values, errors, touched}) => (
                        <View style={styles.container}>

                            <View style={styles.inputContainer}>
                                <Item stackedLabel>
                                    <Label>Product name</Label>
                                    <Item style={{backgroundColor: '#D3D3D3'}}>
                                        <Input
                                            value={values.name}
                                            onChangeText={handleChange('name')}
                                        />
                                    </Item>
                                </Item>
                                {errors.name ? (<Text style={styles.textWarn}>{errors.name}</Text>) : null}

                                <Item stackedLabel>
                                    <Label>Product description</Label>
                                    <Item style={{backgroundColor: '#D3D3D3'}}>
                                        <Input
                                            multiline={true}
                                            value={values.description}
                                            onChangeText={handleChange('description')}
                                        />
                                    </Item>
                                </Item>
                                {errors.description ? (<Text style={styles.textWarn}>{errors.description}</Text>) : null}

                            </View>
                        </View>
                    )}
                </Formik>
            </Content>
        </Container>
    );
}