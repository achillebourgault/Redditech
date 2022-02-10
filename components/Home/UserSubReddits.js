import React, {useState} from 'react'
import {
    Button,
    FlatList,
    ImageBackground, Linking, Pressable, ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity, View,
} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';


const HomeStack = createNativeStackNavigator();

const Item = ({item, onPress}) => (
  <View style={styles.subView}>
      <Text style={styles.subTitle}>r/{item.title}</Text>
      <Text>{item.description}</Text>
      <Text style={styles.subFollowers}><Text style={{fontWeight: "500"}}>{item.subscribers}</Text> Followers</Text>
      <ImageBackground
          source={{uri: (item.headerImgLink === '' ? 'https://external-preview.redd.it/_o7PutALILIg2poC9ed67vHQ68Cxx67UT6q7CFAhCs4.png?auto=webp&s=2560c01cc455c9dcbad0d869116c938060e43212' : item.headerImgLink)}}
          resizeMode="center"
          style={styles.image} />
  </View>
);

const ItemDetailled = ({item}) => (
    <View style={styles.subView}>
        <Text style={styles.subTitle}>{item.title}</Text>
        <Text style={{fontWeight: "500"}}>{item.author}</Text>
        <Text>{item.description}</Text>
        {item.headerImgLink != '' ? <ImageBackground
            source={{uri: item.headerImgLink}}
            resizeMode="center"
            style={styles.image} /> : <View />}
    </View>
);

export default class UserSubReddits extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nbSubs: -1,
            userSubs: [

            ],
            detailed: '',
            category: 'new',
            subName: 'r/Minecraft'
        }
        this.loadDataAll().then();
    }

    renderListItem({item}) {

        return(
            <Pressable onPress={async () => {
                if (this.state.detailed === '') {
                    await this.setState({detailed: item.urlSub}, () => {
                    });
                    this.loadData().then();
                }
            }}>
                <Item style={styles.subView} item={item} />
            </Pressable>
        )
    }

    renderListItemDetailled({item}) {
        return(
            <ItemDetailled style={styles.subView} item={item} />
        )
    }

    DATA = [];

    render() {

        return(
            <>
                <View>
                    {
                        this.state.detailed != '' ?
                            <>
                                <Text style={{marginTop: 0, marginBottom: 20, fontSize: 27, fontWeight: "500", textAlign: "center"}}>
                                    {this.state.detailed}
                                </Text>
                                <View style={{ marginLeft: 35, bottom: 15, marginRight: 35 }}>
                                    <Button color={'#FF4B3E'} title={"Back to subs"} onPress={async () => {
                                        await this.setState({detailed: ''}, () => {
                                        });
                                        this.loadDataAll().then();
                                    }}/>
                                </View>
                            </> :
                            <Text style={{marginTop: 0, marginBottom: 20, fontSize: 27, fontWeight: "500", textAlign: "center"}}>
                                Followed subs
                            </Text>
                    }
                </View>
                {this.state.detailed === '' ? <FlatList
                        style={styles.UserPostsView}
                        scrollEnabled={true}
                        data={this.DATA}
                        renderItem={(item) => this.renderListItem(item)}
                        keyExtractor={(item) => item.id}
                    /> :
                    <FlatList
                        style={styles.UserPostsView}
                        scrollEnabled={true}
                        data={this.DATA}
                        renderItem={(item) => this.renderListItemDetailled(item)}
                        keyExtractor={(item) => item.id}
                    />
                }

            </>

        )
    }

    async makeRequestAll(token) {
        if (token) {
            fetch("https://oauth.reddit.com/subreddits/mine/subscriber?limit=15", {
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

                    this.DATA = [];
                    for (let i = 0; i < datas['data']['dist']; i++) {
                        if (datas['data']['children'][i.toString()]['data']['subscribers'] === 0)
                            continue;
                        this.DATA.push(
                            {
                                id: datas['data']['children'][i.toString()]['data']['name'],
                                key: i,
                                urlSub: datas['data']['children'][i.toString()]['data']['display_name_prefixed'],
                                title: datas['data']['children'][i.toString()]['data']['title'],
                                link: datas['data']['children'][i.toString()]['data']['url'],
                                description: datas['data']['children'][i.toString()]['data']['public_description'],
                                subscribers: datas['data']['children'][i.toString()]['data']['subscribers'],
                                headerImgLink: datas['data']['children'][i.toString()]['data']['icon_img'],
                            }
                        )
                        this.setState({userSubs: this.state.userSubs})
                    }
                }).then();
        } else {
            console.log("Erreur: Impossible de faire la requête.")
        }
    }

    async loadDataAll() {
            await this.makeRequestAll(this.props.token);
             //this.create_button()
    }

    async makeRequest(token, category, subUrl) {
        if (token) {
            fetch("https://oauth.reddit.com/" + subUrl + "/" + category + "?limit=15", {
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
                    this.DATA = [];

                    for (let i = 0; i < datas['data']['dist']; i++) {

                        this.DATA.push(
                            {
                                id: datas['data']['children'][i.toString()]['data']['name'],
                                key: i,
                                title: datas['data']['children'][i.toString()]['data']['title'],
                                link: datas['data']['children'][i.toString()]['data']['url'],
                                description: datas['data']['children'][i.toString()]['data']['selftext'],
                                author: datas['data']['children'][i.toString()]['data']['author'],
                                headerImgLink: datas['data']['children'][i.toString()]['data']['thumbnail'],
                            }
                        )
                    }
                    this.setState({subs: this.state.subs})

                }).then();
        } else {
            console.log("Erreur: Impossible de faire la requête Relancez l'app.")
        }
    }

    async loadData() {
        await this.makeRequest(this.props.token, this.state.category, this.state.detailed);
    }

}

const styles = StyleSheet.create({
    subView: {
        backgroundColor: '#fff',
        margin: 27,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 12,
        marginBottom: 18,
        padding: 25,
        borderRadius: 8
    },
    barBtn: {
        backgroundColor: '#000',
        padding: 10,
        height: 90,
        color: '#fff',
        fontSize: 10,
        fontWeight: "700"
    },
    UserPostsView: {
        padding: 30,
        paddingTop: 6,
        marginTop: -2,
        paddingBottom: 6,
        paddingLeft: 25,
        paddingRight: 25,
        backgroundColor: '#d7d7d7',
        height: 400,
    },
    subTitle: {
        fontWeight: "bold",
        fontSize: 19,
        marginBottom: 6,
        opacity: 1,
    },
    image: {
        marginTop: 12,
        opacity: 0.8,
        height: 100,
        marginBottom: 40
    },
    subFollowers: {
        fontSize: 17,
        marginTop: 12
    },
    subUrl: {
        color: '#E55934',
        fontSize: 22,
        textAlign: 'center',
        margin: 12
    }
})