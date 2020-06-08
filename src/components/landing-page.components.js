import React, { Component } from 'react';
// import { BrowserRouter as Router, Route} from 'react-router-dom';
import {Button } from 'react-bootstrap';
import logo from '../logo.svg';
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from 'universal-cookie';
import JwtDecode from 'jwt-decode';
import '../App.css';

// Import components
import MyNavBar from "./mynavbar.components";
import { Link } from 'react-router-dom';

import Background from "../landing_page_background.jpg";

export default class LandingPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            auth : false,
            userProfile: ""
        }
    }

    componentDidMount() {
        const cookies = new Cookies();
        var retrival = cookies.get('jwt');
        if (retrival === undefined || retrival === null) {
            // console.log("No JWT");
            this.setState({
                auth: false
            })
        } else {
            // console.log("found JWT");
            this.setState({
                auth: true
            })
            let decode = JwtDecode(retrival);
            this.setState({
                userProfile: decode.userName
            })
        }
        cookies.remove('diary');
        
    }


    render () {

            var wordStyle = {
                fontFamily: "montserrat",
                fontWeight: 600
            };

            return (
            <div >
                <div className="page_background">
                <MyNavBar {...this.state}/>
                <div className="App">
                    <header className="App-header"> 
                    <div className="landing-page">
                    <img src="../nikki-logo.svg" style={{ height:"50px"}}></img>
                    {this.state.auth? <p style={wordStyle}>Welcome back<p></p>{this.state.userProfile}</p>:
                    <p><p>Welcome to Nikki</p>Everyday is a fresh start</p>}
                    <Link to={this.state.auth? "/diary" : "/signUp"}>
                        <Button variant="primary" size='lg'>{this.state.auth? "Start Writing" : "Sign Up"}</Button>
                    </Link>
                </div>
                </header>
                </div>
                </div>
            </div>
        );
    }
}
