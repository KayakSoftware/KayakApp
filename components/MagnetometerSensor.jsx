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
        console.log("magne start")
        if(Magnetometer.isAvailableAsync())
            this._subscribeUpdates();
    }

    stopSampling(){
        console.log("magne un")
        this._unsubscribeUpdates();
    }

    _subscribeUpdates() {
        /*var magHandler = Magnetometer.addListener(magneData => {
            this.setState({data: magneData})
            //console.log("helle")
        })
        this.setState({magHandler:magHandler});
        if(this.props.subscribeUpdates)this.props.subscribeUpdates(this.state.data);*/
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