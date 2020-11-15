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
        if(this.props.subscribeBatteryUpdates)this.props.subscribeBatteryUpdates(BatteryLevel)
        this._subscription = Battery.addBatteryLevelListener(({batteryLevel}) => {
            this.setState({BatteryLevel: batteryLevel});
            if(this.props.subscribeBatteryUpdates)this.props.subscribeBatteryUpdates(batteryLevel)
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