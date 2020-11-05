import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, Pressable } from 'react-native'
import MapView from 'react-native-maps';
import { Button, FAB,PaperProvider } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlayCircle, faCoffee , faWater, faMountain, faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
import StopWatch from "../components/Stopwatch";
import DistanceManager from '../components/DistanceManager';

const TrackingScreen = () => {

    const watch = React.createRef();
    const [startTime, setStartTime] = useState()
    const [endTime, setEndTime] = useState()
    const [activity, setActivity] = useState(1)

    const getActivityIcon = () => {
        switch (1) {
            case 1:
                return faMountain;
            case 2:
                return faWater;
            default:
                return faQuestionCircle;
        }
    }

    const getActivityColor = () => {
        switch (1) {
            case 1:
                return "#8B4513";
            case 2:
                return "blue";
            default:
                return "#000";
        }
    }

    return (
        <View style={{alignItems:"center", flex:1 }}>
            <View style={{padding: 30,backgroundColor:"#ffffff", height: 100, width:Dimensions.get('window').width, alignItems:"center", justifyContent: 'space-between', flexDirection: 'row', shadowColor: "#000", shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6}}>
                <View style={{display: "flex", width: "100%", flexDirection: "row", justifyContent: "space-between", alignContent: "center", alignItems: "center"}}>
                    <View style={{textAlign: "center"}}>
                        <Text style={{fontSize: 20, fontWeight: "300", textAlign: "center"}}>Distance</Text>
                        <View style={{paddingTop: 5}}>
                            <DistanceManager routeTrajectory={[]}></DistanceManager>
                        </View>
                    </View>
                    <View>
                        <Text style={{fontSize: 20, fontWeight: "300", textAlign: "center"}}>Duration</Text>
<<<<<<< HEAD
                        <StopWatch ref={watch} ></StopWatch>
=======
                        <View style={{paddingTop: 5}}>
                            <StopWatch ref={watch}></StopWatch>
                        </View>
>>>>>>> 54a5171b097b2d3398f56f365f154d4c3b999a1d
                    </View>
                    <View>
                        <Text style={{fontSize: 20, fontWeight: "300", textAlign: "center"}}>Activity</Text>
                        <View style={{width: "100%", alignItems: "center", paddingTop: 5}}>
                            <FontAwesomeIcon size={25} color={getActivityColor()} icon={getActivityIcon()} />
                        </View>
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
