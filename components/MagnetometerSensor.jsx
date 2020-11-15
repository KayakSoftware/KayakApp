import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Magnetometer } from "expo-sensors";

export default class MagnetometerSensor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            samplingFrecency:1,
            accuracy: "",
            faking:false,
            data:{},
            magHandler: undefined
        }
    }

    startSampling() {
        if(Magnetometer.isAvailableAsync())
            this._subscribeUpdates();
    }

    stopSampling(){
        this._unsubscribeUpdates();
    }

    _subscribeUpdates() {
        var magHandler = Magnetometer.addListener(magneData => {
            this.setState({data: magneData})
            if(this.props.subscribeUpdates)this.props.subscribeUpdates(magneData);
        })
        this.setState({magHandler:magHandler});
    }

    _unsubscribeUpdates() {
        if(this.state.magHandler)
        {
            Magnetometer.removeAllListeners();
            this.setState({magHandler:null})
        }
    }



    render() {
        return (
            <View>
                
            </View>
        )
    }
}