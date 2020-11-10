import React, { useEffect, useState } from 'react'
import Service from '../Services/tripService'
import { View, Text, Dimensions, Pressable, TouchableOpacity} from 'react-native'
import MapView, {Polyline, Marker} from 'react-native-maps';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlayCircle, faTintSlash , faTint, faMountain, faQuestionCircle, faStopCircle, faStop, faShip, faWalking} from '@fortawesome/free-solid-svg-icons';
import StopWatch from "../components/Stopwatch";
import DistanceManager from '../components/DistanceManager';
import TripService from "../Services/tripService"
import GPS from '../components/Gps';
import Gyroscope from '../components/GyroSensor'
import Magnetometer from '../components/MagnetometerSensor';
import Accelerometer from "../components/AccelerometerSensor";
import { idText } from 'typescript';

const TrackingScreen = () => {

    const watch = React.createRef();
    const mapView = React.createRef();
    const gps = React.createRef();
    const accelerometer = React.createRef();
    const gyroscope = React.createRef();
    const magnetometer = React.createRef();
    
    // Simple state
    const useCustomMarker = true

    // Transient state
    const [tripID, setTripID] = useState();
    const [tracking, setTracking] = useState(false);
    const [region, setRegion] = useState()
    const [startTime, setStartTime] = useState()
    const [endTime, setEndTime] = useState()
    const [activity, setActivity] = useState(1)
    const [findInitLocation, setFindInitLocation] = useState();
    const [routeData, setRouteData] = useState([])
    const [requestUpdate, setRequestUpdate] = useState(0)
    const [lastKnownLocation, setLastKnownLocation] = useState(undefined)
    const [immitateKayak, setImmitateKayak] = useState(false);

    const [accelerometerBatch, setAccelerometerBatch] = useState([])

    const getActivityIcon = () => {
        switch (activity?.activity) {
            case 1:
                return faWalking;
            case 2:
                return faShip;
            default:
                return faQuestionCircle;
        }
    }

    const getActivityColor = () => {
        switch (activity?.activity) {
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
            setLastKnownLocation({latitude: location.coords.latitude, longitude: location.coords.longitude})
        } else {
            console.log("Undefined location")
        }
    }

    const onPress = async() => {
        if(!tracking) {
            let start = await TripService.createTrip();
            setTripID(start._id);
        } else {
            console.log("tripId:", tripID)
            let stop = await TripService.endTrip(tripID);
            console.log("stoptrip",stop);

        }
        setTracking(!tracking)
    }

    const smapling = () => {
        if(!tracking)
        {
            watch.current?.toggleStopwatch();
            gps.current?.startSampling();
            gyroscope.current?.startSampling();
            magnetometer.current?.startSampling();
            accelerometer.current?.startSampling();
        }
        else if(tracking)
        {
            watch.current?.toggleStopwatch();
            gps.current?.stopSampling();
            gyroscope.current?.stopSampling();
            magnetometer.current?.stopSampling();
            accelerometer.current?.stopSampling();
        }
    }

    const onLocationUpdate = (location) => {

        const o = {
            activity: "unknown",
            location: location
        }

        console.log(o)

        routeData.push(o)
        setLastKnownLocation({latitude: location.coords.latitude, longitude: location.coords.longitude});
        setRouteData([...routeData])
    }

    const onGyroUpdate = (angelVelocities) => {
        //console.log(angelVelocities)
    }

    const onMagUpdate = (magData) => {
        //console.log(magData)
    }

    const onAccelerationUpdate = (accelerations) => {

        //console.log(accelerations);
        accelerometerBatch.push({
            timestamp: new Date().getTime(),
            accelerations: accelerations
        });
        if(accelerometerBatch.length === 200) { 
            const requestData = accelerometerBatch;
            setAccelerometerBatch([]);
            predictActivity(requestData);
        }
    }

    const predictActivity = async (accelerometerData) => {
        
        console.log(routeData)

        var gps = routeData.filter(e => e.activity === "unknown")
        var result = await Service.updateTripActivity("nothing", {
            accelerometerData: accelerometerData,
            gpsData: gps
        });
        
        var highestConfidence = undefined;

        for(let i = 0; i < result.length; i++) {
            if(!highestConfidence) {
                highestConfidence = result[i]
                continue
            }

            if(parseFloat(highestConfidence.confidence) < parseFloat(result[i].confidence)) {
                highestConfidence = result[i]
            }
        }
        setActivity(highestConfidence)
        console.log(highestConfidence.activity)
        let endTime = accelerometerData[accelerometerData.length - 1].timestamp;

        console.log(endTime)

        // Update all gps coordinates of type unknown within the specific time interval;
        for(let i = 0; i < routeData.length; i++) {
            let data = routeData[i];
            if(data.activity === "unknown") {
                if(data.location.timestamp <= endTime) {
                    data.activity = highestConfidence.activity
                }
            }
        }
    }

    return (
        <View style={{alignItems:"center", flex:1 }}>
            <View style={{padding: 30,backgroundColor:"#ffffff", height: 100, width:Dimensions.get('window').width, alignItems:"center", justifyContent: 'space-between', flexDirection: 'row', shadowColor: "#000", shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6}}>
                <View style={{display: "flex", width: "100%", flexDirection: "row", justifyContent: "space-between", alignContent: "center", alignItems: "center"}}>
                    <View style={{textAlign: "center"}}>
                        <Text style={{fontSize: 20, fontWeight: "300", textAlign: "center"}}>Distance:</Text>
                        <View style={{paddingTop: 5}}>
                            <DistanceManager routeTrajectory={routeData}></DistanceManager>
                        </View>
                    </View>
                    <View>
                        <Text style={{fontSize: 20, fontWeight: "300", textAlign: "center"}}>Duration</Text>
                        <View style={{paddingTop: 5}}>
                            <StopWatch ref={watch}></StopWatch>
                        </View>
                    </View>
                    <View>
                        <Text style={{fontSize: 20, fontWeight: "300", textAlign: "center"}}>Activity: {activity ? activity.activity : null}</Text>
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
                showsUserLocation={!useCustomMarker}
                showsCompass={true}
                loadingEnabled={true}
                style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height - 165, zIndex:1, padding: 50}}>
                    { tracking ? <Polyline 
                    coordinates={routeData.map(ele => {
                        return {latitude: ele.location.coords.latitude, longitude: ele.location.coords.longitude}
                    })}
                    strokeColor="#000"
                    strokeWidth={2}
                    strokeColors={routeData.map(ele => {
                        return ele.activity === "unknown" ? "#000" :
                        ele.activity === "Walking" 
                        ? "#8b4513" : "blue"
                    })}
                    /> : null}
                    { useCustomMarker && lastKnownLocation ? <Marker coordinate={lastKnownLocation} image={require('../assets/blueDot.png')}/> : null}
                </MapView>
                {tracking 
                ? <TouchableOpacity activeOpacity={0.1} onPress={e => onPress(e)} style={{width:100,justifyContent:"center", alignSelf:"center", height:100, zIndex:2, bottom: 40, position:"absolute", borderRadius:"100%"}}>
                    <FontAwesomeIcon size={100} color={"#d10202"} icon={faStopCircle} />
                </TouchableOpacity>
                :<TouchableOpacity activeOpacity={0.1} onPress={(event) => onPress(event)} style={{width:100,justifyContent:"center", alignSelf:"center", height:100, zIndex:2, bottom: 40, position:"absolute", borderRadius:"100%"}}>
                    <FontAwesomeIcon size={100} color={"#18b500"} icon={faPlayCircle} />
                </TouchableOpacity>}
                {immitateKayak ?
                <TouchableOpacity activeOpacity={0.1} onPress={() => setImmitateKayak(!immitateKayak)} style={{width: 50,justifyContent:"left", height:50, zIndex:2, bottom: 0, right: 0, position:"absolute"}}>
                    <FontAwesomeIcon size={35} color={"#944a00"} icon={faTintSlash} />
                </TouchableOpacity>
                :<TouchableOpacity activeOpacity={0.1} onPress={() => setImmitateKayak(!immitateKayak)} style={{width: 50,justifyContent:"left", height:50, zIndex:2, bottom: 0, right: 0, position:"absolute"}}>
                    <FontAwesomeIcon size={30} color={"blue"} icon={faTint} />
                </TouchableOpacity>}
                
                <GPS ref={gps} subscribeUpdates={location => onLocationUpdate(location)} subscribeInitLocation={(location) => handleGpsInit(location)}></GPS>
                <Gyroscope ref={gyroscope} subscribeUpdates={angleVelocities => onGyroUpdate(angleVelocities)} />
                <Magnetometer ref={magnetometer} subscribeUpdates={magData => onMagUpdate(magData)} />
                <Accelerometer ref={accelerometer} immitateKayak={immitateKayak} subscribeUpdates={accelerations => onAccelerationUpdate(accelerations)}/>
            </View>
        </View>
    )
}

export default TrackingScreen;
