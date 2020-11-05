import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, Pressable } from 'react-native'
import MapView from 'react-native-maps';
import { Button, FAB } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import StopWatch from "../components/Stopwatch";


const TrackingScreen = () => {

    const watch = React.createRef();
    const [startTime, setStartTime] = useState()
    const [endTime, setEndTime] = useState()
    const [elapsedTime, setElapsedTime] = useState(0);

    return (
        <View style={{alignItems:"center", flex:1 }}>
            <View style={{padding: 30,backgroundColor:"#ffffff", height: 100, width:Dimensions.get('window').width, alignItems:"center", justifyContent: 'space-between', flexDirection: 'row', shadowColor: "#000", shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6}}>
                <View style={{display: "flex", width: "100%", flexDirection: "row", justifyContent: "space-between", alignContent: "center", alignItems: "center"}}>
                    <View style={{textAlign: "center"}}>
                        <Text style={{fontSize: 20, fontWeight: "300", textAlign: "center"}}>Distance</Text>
                        <Text style={{textAlign: "center"}}>9.55 km</Text>
                    </View>
                    <View>
                        <Text style={{fontSize: 20, fontWeight: "300", textAlign: "center"}}>Duration</Text>
                        <StopWatch ref={watch} ></StopWatch>
                    </View>
                    <View>
                        <Text style={{fontSize: 20, fontWeight: "300", textAlign: "center"}}>Activity</Text>
                        <Text style={{textAlign: "center"}}>Land</Text>
                    </View>
                </View>
            </View>
            <View>
                <MapView style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height-150, zIndex:1}}>

                </MapView>
                <Pressable onPress={console.log("Hello")} style={{width:100,justifyContent:"center", backgroundColor:"black", alignSelf:"center", height:100, zIndex:2, bottom: 66, position:"absolute", borderRadius:"100%"}}>
                    <FontAwesomeIcon size={100} color={"#18b500"} icon={faPlayCircle} />
                </Pressable>
            </View>
        </View>
    )
}

export default TrackingScreen
