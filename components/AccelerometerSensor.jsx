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
        kayakLine: 0
      }
    }

    componentDidMount() {

      // Read 
      this._toggle();
    }

    componentWillUnmount() {
      this._unsubscribe();
    }

    _toggle = () => {
      if (this._subscription) {
        this._unsubscribe();
      } else {
        this._subscribe();
      }
    };

    _slow = () => {
      console.log("Do it slow")
      Accelerometer.setUpdateInterval(1000);
    };

    _fast = () => {
      console.log("Do it fast!")
      Accelerometer.setUpdateInterval(16);
    };

    _setSampleRatePrSecond = (samplesPrSecond) => {
      let sampleRate = 1000 / samplesPrSecond
      Accelerometer.setUpdateInterval(sampleRate)
    }

    _setRefreshSpeed = (refreshRate) => {
      Accelerometer.setUpdateInterval(refreshRate)
    }

    _subscribe = () => {
      this._subscription = Accelerometer.addListener(accelerometerData => {
        if(this.props.immitatingKayak) {
          if(this.state.kayakLine === file.data.length) {
            // reset counter to zero!
            let kayakData = file.data[0];
            this.setState({kayakLine: 1})
            if(this.props.verboseSensor)this.setState({data: {
              x: kayakData.xAxis,
              y: kayakData.yAxis,
              z: kayakData.zAxis
            }})
            if(this.props.subscribeSensorInput)this.props.subscribeSensorInput({
              x: kayakData.xAxis,
              y: kayakData.yAxis,
              z: kayakData.zAxis
            });
          } else {
            let kayakData = file.data[this.state.kayakLine]
            this.setState({kayakLine: this.state.kayakLine + 1})
            if(this.props.verboseSensor)this.setState({data: {
              x: kayakData.xAxis,
              y: kayakData.yAxis,
              z: kayakData.zAxis
            }})
            if(this.props.subscribeSensorInput)this.props.subscribeSensorInput({
              x: kayakData.xAxis,
              y: kayakData.yAxis,
              z: kayakData.zAxis
            });
          }
        } else {
          if(this.props.verboseSensor)this.setState({data: accelerometerData})
          if(this.props.subscribeSensorInput)this.props.subscribeSensorInput(accelerometerData);
        }
      });
    };

    _unsubscribe = () => {
      this._subscription && this._subscription.remove();
      this._subscription = null;
    };

    round(n) {
      if (!n) {
        return 0;
      }
    
      return Math.floor(n * 100) / 100;
    }

    render = () => {
        let { x, y, z } = this.state.data
        return (
            <View style={styles.sensor}>
              { this.props.verboseSensor 
              ? <Fragment>
                <Text style={styles.text}>Accelerometer: (in Gs where 1 G = 9.81 m s^-2)</Text>
                <Text style={styles.text}>
                  x: {this.round(x)} y: {this.round(y)} z: {this.round(z)}
                </Text>
              </Fragment>
              : null}
            </View>
          );
    }
}

export default Sensor;