import React from 'react'

import {
    Button,
    FlatList,
    Image,
    ImageBackground,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

const Item = ({item, onPress}) => (
    <TouchableOpacity style={styles.subView} onPress={() => {
        Linking.openURL('https://reddit.com' + item.link).then();
    }}>
        <Text style={styles.subTitle}>{item.title}</Text>
        <Text style={{fontWeight: "500"}}>{item.author}</Text>
        <Text>{item.description}</Text>


    </TouchableOpacity>
);

export default class Sub extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            category: "new",
            nbSubs: 0,
            subs: [],
        }
    }



    DATA = [];

    renderListItem({item}) {
        return(
            <Item style={styles.subView} item={item} />
        )
    }

    render() {
        return(
            <View style={styles.view} onTouchStart={ () => this.loadData().then()}>

                <Text style={styles.titleLabel}>{this.props.subName}</Text>

                <FlatList
                    onTouchStart={() => this.loadData(this.state.category)}
                    style={styles.UserPostsView}
                    scrollEnabled={true}
                    data={this.DATA}
                    renderItem={(item) => this.renderListItem(item)}
                    keyExtractor={(item) => item.id}
                />
            </View>
        )
    }

    async makeRequest(token, category) {
        if (token) {
            fetch("https://oauth.reddit.com/" + this.props.subName + "/" + category, {
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
                    this.setState({nbSubs: datas['data']['dist']});
                    this.DATA = [];

                    for (let i = 0; i < this.state.nbSubs; i++) {

                        if (datas['data']['children'][i.toString()]['data']['subscribers'] === 0)
                            continue;
                        this.state.subs.push(
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
            console.log("Erreur: Impossible de faire la requête.")
        }
    }

    async loadData() {
        await this.makeRequest(this.props.token, this.state.category);
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