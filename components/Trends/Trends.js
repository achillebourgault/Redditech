import React from 'react'

import {Button, Image, ScrollView, StyleSheet, Text, View} from 'react-native'
import SearchSubReddits from "./SearchSubReddits";

export default class Trends extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: 'n/a',
            userfollowedSubs: 0,
            userCoins: 0,
            userKarma: 0,
            userCakeDay: '19/10/21'
        }
    }

    render() {
        return(
            <View style={styles.view} onTouchStart={ () => this.loadData().then()}>

                <Text style={styles.titleLabel}>Filter</Text>

                <SearchSubReddits token={ this.props.token}>
                </SearchSubReddits>

            </View>
        )
    }

    async makeRequest(token) {
        if (token) {
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

                    if (this.state.userName === 'n/a') {
                        this.setState({userName: datas['name']});
                        this.setState({userfollowedSubs: datas['subs']});
                        this.setState({userCoins: datas['coins']});
                        this.setState({userKarma: datas['total_karma']});
                    }
                    this.loadData();
                }).then();
        } else {
            console.log("Erreur: Impossible de faire la requête.")
        }
    }

    async loadData() {
        if (this.props.token != "" && this.state.userName === 'n/a') {
            await this.makeRequest(this.props.token);
        }
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
        fontSize: 27,
        textAlign: "center",
        fontWeight: 'bold'
    }
})