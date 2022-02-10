import React from 'react'
import Authentification from "./Authentification";

import View from "react-native"

export default class AppCore extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            connected : false,
        }
    }

    render() {
        return(
            <View>

            </View>
        )
    }
}