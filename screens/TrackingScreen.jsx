import React, { useEffect, useState } from 'react'
import Service from '../Services/tripService'
import { View, Text, Dimensions, Alert, TouchableOpacity} from 'react-native'
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
import SensorHandler from '../features/SensorHandler';

class TrackingScreen extends React.Component {

    watch = React.createRef();
    mapView = React.createRef();
    sensorHandler = React.createRef();
    
    // Simple state
    useCustomMarker = true
    accelerometerBatch = []

    constructor(props) {
        super(props);
        this.state = {
            navigation: props.navigation,
            tripId: undefined,
            tracking: false,
            region: undefined,
            activity: undefined,
            findInitLocation: undefined,
            routeData: [],
            lastKnownLocation: undefined,
            immitateKayak: false,
            batteryLevel: undefined,
            batchSize: 200
        }
    }

    componentDidMount() {
        this.state.navigation.addListener('beforeRemove', (e) => {
            const action = e.data.action;
            if (!this.state.tracking) {
              return;
            }
    
            e.preventDefault();
    
            Alert.alert(
              'Trip is running !',
              'You have to stop the tracking before leaving this screen',
              [
                { text: "Back", style: 'cancel', onPress: () => {} },
                /*{
                    text: 'End trip',
                    style: 'destructive',
                    onPress: () => {onPress() ,navigation.dispatch(action)},
                },*/
              ]
            );
        })
    }

    getActivityIcon = () => {
        switch (this.state.activity?.activity) {
            case "Walking":
                return faWalking;
            case "Sailing":
                return faShip;
            default:
                return faQuestionCircle;
        }
    }

    getActivityColor = () => {
        switch (this.state.activity?.activity) {
            case 1:
                return "#8B4513";
            case 2:
                return "blue";
            default:
                return "#000";
        }
    }
    
    handleGpsInit = (location) => {
        if(location) {
            this.mapView.current?.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0252,
                longitudeDelta: 0.0081
            }, 2000)
            this.setState({lastKnownLocation: {latitude: location.coords.latitude, longitude: location.coords.longitude}})
        } else {
            console.log("Undefined location")
        }
    }
    
    onPress = async (event) => {
        console.log("pressed")
        if(!this.state.tracking) {
            let start = await TripService.createTrip();
            if(start._id){
                this.accelerometerBatch = []
                this.setState({tripID: start._id, routeData: [], tracking: !this.state.tracking, activity: undefined})
                this.watch.current?.resetStopwatch();
                this.watch.current?.toggleStopwatch();
                this.sensorHandler.current?.startEnabledSensors();
            }
            else {
                alert("Tracking didn't start")
            }
        } else {
            let stop = await TripService.endTrip(this.state.tripID);
            if(stop) {
                this.watch.current?.toggleStopwatch();
                this.setState({tracking: !this.state.tracking})
                this.sensorHandler.current?.stopEnabledSensors();
            } else {
                alert("something went wrong! ")
            }
        }
    }

    onLocationUpdate = (location) => {

        const o = {
            activity: "unknown",
            location: location
        }

        this.state.routeData.push(o)
        this.setState({lastKnownLocation: {latitude: location.coords.latitude, longitude: location.coords.longitude}, routeData: [...this.state.routeData]});
    }

    onGyroUpdate = (angelVelocities) => {
        //console.log(angelVelocities)
    }

    onDirectionUpdate = (direction) => {
        //console.log(direction)
    }

    onAccelerationUpdate = (accelerations) => {
        
        this.accelerometerBatch.push({
            timestamp: new Date().getTime(),
            accelerations: accelerations
        });

        if(this.accelerometerBatch.length === 200) {
            const requestData = this.accelerometerBatch;
            this.accelerometerBatch = [];
            this.predictActivity(requestData);
        }
    }

    predictActivity = async (accelerometerData) => {

        var gps = this.state.routeData.filter(e => e.activity === "unknown")
        var result = await Service.updateTripActivity(this.state.tripID, {
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
        this.setState({activity: highestConfidence});
        let endTime = accelerometerData[accelerometerData.length - 1].timestamp;

        // Update all gps coordinates of type unknown within the specific time interval;
        for(let i = 0; i < this.state.routeData.length; i++) {
            let data = this.state.routeData[i];
            if(data.activity === "unknown") {
                if(data.location.timestamp <= endTime) {
                    data.activity = highestConfidence.activity
                }
            }
        }
    }

    onBatteryUpdate = (level) => {
        this.setState({batteryLevel: level})

        // Determine batch size based on batteryLevel and thus the battery spent here. Could also be the velocity.
        if(level >= 0.6) {
            this.setState({batchSize: 200})
        }
        if(level >= 0.2) {
            this.setState({batchSize: 400})
        }
        this.setState({batchSize: 800})
    }

    render = () => {
        return (
            <View style={{alignItems:"center", flex:1 }}>
                <View style={{padding: 30,backgroundColor:"#ffffff", height: 100, width:Dimensions.get('window').width, alignItems:"center", justifyContent: 'space-between', flexDirection: 'row', shadowColor: "#000", shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6}}>
                    <View style={{display: "flex", width: "100%", flexDirection: "row", justifyContent: "space-between", alignContent: "center", alignItems: "center"}}>
                        <View style={{textAlign: "center"}}>
                            <Text style={{fontSize: 20, fontWeight: "300", textAlign: "center"}}>Distance:</Text>
                            <View style={{paddingTop: 5}}>
                                <DistanceManager routeTrajectory={this.state.routeData}></DistanceManager>
                            </View>
                        </View>
                        <View>
                            <Text style={{fontSize: 20, fontWeight: "300", textAlign: "center"}}>Duration</Text>
                            <View style={{paddingTop: 5}}>
                                <StopWatch ref={this.watch}></StopWatch>
                            </View>
                        </View>
                        <View>
                            <Text style={{fontSize: 20, fontWeight: "300", textAlign: "center"}}>Activity: {this.state.activity ? this.state.activity.activity : null}</Text>
                            <View style={{width: "100%", alignItems: "center", paddingTop: 5}}>
                                <FontAwesomeIcon size={25} color={this.getActivityColor()} icon={this.getActivityIcon()} />
                            </View>
                        </View>
                    </View>
                </View>
                <View>
                    <MapView
                    region={this.state.region}
                    ref={this.mapView}
                    zoomEnabled={true}
                    showsUserLocation={!this.useCustomMarker}
                    showsCompass={true}
                    loadingEnabled={true}
                    style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height - 165, zIndex:1, padding: 50}}>
                        { this.state.routeData.length > 0 ? <Polyline 
                        coordinates={this.state.routeData.map(ele => {
                            return {latitude: ele.location.coords.latitude, longitude: ele.location.coords.longitude}
                        })}
                        strokeColor="#000"
                        strokeWidth={2}
                        strokeColors={this.state.routeData.map(ele => {
                            return ele.activity === "unknown" ? "#000" :
                            ele.activity === "Walking" 
                            ? "#8b4513" : "blue"
                        })}
                        /> : null}
                        { this.useCustomMarker && this.state.lastKnownLocation ? <Marker coordinate={this.state.lastKnownLocation} image={require('../assets/blueDot.png')}/> : null}
                    </MapView>
                    {this.state.tracking 
                    ? <TouchableOpacity activeOpacity={0.1} onPress={e => this.onPress(e)} style={{width:100,justifyContent:"center", alignSelf:"center", height:100, zIndex:2, bottom: 40, position:"absolute", borderRadius:"100%"}}>
                        <FontAwesomeIcon size={100} color={"#d10202"} icon={faStopCircle} />
                    </TouchableOpacity>
                    :<TouchableOpacity activeOpacity={0.1} onPress={(event) => this.onPress(event)} style={{width:100,justifyContent:"center", alignSelf:"center", height:100, zIndex:2, bottom: 40, position:"absolute", borderRadius:"100%"}}>
                        <FontAwesomeIcon size={100} color={"#18b500"} icon={faPlayCircle} />
                    </TouchableOpacity>}
                    {this.state.immitateKayak ?
                    <TouchableOpacity activeOpacity={0.1} onPress={() => this.setState({immitateKayak: !this.state.immitateKayak})} style={{width: 50,justifyContent:"left", height:50, zIndex:2, bottom: 0, right: 0, position:"absolute"}}>
                        <FontAwesomeIcon size={30} color={"blue"} icon={faTint} />
                    </TouchableOpacity>
                    :<TouchableOpacity activeOpacity={0.1} onPress={() => this.setState({immitateKayak: !this.state.immitateKayak})} style={{width: 50,justifyContent:"left", height:50, zIndex:2, bottom: 0, right: 0, position:"absolute"}}>
                        <FontAwesomeIcon size={35} color={"#944a00"} icon={faTintSlash} />
                    </TouchableOpacity>}
                    
                    <SensorHandler
                    ref={this.sensorHandler}
                    //immitateKayak={this.state.immitateKayak}

                    enableGPS 
                    subscribeGpsUpdates={(location) => this.onLocationUpdate(location)}
                    subscribeInitLocation={(location) => this.handleGpsInit(location)}
                    
                    enableAccelerometer
                    subscribeAccelerationUpdates={(accelerations => this.onAccelerationUpdate(accelerations))}

                    subscribeBatteryUpdates={level => this.onBatteryUpdate(level.batteryLevel)}

                    //enableCompas
                    //subscribeCompasUpdates={direction => this.onDirectionUpdate(direction)}

                    ></SensorHandler>
                </View>
            </View>
        )
    }
}

export default TrackingScreen;
