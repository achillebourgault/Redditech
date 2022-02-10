import React from 'react'
import {
    Button,
    FlatList,
    Image,
    ImageBackground,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

const Item = ({item, onPress, instance} ) => (
    <View style={styles.subView}>
        <Text style={{fontSize: 19, fontWeight: "300", marginBottom: 4}}>{item.title}</Text>
        <Text style={{marginBottom: 16}}>{item.description}</Text>
        <View style={{width: 120, height: 35, margin: 2, marginBottom: 10}}>
            {item.isSubscribe ?
                <Button title={"Unsubscribe"} color={"#a83242"} onPress={() => {
                    instance.changeSubscribeStatus(instance.props.token, "unsub", item.id).then()}
                }/> :
                <Button title={"Subscribe"} color={"#FF4B3E"} onPress={() => {
                    instance.changeSubscribeStatus(instance.props.token, "unsub", item.id).then()}
                }/>
            }
        </View>
        <Text><Text style={{fontWeight: "500"}}>{item.subscribers}</Text> Followers</Text>
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

const SearchSubInput = ({instance}) => {
    const [query, onChangeQuery] = React.useState(null);
    return(
        <>
            <TextInput
                style={{backgroundColor: "#fff", margin: 8}}
                placeholder={"Search here"}
                value={query}
                onChangeText={onChangeQuery}
                onTextInput={() => {
                    instance.setState({query: query}, () => {
                    });
                    instance.loadDataAll().then();
                }}
            />
        </>
    )
}

export default class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            nbResults: 0,
            detailed: ''
        }

        this.handleChange.bind(this);
        this.loadDataAll().then();
    }

    handleChange(event) {
        this.setState({
            query: event.target.value
        }, () => {
        });
    }

    DATA = [];

    render() {
        return(
            <>
                {
                    this.state.detailed != '' ? <></> :
                        <SearchSubInput instance={this} />
                }

                {
                    this.state.detailed != '' ?
                        <View style={{marginBottom: 25}}>
                            <Text style={{marginTop: 2, marginBottom: 12, fontSize: 23, fontWeight: "400", textAlign: "center"}}>
                                {this.state.detailed}
                            </Text>
                            <View style={{marginBottom: 30}}>
                                <Button color={'#FF4B3E'} title={"Back to search"} onPress={async () => {
                                    this.DATA = [];
                                    await this.setState({detailed: ''}, () => {
                                    });
                                    this.loadDataAll().then();
                                }}/>
                            </View>
                        </View> :
                        <></>
                }

                <>
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
            </>
        )


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
                <Item style={styles.subView} item={item} instance={this} />
            </Pressable>
        )
    }

    renderListItemDetailled({item}) {
        return(
            <ItemDetailled style={styles.subView} item={item} />
        )
    }

    async changeSubscribeStatus(token, action, subName) {
        await fetch("https://oauth.reddit.com/api/v1/subscribe", {
            method: "POST",
            body: {
                "action": action,
                "sr_name": subName
            },
            headers: {
                'X-User-Agent' : 'reddi / 1.0.0 comment',
                'Authorization': 'bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then();
    }

    async makeRequestAll(token, query) {
        if (!query || query == '') {
            this.DATA = [];
            return;
        }
        if (token) {
            fetch("https://oauth.reddit.com/subreddits/search.json?q=" + query + "&show_users=false&limit=10", {
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
                                isSubscribe: datas['data']['children'][i.toString()]['data']['user_is_subscriber'],
                            }
                        )
                        this.setState({nbResults: datas['data']['dist']})
                    }

                }).then();
        } else {
            console.log("Erreur: Impossible de faire la requête.")
        }
    }

    async loadDataAll() {
        await this.makeRequestAll(this.props.token, this.state.query);
    }

    async makeRequest(token, subUrl) {
        if (token) {
            fetch("https://oauth.reddit.com/" + subUrl + "?limit=15", {
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
                                headerImgLink: datas['data']['children'][i.toString()]['data']['icon_img'],
                            }
                        )
                    }
                    this.setState({nbSubs: datas['data']['dist']}, () => {
                    })

                }).then();
        } else {
            console.log("Erreur: Impossible de faire la requête Relancez l'app.")
        }
    }

    async loadData() {
        await this.makeRequest(this.props.token, this.state.detailed);
    }

}

const styles = StyleSheet.create({
    UserPostsView: {
        padding: 30,
        paddingTop: 2,
        position: "absolute",
        top: 70,
        right: 0,
        left: 0,
        bottom: 0,
        paddingLeft: 25,
        paddingRight: 25,
        height: 600,
    },
    subView: {
        backgroundColor: '#d7d7d7',
        margin: 27,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 12,
        marginBottom: 18,
        padding: 25,
        borderRadius: 8
    },
})