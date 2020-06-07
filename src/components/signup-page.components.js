import React, { Component } from 'react';
// import { BrowserRouter as Router, Route} from 'react-router-dom';
import {Button, Form} from 'react-bootstrap';
import '../App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Cookies from 'universal-cookie';

// Import components
import MyNavBar from "./mynavbar.components";

export default class SignUpPage extends Component {
    constructor() {
        super();

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username : "",
            password : "",
            email : "",
            auth : false
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
    // Record any changes
    onChangeUsername(e) {
        this.setState({
            username : e.target.value
        })
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
            username : this.state.username,
            password : this.state.password,
            email : this.state.email,
        }

        console.log(user);

        // Post data
        axios.post("http://backend-nikki.herokuapp.com/users/addUser", user)
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
            this.setState({errorMessage: err.response.data.errors});
            console.log(err.response.data.errors);
        })
    }


    render () {
            return (
            <div>
            <div className="page_background">
            <MyNavBar {...this.state}/>
            <div className="App">
                <header className="App-header">
                    <Form onSubmit={this.onSubmit}>
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" 
                                        placeholder="Enter username" 
                                        onChange={this.onChangeUsername}
                                        value = {this.state.username}/>
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" 
                                        placeholder="Enter email" 
                                        onChange={this.onChangeEmail}
                                        value = {this.state.email}/>
                            <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
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
                            Register
                        </Button>
                    </Form>
                </header>
            </div>
            </div>
            </div>
        );
        }
}
