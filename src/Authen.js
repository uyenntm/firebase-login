import React, { Component } from 'react'
var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyDU7z8pwLA4G_WYCpeIok5C04Ob64CGN2M",
    authDomain: "usurvey-91f1c.firebaseapp.com",
    databaseURL: "https://usurvey-91f1c.firebaseio.com",
    projectId: "usurvey-91f1c",
    storageBucket: "usurvey-91f1c.appspot.com",
    messagingSenderId: "989961560394"
  };
  firebase.initializeApp(config);

export default class Authen extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
        err: '',
        info:''
    }
    
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
    this.google = this.google.bind(this);
  }
  login(event){
    //get email and password
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    //console.log(email, " ",password);
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email,password);
   
    promise.then(
        user=>{
            var lout = document.getElementById('logout');
            //write a welcome message for user
            //hide input_container
            document.getElementById('input_container').classList.add('hide');
            this.setState({info:"Hello, "+email});
            lout.classList.remove('hide');
            var login = document.getElementById('login');
            login.classList.add('hide');
            var signup = document.getElementById('signup');
            signup.classList.add('hide');

        }
    )
    .catch(e =>{
        var err = e.message;
        console.log(err);
        this.setState({err:err});
    });
  } //end login
  signup(event){
    //get email and password
    const email = this.refs.email.value;
    const password = this.refs.password.value;

    //firebase authen
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email,password);
     //TODO: handle login promise
     promise
     .then(user=>{
         var info = "Hello, "+ user.email;
         firebase.database().ref('/users/'+user.uid).set({email:user.email});
         console.log(user);
         this.setState({info: info});
     })
     .catch(e =>{
        var err = e.message;
        console.log(err);
        this.setState({err:err});
    });  
  } //end signup
  logout(event){
    const promise = firebase.auth().signOut();
    promise.then(function() {
        console.log('Signed Out');
      }, function(error) {
        console.error('Sign Out Error', error);
      });
    var lout = document.getElementById('logout');
    //write a welcome message for user

    lout.classList.add('hide');

    var login = document.getElementById('login');
    login.classList.remove('hide');
    var signup = document.getElementById('signup');
    signup.classList.remove('hide');
    document.getElementById('input_container').classList.remove('hide');
    this.setState({info:''});
  } //end logout

  google(event){
    console.log("Sign In with google");
    var provider = new firebase.auth.GoogleAuthProvider();
    //var promise = firebase.auth().signInWithPopup(provider);
    var promise = firebase.auth().signInWithRedirect(provider);
    promise
    .then(result=>{
        var user = result.user;
        console.log(user);
        firebase.database().ref('users/'+user.uid).set({
            email:user.email,
            name:user.displayName
        });
    })
    .catch(e=>{
        var msg = e.message;
        console.log(msg);
    });
  }//end google
  
  render() {
    return (
      <div>
        <h2 className="info">{this.state.info}</h2>
        <div id="input_container">
        <input id="email" ref="email" type="email" placeholder="Enter your email" /> <br/>
        <input id="pass" ref="password" type="password" placeholder="Enter your password" /> <br/>
        </div>
        <p className="error">{this.state.err}</p>
        <button onClick={this.login} id="login">Log In</button>
        <button onClick={this.signup} id="signup">Sign Up</button>
        <button onClick={this.logout} id="logout" className="hide">Log Out</button>
        <button onClick={this.google} id="google" className="google">Sign In with Google</button>
      </div>
    )
  }
}
