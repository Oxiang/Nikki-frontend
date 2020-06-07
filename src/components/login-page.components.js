import React, { Component } from 'react';
// import { BrowserRouter as Router, Route} from 'react-router-dom';
import {Button, Form} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Cookies from 'universal-cookie';
import '../App.css';

// Import components
import MyNavBar from "./mynavbar.components";

export default class LoginPage extends Component {
    constructor(props) {
        super();

        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            password : "",
            email : "",
            auth: false
        }
    }

    componentDidMount() {
        const cookies = new Cookies();
        var retrival = cookies.get('jwt');
        if (retrival === undefined || retrival === null) {
            console.log("No JWT");
            this.setState({
                auth: false
            })
        } else {
            console.log("found JWT");
            this.setState({
                auth: true
            })
        }
    }

    onChangePassword(e) {
        this.setState({
            password : e.target.value
        })
    }

    onChangeEmail(e) {
        this.setState({
            email : e.target.value,
            errorMessage: ""
        })
    }


    onSubmit(e) {
        // Prevent page from re-loading!
        e.preventDefault();

        const user = {
            password : this.state.password,
            email : this.state.email,
        }

        console.log(user);

        // Post data
        axios.post("http://backend-nikki.herokuapp.com/users/loginUser", user)
        .then(res => {
            console.log(res.data);
            return res.data;
        })
        .then(data => {
            const login_status = data.login;
            if (login_status === "Successful") {
                const cookies = new Cookies();
                cookies.set('jwt', String(data.jwt), data.time);
                let retrival = cookies.get('jwt');
                this.props.history.push('/diary');  
            }
        })
        .catch(err => {
            // this.setState({errorMessage: console.err.response.data.errors});
            this.setState({errorMessage: err.response.data.login});
            console.log(err);
            console.log("Error!");
        })
    }

    render () {
            var wordStyle = {
                fontFamily: "montserrat",
                fontWeight: 500
            };
            // const isLogged = useSelector(state => state.isLogged);
            return (
            <div>
            <div className="page_background">
            <MyNavBar {...this.state}/>
            <div className="App">
                <header className="App-header" >  
                    {this.state.auth? <p style={wordStyle}>You are already logged in</p> :  <p style={wordStyle}>Welcome back to Nikki</p>}
                    {/* {isLogged ? <p>You have already logged in</p> : <p>Please log in</p>} */}
                    <Form onSubmit={this.onSubmit}>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Control type="email" 
                                        placeholder="Enter email" 
                                        onChange={this.onChangeEmail}
                                        value = {this.state.email}/>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Control type="password" 
                                        placeholder="Password"
                                        onChange={this.onChangePassword}
                                        value = {this.state.password}/>
                        </Form.Group>
                        { this.state.errorMessage && 
                        <p className="error">
                            {this.state.errorMessage}    
                        </p>}
                        <Button variant="primary" size='lg' type="submit">
                            Login
                        </Button>
                    </Form>
                </header>
            </div>
            </div>
            </div>
        );
        }
}
