import React, { Component } from 'react';
import * as Battery from 'expo-battery';
import { Text, View, StyleSheet } from 'react-native';

class BatteryState extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  
            BatteryLevel: undefined
        }
    }
   
    subscribe = async () => {
        const BatteryLevel = await Battery.getPowerStateAsync();
        this.setState({ BatteryLevel: BatteryLevel });
        this._subscription = Battery.addBatteryLevelListener(({BatteryLevel}) => {
            this.setState({BatteryLevel: BatteryLevel});
        })
    }

    unsubscribe = () => {
        this._subscription && this._subscription.remove();
        this._subscription = null;
    }

    render = () => {
        return <View></View>
    };


}
 
export default BatteryState;