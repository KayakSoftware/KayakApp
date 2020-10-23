import React from "react";
import Service from '../Services/tripService'
import { View, Text } from "react-native";
import { Button } from 'react-native-paper';

const TripScreen = () => {
    const getTrips = async () => {
        let result = await Service.getTrips();
        console.log(result);

    }
    const render = () => {
        return <View>
            <Button style={{width: "50%", marginTop: "5%"}} mode="contained" onPress={getTrips}>
                Start Trip!
            </Button>
            <Button style={{width: "50%", marginTop: "5%"}} mode="contained">
                Immitate kayak data
            </Button>
        </View>
    }

    return render();
}

export default TripScreen;