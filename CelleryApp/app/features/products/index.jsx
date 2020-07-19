import React from 'react';
import {Container, Header, Body, Content, Button, Icon, Left, Right, Title, Accordion, Text, View} from 'native-base';

export function Products({navigation}) {
    // PLACEHOLDER DATA
    const dataArray = [
        {title: "First Element", content: "Lorem ipsum dolor sit amet"},
        {title: "Second Element", content: "Lorem ipsum dolor sit amet"},
        {title: "Third Element", content: "Lorem ipsum dolor sit amet"}
    ];

    const _renderContent = (item) => {
        return (
            <>
                <Text style={{padding: 10}}>{item.content}</Text>

                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
                    <Button small bordered rounded danger onPress={() => alert('Yeehaw')}>
                        <Icon name='trash'></Icon>
                    </Button>
                    <Button small bordered rounded success onPress={() => alert('Yeehaw')}>
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
                    <Button transparent onPress={() => navigation.navigate('home')}>
                        <Icon type='MaterialIcons' name='chevron-left'/>
                    </Button>
                </Left>
                <Body>
                    <Title>Products</Title>
                </Body>
                <Right>
                    <Button transparent onPress={() => alert('Yeehaw')}>
                        <Icon name='add-circle'/>
                    </Button>
                </Right>
            </Header>

            <Content padder>
                <Accordion
                    dataArray={dataArray}
                    renderContent={_renderContent}
                />
            </Content>

        </Container>
    );
}