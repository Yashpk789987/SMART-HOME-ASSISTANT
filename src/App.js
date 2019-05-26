import React, { Component } from 'react';

import NavigationDrawer from './components/NavigationDrawer';
import Login from './components/Login';
import { serverUrl } from './serverUrl';

class App extends Component {
  state = {
    logged_in: false
  };

  changeParentState = logged_in => {
    this.setState({ logged_in: logged_in });
    window.location.reload();
  };

  componentDidMount() {
    if (localStorage.getItem('house') !== null) {
      this.setState({ logged_in: true });
    }
    fetch(`${serverUrl}/make_dyno_onn`)
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }

  render() {
    if (this.state.logged_in === true) {
      return <NavigationDrawer changeParentState={this.changeParentState} />;
    } else {
      return <Login changeParentState={this.changeParentState} />;
    }
  }
}

export default App;

///////////////////////// DEMO REACT COMPONENT ///////////////////////////

// import logo from './logo.svg';
// import './App.css';
// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <p>
//             Edit <code>src/App.js</code> and save to reload.
//           </p>
//           <a
//             className="App-link"
//             href="https://reactjs.org"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Learn React
//           </a>
//         </header>
//       </div>
//     );
//   }
// }

///////////////////////   DEMO REACT COMPONENT //////////////////
