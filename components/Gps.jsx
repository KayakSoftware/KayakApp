import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { LocationAccuracy } from 'expo-location';
import { idText } from 'typescript';

class GPS extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            location: null,
            errorMsg: null,
            interval: undefined
        }
    }

    componentDidMount() {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
            }
      
            let location = await Location.getCurrentPositionAsync({});
            this.setState({location: location})
          })();

          this.setSamplingFrequency(this.props.initialSamplingFrequency);
    }

    setSamplingFrequency = (frequencyInMillis) => {
        if(this.state.interval)clearInterval(this.state.interval);

        let interval = setInterval(() => {
            this.sample();
        }, frequencyInMillis)
        this.setState({interval: interval});
    }

    sample = async () => {
        if(this.props.subscribeSensorInput){
            let location = await Location.getCurrentPositionAsync({})
            this.setState({location: location})
            this.props.subscribeSensorInput(location);
        }
    }
    
    // Accuracy
    // Last known position or current?

    render = () => {
        return <View style={styles.container}>
            {this.state.location
            ? <Text style={{textAlign: "center"}}>Longitude: {this.state.location.coords.longitude}, Latitude: {this.state.location.coords.latitude}, </Text>
            : <Text style={{textAlign: "center"}}>Retreiving location...</Text>}
        </View>
    };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GPS;