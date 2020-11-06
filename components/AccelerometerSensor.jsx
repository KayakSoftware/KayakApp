import React, { Fragment, useEffect, useState } from "react";
import { EventSubscription, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Accelerometer, ThreeAxisMeasurement } from "expo-sensors"
import file from "./527-8-kopi.json";

const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'stretch',
      marginTop: 15,
    },
    button: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#eee',
      padding: 10,
    },
    middleButton: {
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: '#ccc',
    },
    sensor: {
      marginTop: 45,
      paddingHorizontal: 10,
    },
    text: {
      textAlign: 'center',
    },
  });

class Sensor extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        data: {},
        subscription: undefined,
        kayakLine: 0
      }
    }

    componentWillUnmount() {
      this.unsubscribe
    }

    startSampling() {
      this.setSampleRatePrSecond(60)
      this.subscribe()
    }

    stopSampling() {
      this.unsubscribe()
    }

    setSampleRatePrSecond = (samplesPrSecond) => {
      let sampleRate = 1000 / samplesPrSecond
      Accelerometer.setUpdateInterval(sampleRate)
    }

    readKayakData = () => {
      if(this.state.kayakLine === file.data.length) {
        // reset counter to zero!
        let kayakData = file.data[0];
        this.setState({kayakLine: 1})
        return {
          x: kayakData.xAxis,
          y: kayakData.yAxis,
          z: kayakData.zAxis
        }
      } else {
        let kayakData = file.data[this.state.kayakLine]
        this.setState({kayakLine: this.state.kayakLine + 1})
        return {
          x: kayakData.xAxis,
          y: kayakData.yAxis,
          z: kayakData.zAxis
        }
      }
    }

    subscribe = () => {
      this.unsubscribe();

      const subscription = Accelerometer.addListener(accelerometerData => {
          if(this.props.immitateKayak) {
            if(this.props.subscribeUpdates)this.props.subscribeUpdates(this.readKayakData()); 
          } else {
            if(this.props.subscribeUpdates)this.props.subscribeUpdates(this.transformAccelerometerData(accelerometerData)); 
          } 
      });
      this.setState({subscription: subscription})
    };

    transformAccelerometerData = (data) => {
      return {
        x: data.x * 9.82,
        y: data.y * 9.82,
        z: data.z * 9.82
      }
    }

    unsubscribe = () => {
      this.state.subscription && this.state.subscription.remove();
      this.setState({subscription: null})
    };

    render = () => {
        return (
            <View>
            </View>
          );
    }
}

export default Sensor;