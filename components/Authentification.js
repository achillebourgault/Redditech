import React , {useCallback, useState} from 'react';
import {Alert, Button, Modal, View} from "react-native";
import { WebView } from 'react-native-webview';
import {decode, encode} from 'base-64'
import Ionicons from "react-native-vector-icons/Ionicons";
import Home from "./Home";
import Profile from "./Profile";
import UserSettings from "./UserSettings";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Trends from "./Trends/Trends";
import Sub from "./Sub/Sub";

const Tab = createBottomTabNavigator();


let codeReceived = false;

export const configs = {
    reddit: {
        clientId: 'higTB_mJaqtIwucSAGcHFQ',
        clientSecret: 'LibdZtRfkNgeQZrf6Y1K3SODzppC5g',
        authorizationEndpoint: 'https://www.reddit.com/api/v1/authorize.compact' +
            '?client_id=higTB_mJaqtIwucSAGcHFQ' +
            '&response_type=code' +
            '&state=coucou' +
            '&redirect_uri=http://fredericlw.me/redditech/' +
            '&duration=permanent' +
            '&scope=identity mysubreddits account read',
        tokenEndpoint: 'https://www.reddit.com/api/v1/access_token',
        accessToken: '',
        refreshToken: ''
    }
};

export default class Authentification extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: true
        }
    }

    getToken (webViewState, newNavState) {
        let url = webViewState.url;
        if (url.startsWith('http://fredericlw.me/redditech/') && !codeReceived) {
            console.log(url);
            url = url.substr(50);
        } else {
            return '';
        }
        let authCode = url.substr(0, url.length - 2);
        console.log(authCode)
        codeReceived = true;
        let details = {
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: 'http://fredericlw.me/redditech/'
        };
        let formBody = [];
        for (let property in details) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        const toEncode = configs.reddit.clientId + ':' + configs.reddit.clientSecret;
        const basicAuth = 'Basic ' + encode(toEncode);
        fetch(configs.reddit.tokenEndpoint, {
            method: 'POST',
            headers: {
                'X-User-Agent' : 'reddi / 1.0.0 comment',
                'Authorization': basicAuth,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        }).then((reply) => reply.json())
            .then((json) => {
                console.log(json)
                configs.reddit.accessToken = json['access_token'];
                configs.reddit.refreshToken = json['refresh_token'];
                console.log(configs.reddit.accessToken)
            })
            .catch((error) => {
                console.error(error);
            })
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <View style={{flex:1}}>
                <Modal visible = {this.state.visible} onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
                    <Button title={"Revenir à REDDITECH"}
                            onPress={() => {
                        if (configs.reddit.accessToken != "") {
                            this.setState({visible: false});
                            {this.props.onConnect(configs.reddit.accessToken)}
                        } else {
                            Alert.alert(
                                "Veuillez autoriser l'application pour continuer."
                            )
                        }
                    }
                    }></Button>
                    <WebView
                        id={"authentification"}
                        bounces={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        javaScriptEnabled={true}
                        originWhitelist={['*']}
                        mixedContentMode={'never'}
                        startInLoadingState={true}
                        javaScriptEnabledAndroid={true}
                        source={{ uri: configs.reddit.authorizationEndpoint }}
                        onNavigationStateChange={(webViewState)=> {
                            this.getToken(webViewState)
                        }}
                    />
                </Modal>

            </View>
        );
    }

}