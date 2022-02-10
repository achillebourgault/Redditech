import React from 'react'
import {
    Button,
    FlatList,
    ImageBackground, Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const Item = ({item, onPress}) => (
  <TouchableOpacity style={styles.subView} onPress={() => {
      Linking.openURL('https://reddit.com' + item.link).then();
  }}>
          <Text style={styles.subTitle}>r/{item.title}</Text>
          <Text>{item.description}</Text>
          <Text style={styles.subFollowers}><Text style={{fontWeight: "500"}}>{item.subscribers}</Text> Followers</Text>
      <ImageBackground source={{uri: (item.headerImgLink === '' ? 'https://external-preview.redd.it/_o7PutALILIg2poC9ed67vHQ68Cxx67UT6q7CFAhCs4.png?auto=webp&s=2560c01cc455c9dcbad0d869116c938060e43212' : item.headerImgLink)}}
                       resizeMode="center" style={styles.image}>
      </ImageBackground>
       </TouchableOpacity>
);

export default class SearchSubReddits extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: 'n/a',
            userDescription: 'n/a',
            userIconLink: 'https://external-preview.redd.it/_o7PutALILIg2poC9ed67vHQ68Cxx67UT6q7CFAhCs4.png?auto=webp&s=2560c01cc455c9dcbad0d869116c938060e43212',
            subsCpn: null,
            nbSubs: -1,
            category: 'popular',
            userSubs: [

            ]
        }
        this.loadData().then();
    }

    renderListItem({item}) {
        return(
            <Item style={styles.subView} item={item} />
        )
    }

    DATA = [];
    CATEGORY = "popular";

    async create_button() {
        let res = [];
        return res;
    }

    render() {

        return(
            <View>
                <Button color={'#FF4B3E'} styles={styles.barBtn} title={'Hype'} onPress={async() => {
                    await this.setState({category: 'popular'});
                    this.loadData().then();
                }}></Button>
                <Button color={'#FF4B3E'} styles={styles.barBtn} title={'New'} onPress={async() => {
                    await this.setState({category: 'new'});
                    this.loadData().then();
                }}></Button>
                <Button color={'#FF4B3E'} styles={styles.barBtn} title={'Random'}  onPress={async() => {
                    await this.setState({category: 'default'});
                    this.loadData().then();
                }}></Button>
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
            fetch("https://oauth.reddit.com/subreddits/" + category + "?limit=15", {
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
                        this.DATA.push(
                            {
                                id: datas['data']['children'][i.toString()]['data']['name'],
                                key: i,
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

    async loadData() {
            await this.makeRequest(this.props.token, this.state.category).then('done.');
    }

}

const styles = StyleSheet.create({
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
    UserPostsView: {
        padding: 30,
        paddingTop: 6,
        marginTop: 0,
        paddingBottom: 0,
        marginBottom: 65,
        paddingLeft: 25,
        paddingRight: 25,
        backgroundColor: '#fff',
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
    hotBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'

    },
    barBtn: {
        backgroundColor: '#000',
        padding: 10,
        height: 90,
        color: '#fff',
        fontSize: 10,
        fontWeight: "700"
    }
})