import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, Pressable, TouchableOpacity} from 'react-native'
import MapView, {Polyline} from 'react-native-maps';
import { Button, FAB,PaperProvider } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlayCircle, faCoffee , faWater, faMountain, faQuestionCircle, faStopCircle} from '@fortawesome/free-solid-svg-icons';
import StopWatch from "../components/Stopwatch";
import DistanceManager from '../components/DistanceManager';
import { render } from 'react-dom';
import GPS from '../components/Gps';
import Gyro from '../components/GyroSensor'

const TrackingScreen = () => {

    const watch = React.createRef();
    const mapView = React.createRef();
    const gps = React.createRef();
    const accelerometer = React.createRef();
    const gyroscope = React.createRef();
    const magnetometer = React.createRef();
    
    const [tracking, setTracking] = useState(false);
    const [region, setRegion] = useState()
    const [startTime, setStartTime] = useState()
    const [endTime, setEndTime] = useState()
    const [activity, setActivity] = useState(1)
    const [findInitLocation, setFindInitLocation] = useState();
    const [routeData, setRouteData] = useState([]) 
    const [requestUpdate, setRequestUpdate] = useState(0)


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

    
    
    const handleGpsInit = (location) => {
        if(location) {
            mapView.current?.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0252,
                longitudeDelta: 0.0081
            }, 2000)
        } else {
            console.log("Undefined location")
        }
    }

    const onPress = (event) => {
        if(!tracking) {
            watch.current?.toggleStopwatch();
            setTracking(!tracking);
            gps.current?.startSampling();
            gyroscope.current?.startSampling();
        }

        //console.log("on press")
        //console.log(gps.current)
        //console.log(gyroscope.current)

    }

    const onLongPress = (event) => {
        //console.log("OnLongPress")
        //console.log(gps.current)
        //console.log(gyroscope.current)

        if(tracking) {
            watch.current?.toggleStopwatch();
            setTracking(!tracking);
            gyroscope.current?.stopSampling();
            gps.current?.stopSampling();
        }
    }

    const onLocationUpdate = (location) => {
        routeData.push(location)
        setRouteData([...routeData])
    }

    const preprocessCoordinates = () => {
        return routeData.map(ele => {
            return {latitude: ele.coords.latitude, longitude: ele.coords.longitude}
        })
    }

    const onMovementUpdate = (movement) => {
        //console.log(movement)
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
                        <View style={{paddingTop: 5}}>
                            <StopWatch ref={watch}></StopWatch>
                        </View>
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
                <MapView
                region={region}
                ref={mapView}
                zoomEnabled={true}
                showsUserLocation={true}
                showsCompass={true}
                loadingEnabled={true}
                //onUserLocationChange={(location) => onLocationUpdate(location.nativeEvent.coordinate)}
                style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height - 165, zIndex:1, padding: 50}}>
                    { tracking ? <Polyline 
                    coordinates={preprocessCoordinates()}
                    strokeColor="#000"
                    strokeWidth={2}
                    /> : null}
                </MapView>
                <TouchableOpacity activeOpacity={0.1} onLongPress={(event) => onLongPress(event)} onPress={onPress} style={{width:100,justifyContent:"center", alignSelf:"center", height:100, zIndex:2, bottom: 40, position:"absolute", borderRadius:"100%"}}>
                    <FontAwesomeIcon size={100} color={tracking ? "#d10202": "#18b500"} icon={tracking ? faStopCircle: faPlayCircle} />
                </TouchableOpacity>
                <GPS ref={gps} subscribeUpdates={location => onLocationUpdate(location)} subscribeInitLocation={(location) => handleGpsInit(location)}></GPS>
                <Gyro ref={gyroscope} subscribeUpdates={movement => onMovementUpdate(movement)} />
            </View>
        </View>
    )
}

export default TrackingScreen;
