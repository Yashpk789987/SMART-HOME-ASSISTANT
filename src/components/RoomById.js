import React from 'react'
import  firebase from 'firebase';
import { config } from '../../src/config'
import Device from './Device'
var rootRef = null

export default class RoomById extends React.Component {
    
    state = {
        room_id : '',
        devices : []
    }

    componentWillMount(){
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        rootRef = firebase.database().ref();
    }

    componentDidMount(){
        this.setState({room_id : this.props.match.params.room_id })
        let devicesRef = rootRef.child('devices/-LbEg4LS47zn5vT3D_yb').orderByChild('room_id').equalTo(this.props.match.params.room_id);
        devicesRef.once('value' , ( data ) => {
           let devices = [] 
           data.forEach((item) => {
               devices.push({...item.val(), device_id : item.key })
           })
           this.setState({ devices : devices })
        })
    }

    render(){
        if(this.state.devices.length === 0){
            return <h1 style = {{ color : 'white' }} >Loading Devices .....</h1>
        }
        else {
            return (
              <div className = "container" >
                {this.state.devices.map((item, index) => {
                    return (
                       <Device key = {item.device_id} device = {item} />
                    )
                })}
              </div>
            )
        }
    }
}