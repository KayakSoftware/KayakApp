import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import MapView from 'react-native-maps';
import { Button } from 'react-native-paper';
import StopWatch from 'react-native-stopwatch-timer/lib/stopwatch';

const TrackingScreen = () => {

    return (
        <View style={{alignItems:"center", flex:1 }}>
            <View style={{padding: 30,backgroundColor:"#ffffff", height: 100, width:Dimensions.get('window').width, alignItems:"center", justifyContent: 'space-between', flexDirection: 'row', shadowColor: "#000", shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6}}>
                <View style={{backgroundColor: "red", display: "flex", width: "100%", flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center"}}>
                    <View style={{textAlign: "center"}}>
                        <Text style={{fontSize: 20, fontWeight: "300", textAlign: "center"}}>Distance:</Text>
                        <Text style={{textAlign: "center"}}>9.55 km</Text>
                    </View>
                    <View>
                        <Text style={{fontSize: 20, fontWeight: "300", textAlign: "center"}}>Duration</Text>
                        <StopWatch></StopWatch>
                    </View>
                    <View>
                        <Text style={{fontSize: 20, fontWeight: "300", textAlign: "center"}}>Activity:</Text>
                        <Text style={{textAlign: "center"}}>Land</Text>
                    </View>
                </View>
            </View>
            <View>
                <MapView style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height-150}}>

                </MapView>
                <Button style={{width:100, height:100}}>
                    Start Trip
                </Button>
            </View>
        </View>
    )
}

export default TrackingScreen
