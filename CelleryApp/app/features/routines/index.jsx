import React from 'react';
import {Container, Header, Body, Button, Icon, Left, Right, Segment, Text} from 'native-base';
import {useAuth} from "../../providers/authProvider";


export function Routines({navigation}) {
    const {state} = useAuth();

    return (
        <Container>
            <Header hasSegment>
                <Left>
                    <Button transparent onPress={() => navigation.navigate('home')}>
                        <Icon type='MaterialIcons' name='chevron-left'/>
                    </Button>
                </Left>
                <Body>
                    <Segment>
                        <Button first active>
                            <Icon type='FontAwesome' name='sun-o' />
                        </Button>
                        <Button last>
                            <Icon type='FontAwesome' name='moon-o' />
                        </Button>
                    </Segment>
                </Body>
                <Right>
                    <Button transparent onPress={() => alert('Yeehaw')}>
                        <Icon name='add-circle' />
                    </Button>
                    <Button transparent>
                        <Icon type='FontAwesome' name='edit' />
                    </Button>
                </Right>
            </Header>

            <Body>
                <Text>Depending on which button clicked, show the proper routine, default is AM routine</Text>
            </Body>
        </Container>
    );
}