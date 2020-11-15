import React from "react";
import GPS from "../components/Gps";
import Gyroscope from "../components/GyroSensor";
import Magnetometer from "../components/MagnetometerSensor";
import Accelerometer from "../components/AccelerometerSensor";
import Battery from "../components/Battery"; 
import { View } from "react-native";
import { LocationAccuracy } from "expo-location";

class SensorHandler extends React.Component {

    gps = React.createRef();
    gyroscope = React.createRef();
    accelerometer = React.createRef();
    magnetometer = React.createRef();
    battery = React.createRef();

    debug = true;

    constructor(props) {
        super(props);
        this.state = {
            lastPosition: null
        }
    }

    // COMMON Section
    startEnabledSensors = () => {
        this.requestPosition();

        // simple subscribe sensors
        this.gyroscope.current?.startSampling();
        this.accelerometer.current?.startSampling();
        this.magnetometer.current?.startSampling();
        this.battery.current?.subscribe();
    }

    requestPosition = async () => {

       
        // Request initial GPS update
        try {
            
            this.log("Requesting Position update")
            const position = await this.gps.current?.getPositionAsync(false, {maxAge: 0, requiredAccuracy: 1}, LocationAccuracy.High);
            if(this.props.subscribeGpsUpdates)this.props.subscribeGpsUpdates(position);
            this.setState({lastPosition: position})
            
            // Run update strategy flow
            this.chooseUpdateStrategy();
            
        } catch (err) {
            console.error(err)
            this.log("Couldn't retreive position update - Request position again in 3 seconds")
            // If we do not aquire a position even though it was requested do a retry after x seconds
            setTimeout(() => {
                this.requestPosition()
            }, 3000)
        }
    }

    chooseUpdateStrategy = () => {

        // Based on different elements select an update strategy...
        
        // Static duty cycling
        this.evaluateSensorParaeters();
        setTimeout(() => {
            this.requestPosition();
        }, 5000)
    }

    evaluateSensorParaeters = () => {
        console.log("Battery: ", this.battery.current.state);

    }


    stopEnabledSensors = () => {
        this.gps.current?.stopSampling();
        this.gyroscope.current?.stopSampling();
        this.accelerometer.current?.stopSampling();
        this.magnetometer.current?.stopSampling();
        this.battery.current?.unsubscribe();
    }

    // ******** Battery level ********* //
    onBatteryLevelUpdate = (level) => {
        if(this.props.subscribeBatteryUpdates)
        {
            this.props.subscribeBatteryUpdates(level);
            console.log("batter:", level)
        }
        
    }

    renderBattery = () => {
        return <Battery ref={this.battery} subscribeBatteryUpdates={level => this.onBatteryLevelUpdate(level)} />
    }

    // ***** Magnetometer START *****
    onCompasUpdate = (direction) => {
        if(this.props.subscribeCompasUpdates) {
            this.props.subscribeCompasUpdates(direction);
        }

        
        let angle = 0;
        let {x, y, z} = direction;

        if (Math.atan2(y, x) >= 0) {
            angle = Math.atan2(y, x) * (180 / Math.PI);
        } else {
            angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
        }

        if (angle >= 22.5 && angle < 67.5) {
            console.log("NE")
          }
          else if (angle >= 67.5 && angle < 112.5) {
            console.log("E")
          }
          else if (angle >= 112.5 && angle < 157.5) {
            console.log("SE");
          }
          else if (angle >= 157.5 && angle < 202.5) {
            console.log("S")
          }
          else if (angle >= 202.5 && angle < 247.5) {
            console.log("SW");
          }
          else if (angle >= 247.5 && angle < 292.5) {
            console.log("W")
          }
          else if (angle >= 292.5 && angle < 337.5) {
            console.log("NW")
          }
          else {
            console.log("N")
          }

        console.log(Math.round(angle))
    }

    renderMagnetometer = () => {
        if(this.props.enableCompas) {
            return <Magnetometer ref={this.magnetometer} subscribeUpdates={direction => this.onCompasUpdate(direction)} />
        }
    }
    // ***** Magnetometer END *****

    // ***** Accelerometer START *****
    onAccelerationUpdate = (accelerations) => {
        if(this.props.subscribeAccelerationUpdate) {
            this.props.subscribeAccelerationUpdates(accelerations);
        }
    }

    renderAccelerometer = () => {
        if(this.props.enableAccelerometer) {
            return <Accelerometer ref={this.accelerometer} immitateKayak={this.props.immitateKayak} subscribeUpdates={accelerations => this.onAccelerationUpdate(accelerations)}/>
        }
    }

    // ***** Accelerometer END *****

    // ***** Gyroscope START *****
    onGyroUpdate = (angleVelocities) => {
        if(this.props.subscribeGyroUpdates) {
            this.props.subscribeGyroUpdates(angleVelocities);
        }
    }

    renderGyroscope = () => {
        if(this.props.enableGyro) {
            return <Gyroscope ref={this.gyroscope} subscribeUpdates={angleVelocities => this.onGyroUpdate(angleVelocities)} />
        }
    }
    // ***** Gyroscope END *****

    // ***** GPS START ***** 
    onLocationUpdate = (location) => {
        if(this.props.subscribeGpsUpdates) {
            this.props.subscribeGpsUpdates(location)
        }
    }

    onGpsInit = (location) => {
        if(this.props.subscribeGpsInit) {
            this.props.subscribeGpsInit(location)
        }
    }

    renderGPS = () => {
        if(this.props.enableGPS) {
            return <GPS ref={this.gps} subscribeUpdates={location => this.onLocationUpdate(location)} subscribeInitLocation={(location) => this.onGpsInit(location)}></GPS>
        }
    }
    // ***** GPS END ***** 

    render = () => {
        return <View>
            {this.renderGPS()}
            {this.renderGyroscope()}
            {this.renderAccelerometer()}
            {this.renderMagnetometer()}
            {this.renderBattery()}
        </View>
    }

    log = (args) => {
        if(this.debug) {
            console.log(args);
        }
    }
}

export default SensorHandler;