import React, { useState } from 'react'
import {View, Text, StyleSheet, ScrollView, Switch, Button} from 'react-native'

export default class UserSettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activity_relevant_ads: false,
            email_username_mention: false,
            email_post_reply: false,
            email_upvote_post: false,
            email_upvote_comment: false,
            email_comment_reply: false,
            email_private_message: false,
            enable_followers: false,
            profile_opt_out: false,
        }
        this.fetchUserPrefs(this.props.token).then();
        this.updateUserSettings = this.updateUserSettings.bind(this);
    }

    async fetchUserPrefs(token) {
        if (token) {
            fetch("https://oauth.reddit.com/api/v1/me/prefs", {
                method: "GET",
                headers: {
                    'X-User-Agent' : 'reddi / 1.0.0 comment',
                    'Authorization': 'bearer ' + token,
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => response.text())
                .then((reply) => {
                    const data = JSON.parse(reply);
                    this.setState({activity_relevant_ads: data['activity_relevant_ads']});
                    this.setState({email_username_mention: data['email_username_mention']});
                    this.setState({email_post_reply: data['email_post_reply']});
                    this.setState({email_upvote_post: data['email_upvote_post']});
                    this.setState({email_upvote_comment: data['email_upvote_comment']});
                    this.setState({email_comment_reply: data['email_comment_reply']});
                    this.setState({email_private_message: data['email_private_message']});
                    this.setState({enable_followers: data['enable_followers']});
                    this.setState({profile_opt_out: data['profile_opt_out']});

                })
        } else {
            console.log("Erreur: Impossible de faire la requête, le token est invalide.");
        }
    }

    async updateActivityRelevantAds() {
        const request = {
            method: 'PATCH',
            headers: {'Authorization': 'bearer ' + this.props.token,'Content-Type': 'application/json','X-User-Agent' : 'reddi / 1.0.0 comment'},
            body: JSON.stringify({"activity_relevant_ads": this.state.activity_relevant_ads})
        }
        const reply = await fetch("https://oauth.reddit.com/api/v1/me/prefs", request);
        const data = await reply.json()
    }

    async updateEmailUsernameMention() {
        const request = {
            method: 'PATCH',
            headers: {'Authorization': 'bearer ' + this.props.token,'Content-Type': 'application/json','X-User-Agent' : 'reddi / 1.0.0 comment'},
            body: JSON.stringify({"email_username_mention": this.state.email_username_mention})
        }
        const reply = await fetch("https://oauth.reddit.com/api/v1/me/prefs", request);
        const data = await reply.json()
    }

    async updateEmailPostReply() {
        const request = {
            method: 'PATCH',
            headers: {'Authorization': 'bearer ' + this.props.token,'Content-Type': 'application/json','X-User-Agent' : 'reddi / 1.0.0 comment'},
            body: JSON.stringify({"email_post_reply": this.state.email_post_reply})
        }
        const reply = await fetch("https://oauth.reddit.com/api/v1/me/prefs", request);
        const data = await reply.json()
    }

    async updateEmailUpvotePost() {
        const request = {
            method: 'PATCH',
            headers: {'Authorization': 'bearer ' + this.props.token,'Content-Type': 'application/json','X-User-Agent' : 'reddi / 1.0.0 comment'},
            body: JSON.stringify({"email_upvote_post": this.state.email_upvote_post})
        }
        const reply = await fetch("https://oauth.reddit.com/api/v1/me/prefs", request);
        const data = await reply.json()
    }

    async updateEmailUpvoteComment() {
        const request = {
            method: 'PATCH',
            headers: {'Authorization': 'bearer ' + this.props.token,'Content-Type': 'application/json','X-User-Agent' : 'reddi / 1.0.0 comment'},
            body: JSON.stringify({"email_upvote_comment": this.state.email_upvote_comment})
        }
        const reply = await fetch("https://oauth.reddit.com/api/v1/me/prefs", request);
        const data = await reply.json()
    }

    async updateEmailCommentReply() {
        const request = {
            method: 'PATCH',
            headers: {'Authorization': 'bearer ' + this.props.token,'Content-Type': 'application/json','X-User-Agent' : 'reddi / 1.0.0 comment'},
            body: JSON.stringify({"email_comment_reply": this.state.email_comment_reply})
        }
        const reply = await fetch("https://oauth.reddit.com/api/v1/me/prefs", request);
        const data = await reply.json()
    }

    async updateEmailPrivateMessage() {
        const request = {
            method: 'PATCH',
            headers: {'Authorization': 'bearer ' + this.props.token,'Content-Type': 'application/json','X-User-Agent' : 'reddi / 1.0.0 comment'},
            body: JSON.stringify({"email_private_message": this.state.email_private_message})
        }
        const reply = await fetch("https://oauth.reddit.com/api/v1/me/prefs", request);
        const data = await reply.json()
    }

    async updateEnableFollowers() {
        const request = {
            method: 'PATCH',
            headers: {'Authorization': 'bearer ' + this.props.token,'Content-Type': 'application/json','X-User-Agent' : 'reddi / 1.0.0 comment'},
            body: JSON.stringify({"enable_followers": this.state.enable_followers})
        }
        const reply = await fetch("https://oauth.reddit.com/api/v1/me/prefs", request);
        const data = await reply.json()
    }

    async updateProfileOptOut() {
        const request = {
            method: 'PATCH',
            headers: {'Authorization': 'bearer ' + this.props.token,'Content-Type': 'application/json','X-User-Agent' : 'reddi / 1.0.0 comment'},
            body: JSON.stringify({"profile_opt_out": this.state.profile_opt_out})
        }
        const reply = await fetch("https://oauth.reddit.com/api/v1/me/prefs", request);
        const data = await reply.json();
    }

    async updateUserSettings() {
        await this.updateActivityRelevantAds();
        await this.updateEmailUsernameMention();
        await this.updateEmailPostReply();
        await this.updateEmailUpvotePost();
        await this.updateEmailUpvoteComment();
        await this.updateEmailCommentReply();
        await this.updateEmailPrivateMessage();
        await this.updateEnableFollowers();
        await this.updateProfileOptOut();
    }

    render() {
        return (
            <View>
                <ScrollView style={{marginBottom: 50}}>
                    <>
                        <Text style={styles.label}>Personalize ads based on your activity with our partners</Text>
                        <Switch
                            style={styles.switch}
                            onTintColor={"#fff"}
                            thumbColor={'#FF4B3E'}
                            value={this.state.activity_relevant_ads}
                            onValueChange={(activity_relevant_ads)=>this.setState({activity_relevant_ads})}
                        />
                    </>
                    <>
                        <Text style={styles.label}>Send an email each time your username is mentioned</Text>
                        <Switch
                            style={styles.switch}
                            onTintColor={"#fff"}
                            thumbColor={'#FF4B3E'}
                            value={this.state.email_username_mention}
                            onValueChange={(email_username_mention)=>this.setState({email_username_mention})}
                        />
                    </>
                    <>
                        <Text style={styles.label}>Send an email each you get a reply on a post</Text>
                        <Switch
                            style={styles.switch}
                            onTintColor={"#fff"}
                            thumbColor={'#FF4B3E'}
                            value={this.state.email_post_reply}
                            onValueChange={(email_post_reply)=>this.setState({email_post_reply})}
                        />
                    </>
                    <>
                        <Text style={styles.label}>Send an email each you get a reply on a comment</Text>
                        <Switch
                            onTintColor={"#fff"}
                            thumbColor={'#FF4B3E'}
                            value={this.state.email_comment_reply}
                            onValueChange={(email_comment_reply)=>this.setState({email_comment_reply})}
                        />
                    </>
                    <>
                        <Text style={styles.label}>Send an email each you get an upvote on a post</Text>
                        <Switch
                            style={styles.switch}
                            onTintColor={"#fff"}
                            thumbColor={'#FF4B3E'}
                            value={this.state.email_upvote_post}
                            onValueChange={(email_upvote_post)=>this.setState({email_upvote_post})}
                        />
                    </>
                    <>
                        <Text style={styles.label}>Send an email each you get an upvote on a comment</Text>
                        <Switch
                            onTintColor={"#fff"}
                            thumbColor={'#FF4B3E'}
                            value={this.state.email_upvote_comment}
                            onValueChange={(email_upvote_comment)=>this.setState({email_upvote_comment})}
                        />
                    </>
                    <>
                        <Text style={styles.label}>Send an email each you receive a private message</Text>
                        <Switch
                            style={styles.switch}
                            onTintColor={"#fff"}
                            thumbColor={'#FF4B3E'}
                            value={this.state.email_private_message}
                            onValueChange={(email_private_message)=>this.setState({email_private_message})}
                        />
                    </>
                    <>
                        <Text style={styles.label}>Allow people to follow you</Text>
                        <Switch
                            style={styles.switch}
                            onTintColor={"#fff"}
                            thumbColor={'#FF4B3E'}
                            value={this.state.enable_followers}
                            onValueChange={(enable_followers)=>this.setState({enable_followers})}
                        />
                    </>
                    <>
                        <Text style={styles.label}>Display your posts on r/all</Text>
                        <Switch
                            style={styles.switch}
                            onTintColor={"#fff"}
                            thumbColor={'#FF4B3E'}
                            value={this.state.profile_opt_out}
                            onValueChange={(profile_opt_out)=>this.setState({profile_opt_out})}
                        />
                    </>
                    <Button
                        color={'#FF4B3E'}
                        style={styles.submitBtn}
                        title={"Save settings"}
                        onPress={this.updateUserSettings}
                    />
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    view: {
        margin: 15
    },
    submitBtn: {
        margin: 20,
        marginTop: 60
    },
    switch: {
        flex: 1,
        margin: 8,
    },
    label: {
        flex: 1,
        width: 300,
        margin: 12,
        marginTop: 8,
        fontWeight: "500"
    }
})