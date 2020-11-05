import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import MapView from 'react-native-maps';
import { Button } from 'react-native-paper';

const TrackingScreen = () => {
    return (
        <View style={{alignItems:"center", flex:1 }}>
            <View style={{padding:50,backgroundColor:"#87fdff", height: 150, width:Dimensions.get('window').width, alignItems:"center", justifyContent: 'space-between', flexDirection: 'row'}}>
                <View>
                    <Text>Distance:</Text>
                    <Text>9,55 km</Text>
                </View>
                <View>
                    <Text>Time:</Text>
                    <Text>1.00,00</Text>
                </View>
                <View>
                    <Text>Activity:</Text>
                    <Text>Land</Text>
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
