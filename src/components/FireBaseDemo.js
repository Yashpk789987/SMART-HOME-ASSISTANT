import React from 'react'
import  firebase from 'firebase';
import { config } from '../../src/config'
var rootRef = null
export default class FireBaseDemo extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            house_id : '',
            rooms : []
        }
    }

    componentWillMount(){
        firebase.initializeApp(config);
        rootRef = firebase.database().ref()
        rootRef.child('users').on('value' , ( data ) => {
            data.forEach((item) => {
                //console.log("data Addded ....")
            })
        })
    }

    componentWillUnmount(){
        rootRef.child('users').off('value')
    }
    
    componentDidMount = async () => {
        this.handleLogin()
        let fetchedDataRef = rootRef.child('rooms').orderByChild('house_id').equalTo('-LbEg4LS47zn5vT3D_yb')
        let rooms = []
        fetchedDataRef.once('value' , ( data ) => {
            data.forEach((item) => {
                rooms.push({...item.val(), room_id : item.key})
            })
        })
        this.setState({ rooms : rooms })
    }

    handleLogin = () => {
       rootRef.child('houses').orderByChild('mobile_password').equalTo('9399729705_vandematram')
       .once('value' , ( data ) => {
           data.forEach(async (item) => {
              await this.setState({ house_id : item.key })
           })
       })
       
    }
    
    handleClick = () => {
        rootRef.child('houses').push({
            password : 'HelloWorld',
            owner_name : 'ShivPratap Singh',
            address : 'ASP Office , Gwalior'
        });
    }

    handleAddRoom = () => {
        rootRef.child('rooms').push({
            house_id : this.state.house_id,
            type : 'Bed Room',
            image : 'null'
        });
    }

    handleAddDevice = () => {
        rootRef.child('devices').child(`${this.state.house_id}`)
        .push({
            room_id : this.state.rooms[2].room_id,
            name : 'AC',
            status : 'off'
        })
    }

    render(){
        console.log(this.state.rooms)
        return (
            <div>
                <button onClick = {() => this.handleClick()} >Click Me </button>
                <button onClick = {() => {this.handleLogin()}}>Login</button>
                <button onClick = {() => {this.handleAddRoom()}}>Add Rooms</button>
                <button onClick = {() => {this.handleAddDevice()}}>Add Device</button>
            </div>
        )
    }

}