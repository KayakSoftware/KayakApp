import React, { Component, useState, useEffect } from 'react'
import { Text, StyleSheet, View, TouchableHighlightBase } from 'react-native'
import { Gyroscope } from "expo-sensors";

export default class Gyro extends Component {
    constructor(props) {
        super(props)
        this.state = {
            samplingFrecency:1,
            accuracy: "",
            faking:false,
            data:{},
            gyroHandler: undefined
        }
    }

    startSampling() {
        console.log("gyro stat")
        if(Gyroscope.isAvailableAsync())
            this._subscribeUpdates();
    }

    stopSampling(){
        console.log("stop gyro")
        this._unsubscribeUpdates();
    }

    _subscribeUpdates() {
        var gyroHandler = Gyroscope.addListener(gyroData => {
            this.setState({data: gyroData})
            //console.log("gyro after:", this.state.data)
        })
        this.setState({gyroHandler:gyroHandler});
        if(this.props.subscribeUpdates)this.props.subscribeUpdates(this.state.data);
    }

    _unsubscribeUpdates() {
        if (this.state.gyroHandler)
        {
            Gyroscope.removeAllListeners();
            this.setState({gyroHandler:null})
        }
    }

    render() {
        return (
            <View>
            </View>
        )
    }
}

const styles = StyleSheet.create({})
