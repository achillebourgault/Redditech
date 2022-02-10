import React from 'react'

import {Image, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native'
import UserSubReddits from "./Home/UserSubReddits";
import {nav} from "../App";


export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: 'n/a',
            userCoins: 0,
            userKarma: 0
        }
        this.loadDataMe().then();
    }

    render() {

        const { navigate } = nav.navigation;

        return(
            <SafeAreaView style={styles.view} onTouchStart={ () => this.loadDataMe()}>

                <Text style={styles.titleLabel}>Welcome <Text style={{fontWeight: "bold"}}>{this.state.userName}</Text> !</Text>

                <View style={styles.widgetView}>
                    <View style={styles.pan_col}>
                        <Text style={styles.pan_title}>Coins</Text>
                        <Text style={styles.pan_desc}>{this.state.userCoins}</Text>
                    </View>
                    <View style={styles.pan_col}>
                        <Text style={styles.pan_title}>Karma</Text>
                        <Text style={styles.pan_desc}>{this.state.userKarma}</Text>
                    </View>
                </View>
                <UserSubReddits token={ this.props.token} navigation={navigate}>

                </UserSubReddits>
            </SafeAreaView>
        )
    }

    async makeRequestMe(token) {
        if (token) {
            if (this.state.userName != 'n/a')
                return;
            fetch("https://oauth.reddit.com/api/v1/me", {
                method: "GET",
                headers: {
                    'X-User-Agent' : 'reddi / 1.0.0 comment',
                    'Authorization': 'bearer ' + token,
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => response.text())
                .then((quote) => {
                    const datas = JSON.parse(quote);
                    this.setState({userName: datas['name']});
                    this.setState({userCoins: datas['coins']});
                    this.setState({userKarma: datas['total_karma']});
                }).then();
        } else {
            console.log("Erreur: Impossible de faire la requête.")
        }
    }

    async loadDataMe() {
        await this.makeRequestMe(this.props.token);
    }

}

const styles = StyleSheet.create({
    view: {

    },
    pan: {
        margin: 5,
        marginTop: 15,
        padding: 15,
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 12,
        backgroundColor: '#fff',
        marginBottom: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    widgetView: {
        margin: 34,
        marginTop: 0,
        marginBottom: 30,
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 0,
        height: 185,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    subView: {
        backgroundColor: '#F0F0F0',
        margin: 27,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 2,
        marginBottom: 18,
        padding: 25,
        borderRadius: 8
    },
    AllPostsView: {
        padding: 30,
        paddingTop: 6,
        paddingLeft: 25,
        paddingRight: 25,
        backgroundColor: '#E55934',
        paddingBottom: 50,
        marginBottom: 0,
        height: 600
    },
    pan_col: {
        margin: 20,
        marginBottom: 5,
        alignItems: 'center',

    },
    pan_title: {
        margin: 15,
        fontSize: 25,
        fontWeight: "bold"
    },
    pan_desc: {
        margin: 20,
        color: '#E55934',
        fontSize: 57,
    },
    titleLabel: {
        margin: 20,
        fontSize: 27
    }
})