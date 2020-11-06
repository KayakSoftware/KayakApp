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
            interval: 5000,
            distanceInterval: 1,
            unsubscriptionHandler: undefined
        }
    }

    componentDidMount() {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
            }
      
            try {
                let location = await Location.getLastKnownPositionAsync({})
                this.setState({location: location})
                if(this.props.subscribeInitLocation)this.props.subscribeInitLocation(location)
            } catch(err) {
                console.error(err)
                if(this.props.subscribeInitLocation)this.props.subscribeInitLocation(undefined);
            }
        })();
    }

    startSampling() {
        if(this.state.unsubscriptionHandler)this.state.unsubscriptionHandler.remove()

        // Let the gps component determine the most appropriate, efficient and accurate way of sampling gps atm.
        Location.watchPositionAsync({
            accuracy: LocationAccuracy.High,
            timeInterval: this.state.interval,
            distanceInterval: this.state.distanceInterval,
            mayShowUserSettingsDialog: true
        }, (location) => {
                if(this.props.subscribeUpdates)this.props.subscribeUpdates(location);
        }
        ).then(unsubscribeHandler => {
            this.setState({unsubscriptionHandler: unsubscribeHandler})
        }).catch(err => console.error(err));
    }

    stopSampling() {
        console.log("gps stop")
        if(this.state.unsubscriptionHandler)this.state.unsubscriptionHandler.remove();
    }

    render = () => {
        return <View></View>
    };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GPS;