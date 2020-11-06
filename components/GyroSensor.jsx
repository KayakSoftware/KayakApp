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
        
        if(Gyroscope.isAvailableAsync())
            this.setSampleRatePrSecond(60)
            this.subscribeUpdates();
    }

    stopSampling(){
        this.unsubscribeUpdates();
    }

    setSampleRatePrSecond = (samplesPrSecond) => {
        let sampleRate = 1000 / samplesPrSecond
        Gyroscope.setUpdateInterval(sampleRate)
      }

    subscribeUpdates() {
        var gyroHandler = Gyroscope.addListener(gyroData => {
            this.setState({data: gyroData})
            if(this.props.subscribeUpdates)this.props.subscribeUpdates(this.state.data);
        })
        this.setState({gyroHandler:gyroHandler});
    }

    unsubscribeUpdates() {
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
