import React from "react";
import { View, Text } from "react-native";
import { Button } from 'react-native-paper';

const TripScreen = () => {

    const render = () => {
        return <View>
            <Button style={{width: "50%", marginTop: "5%"}} mode="contained">
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