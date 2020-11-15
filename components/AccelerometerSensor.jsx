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

    numberOfObservations = 0;

    constructor(props) {
      super(props)
      this.state = {
        data: {},
        subscription: undefined,
        kayakLine: 0,
        slidingWindow: [],
        currentSampleRate: 60,
        isStill: false,
        wakeUpCallback: null
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
      this.setState({currentSampleRate: samplesPrSecond})
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
            this.emitData(this.readKayakData()); 
          } else {
            this.emitData(this.transformAccelerometerData(accelerometerData))
          } 
      });
      this.setState({subscription: subscription})
    };

    monitorWakeUp = (callback) => {
      this.setState({wakeUpCallback: callback});
    }

    monitorStill = (accelerations) => {
      // Caculate error boundaries
      let xAverage = 0;
      let yAverage = 0;
      let zAverage = 0;

      for(let i = 0; i < this.state.slidingWindow.length; i++) {
        xAverage += this.state.slidingWindow[i].x;
        yAverage += this.state.slidingWindow[i].y;
        zAverage += this.state.slidingWindow[i].z;
      }

      xAverage = xAverage / this.state.slidingWindow.length;
      yAverage = yAverage / this.state.slidingWindow.length;
      zAverage = zAverage / this.state.slidingWindow.length;

      let xVarians = accelerations.x - xAverage;
      let yVarians = accelerations.y - yAverage;
      let zVarians = accelerations.z - zAverage;

      if(Math.abs(xVarians) < 0.1 && Math.abs(yVarians) < 0.1 && Math.abs(zVarians) < 0.1) {
        if(!this.state.isStill) {
          this.setState({isStill: true})
        }
        if(this.props.subscribeIsStill)this.props.subscribeIsStill(true);
      } else {
        if(this.state.isStill) {
          this.setState({isStill: false})
          if(this.state.wakeUpCallback !== null) {
            setTimeout(() =>{
              this.state.wakeUpCallback("monitorStill");
              this.setState({wakeUpCallback: null})
            }, 100)
          }
        }
        if(this.props.subscribeIsStill)this.props.subscribeIsStill(false);
      }
    }

    emitData = (accelerations) => {

      const slidingWindowSize = this.state.currentSampleRate * 5;
      this.numberOfObservations++;

      // If we are at the maximum shift and push to the array
      if(this.state.slidingWindow.length === slidingWindowSize) {
        if(this.numberOfObservations % (Math.floor(this.state.currentSampleRate / 2) + 1) === 0) {
          this.monitorStill(accelerations);
        }

        this.state.slidingWindow.shift()
      }
      this.state.slidingWindow.push(accelerations);

      // If the sampleRate changed, update maximum slidingWindowSize
      if(slidingWindowSize < this.state.slidingWindow.length) {
        const cutOff = this.state.slidingWindow.length - slidingWindowSize + 1;
        const newWindow = this.state.slidingWindow.slice(0, cutOff);
        this.setState({slidingWindow: newWindow})
      }
      // Emit updates!
      if(this.props.subscribeUpdates)this.props.subscribeUpdates(accelerations);
    }

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