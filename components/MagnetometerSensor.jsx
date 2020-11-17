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

    componentDidMount() {
        console.log("Mounting Magnetometer for sensing heading")
        if(this.props.headingMonitor) {
            // Start sampling
            this.startSampling();
            Magnetometer.setUpdateInterval(this.props.headingMonitor.monitorSampleRate)
        }
    }

    componentWillUnmount() {
        this._unsubscribeUpdates();
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
            if(this.props.headingMonitor)this.props.headingMonitor.attachUpdates(magneData);
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