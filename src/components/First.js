import React from 'react'

var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 5;

export default class ________ extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            text : ''
        }
    }
    componentDidMount(){
        recognition.start()
        recognition.onresult = (e) => {
            console.log(e.results[0][0].transcript)
            this.setState({ text : e.results[0][0].transcript })
        }
        recognition.onerror = (e) => {
            console.log(e)
            this.setState({ text : e.error})
        }
    }
    onStart = ()  => {}
    render() {
        return(
            <div>
                <h1>{this.state.text}</h1>
                <button onClick = {() => this.onStart()}>Click To Start Listening</button>
            </div>
        )    
    }
}