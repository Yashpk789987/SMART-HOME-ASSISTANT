import React from 'react';
import firebase from 'firebase';
import { config } from '../../src/config';
import { Redirect } from 'react-router-dom';
let rootRef = null;
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      house_id: '',
      password: '',
      login_done: false
    };
  }

  componentWillMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    rootRef = firebase.database().ref();
  }

  handleInput = event => {
    this.setState({ [event.target.name]: [event.target.value] });
  };

  handleLoginButton = event => {
    event.preventDefault();
    let { house_id, password } = this.state;
    if (house_id === '' || password === '') {
      alert('Please Fill House Id And Password');
    } else {
      var houseRef = rootRef
        .child('houses')
        .orderByKey()
        .equalTo(house_id.toString());
      houseRef.once('value', dataSnapshot => {
        if (dataSnapshot.exists()) {
          dataSnapshot.forEach(data => {
            data.forEach(item => {
              if (item.key === 'password') {
                if (item.val() === password.toString()) {
                  this.setState({ login_done: true });
                  localStorage.setItem('house', { authenticated: true });
                  this.props.changeParentState(true);
                } else {
                  alert('Wrong Password');
                }
              }
            });
          });
        } else {
          alert('Wrong UserID');
        }
      });
    }
  };

  componentDidMount() {}
  render() {
    return (
      <div
        className='container'
        style={{
          paddingLeft: '5%',
          paddingRight: '5%',
          paddingBottom: '10%',
          paddingTop: '10%'
        }}
      >
        <div className='container' style={{ backgroundColor: 'white' }}>
          <form>
            <center style={{ padding: '3%' }}>
              <h3>Login</h3>
            </center>
            <div className='form-group'>
              <label>House Id</label>
              <input
                type='text'
                className='form-control'
                onChange={this.handleInput}
                name='house_id'
                id='house_id'
                aria-describedby='emailHelp'
                placeholder='Enter House Id '
              />
            </div>
            <div className='form-group'>
              <label>Password</label>
              <input
                type='password'
                className='form-control'
                onChange={this.handleInput}
                name='password'
                id='exampleInputPassword1'
                placeholder='Password'
              />
            </div>
            <button
              type='submit'
              className='btn btn-primary'
              onClick={this.handleLoginButton}
            >
              Submit
            </button>
          </form>
          <br />
        </div>
      </div>
    );
  }
}
