import React, { Component, useState, useEffect } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { Gyroscope, Magnetometer  } from "expo-sensors";

export default class Gyro extends Component {
    constructor(props) {
        super(props)
        this.state = {
            samplingFrecency:1,
            accuracy: "",
            faking:false,
            data:{}
        }
    }

    startSampling = () => {
        if(Gyroscope.isAvailableAsync)
            this._subscribeUpdates();
    }

    stopSampling = () => {
        this._unsubscribeUpdates();
    }

    _subscribeUpdates = () => {
        console.log(this.state.data);
        this._subscribeUpdates = Gyroscope.addListener(gyroData => {
            this.setState({data: gyroData})
        })
    }

    _unsubscribeUpdates = () => {
        this._unsubscribeUpdates = Gyroscope.removeAllListeners();
    }

    render() {
        return (
            <View>
                 <Text> x: {this.state.data} </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({})
