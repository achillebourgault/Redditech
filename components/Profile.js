import React from 'react'
import {Image, Linking, ScrollView, StyleSheet, Text, View} from 'react-native';

export default class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: 'n/a',
            userDescription: 'n/a',
            userIconLink: 'https://external-preview.redd.it/_o7PutALILIg2poC9ed67vHQ68Cxx67UT6q7CFAhCs4.png?auto=webp&s=2560c01cc455c9dcbad0d869116c938060e43212'
        }
        this.loadData().then();
    }

    render() {
        return(
            <ScrollView onTouchStart={ () => this.loadData()}>
                <View style={styles.ProfileView} onTouchStart={() => {
                    Linking.openURL('https://reddit.com/u/' + this.state.userName).then();
                }}>
                    <Image source={{
                        uri: this.state.userIconLink,
                    }} style={styles.userIcon}></Image>
                    <Text style={styles.titleLabel}>{ "u/" + this.state.userName}</Text>
                    <Text style={{fontSize: 24}}>(<Text style={{color: '#E55934'}}>@{this.state.userName}</Text>)</Text>
                </View>

                <View style={styles.UserPostsView}>
                    <Text style={styles.pan_title}>Bio</Text>
                    <View style={styles.subView}>
                        <Text>{this.state.userDescription}</Text>
                    </View>
                </View>

            </ScrollView>

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
                        let iconImg = (datas['icon_img']).toString().substring(0, (datas['icon_img']).toString().indexOf('?'));

                        this.setState({userName: datas['name']});
                        this.setState({userDescription: datas['subreddit']['public_description']});
                        this.setState({userIconLink: iconImg});
                    }
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
    ProfileView: {
        margin: 34,
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16
    },
    subView: {
        backgroundColor: '#F0F0F0',
        margin: 7,
        marginTop: 10,
        padding: 15,
        borderRadius: 8
    },
    UserPostsView: {
        margin: 34,
        marginTop: -14,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16
    },
    pan_title: {
        fontSize: 16,
        textAlign: 'left',
        fontWeight: "bold"
    },
    titleLabel: {
        fontSize: 26,
        fontWeight: "bold"
    },
    userIcon: {
        borderRadius: 25,
        height: 70,
        width: 70
    },
    userDescription: {
        margin: 5,
        color: '#757575',
        fontSize: 17,
        textAlign: 'center'
    }
})