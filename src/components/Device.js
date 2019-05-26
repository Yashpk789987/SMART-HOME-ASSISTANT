import React from 'react';
import firebase from 'firebase';
import { config } from '../../src/config';
import { ApiAiClient } from 'api-ai-javascript';
import { serverUrl } from '../serverUrl';
const client = new ApiAiClient({
  accessToken: '6915b3341eb848ca9b44e9fbcf41a3a2'
});
var rootRef = null;
var deviceRef = null;
var recognition = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition ||
  window.mozSpeechRecognition ||
  window.msSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 5;
var speaker = new (window.SpeechSynthesisUtterance ||
  window.webkitSpeechSynthesisUtterance ||
  window.mozSpeechSynthesisUtterance ||
  window.msSpeechSynthesisUtterance)();
speaker.lang = 'en-US';

export default class Device extends React.Component {
  state = {
    device: {},
    device_state: 0
  };

  componentDidMount() {
    this.setState({
      device: this.props.device,
      device_state: this.props.device.status
    });
    deviceRef = rootRef
      .child('devices/-LbEg4LS47zn5vT3D_yb')
      .orderByKey()
      .equalTo(this.props.device.device_id);
    deviceRef.on('value', data => {
      data.forEach(item => {
        this.setState({ device_state: item.val().status });
      });
    });
  }

  componentWillMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    rootRef = firebase.database().ref();
  }

  componentWillUmount() {
    deviceRef.off('value');
  }

  handleSpeechToggle = async device_id => {
    let text = '';
    recognition.start();
    recognition.onresult = e => {
      if (
        e.results[0][0].transcript.toString().search(this.state.device.name) ===
        -1
      ) {
        text =
          ' ' +
          e.results[0][0].transcript +
          ' ' +
          this.state.device.name +
          ` of ${this.state.device.room_type}`;
      } else {
        text =
          ' ' +
          e.results[0][0].transcript +
          ' ' +
          ` of ${this.state.device.room_type}`;
      }

      client
        .textRequest(text)
        .then(response => {
          let decision = true;
          let parameters = Object.values(response.result.parameters);
          decision = parameters.length === 0 ? false : true;
          for (let i = 0; i < parameters.length; i++) {
            decision = parameters[i] === '' ? false : true;
            if (decision === false) {
              break;
            }
          }

          if (decision) {
            if (
              response.result.parameters.electrical_appliance !==
              this.state.device.name
            ) {
              speaker.text =
                'Sorry... this electrial device is not a' +
                response.result.parameters.electrical_appliance;
              window.speechSynthesis.speak(speaker);
            } else {
              if (response.result.parameters.onn_off === 'on') {
                if (this.state.device_state === 1) {
                  speaker.text = 'It Is Already Onn';
                  window.speechSynthesis.speak(speaker);
                } else {
                  rootRef
                    .child(
                      `devices/-LbEg4LS47zn5vT3D_yb/${
                        this.state.device.device_id
                      }`
                    )
                    .update({
                      status: 1
                    });
                  fetch(`${serverUrl}/command/${device_id}/1`)
                    .then(res => res.json())
                    .then(data => {})
                    .catch(err => console.log(err));
                  speaker.text =
                    response.result.parameters.electrical_appliance +
                    ' Is Switched Onn ..';
                  window.speechSynthesis.speak(speaker);
                }
              } else {
                if (this.state.device_state === 0) {
                  speaker.text = 'It Is Already Offf ';
                  window.speechSynthesis.speak(speaker);
                } else {
                  rootRef
                    .child(
                      `devices/-LbEg4LS47zn5vT3D_yb/${
                        this.state.device.device_id
                      }`
                    )
                    .update({
                      status: 0
                    });
                  fetch(`${serverUrl}/command/${device_id}/0`)
                    .then(res => res.json())
                    .then(data => {})
                    .catch(err => console.log(err));
                  speaker.text =
                    response.result.parameters.electrical_appliance +
                    '  Is Switched Offf ..';
                  window.speechSynthesis.speak(speaker);
                }
              }
            }
          } else {
            speaker.text = response.result.fulfillment.speech;
            window.speechSynthesis.speak(speaker);
            speaker.onend = e => {};
          }
        })
        .catch(err => {
          console.log(err);
        });
    };
  };

  handleToggle = device_id => {
    let current_state = this.state.device_state === 0 ? 1 : 0;
    fetch(`${serverUrl}/command/${device_id}/${current_state}`)
      .then(res => res.json())
      .then(data => {})
      .catch(err => console.log(err));
    rootRef.child(`devices/-LbEg4LS47zn5vT3D_yb/${device_id}`).update({
      status: current_state
    });
  };

  render() {
    let item = this.props.device;
    let class_var = this.state.device_state === 1 ? 'bg-success' : 'bg-danger';
    return (
      <div
        className={'card text-white ' + class_var + ' mb-3'}
        style={{ width: '18rem' }}
      >
        <div
          className='card-header'
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h3>{item.name}</h3>
          </div>
          <div style={{ textAlign: 'right', paddingRight: '10%' }}>
            <img
              width='30%'
              height='10%'
              src='/images/voice.png'
              onClick={() => {
                this.handleSpeechToggle(item.device_id);
              }}
            />
          </div>
        </div>
        <button
          style={{ margin: '5%' }}
          onClick={() => this.handleToggle(item.device_id)}
        >
          <div className='card-body'>
            <img width='100%' height='40%' src={item.image} />
          </div>
        </button>
      </div>
    );
  }
}
