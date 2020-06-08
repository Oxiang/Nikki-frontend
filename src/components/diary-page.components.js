import React, { Component } from 'react';
// import { BrowserRouter as Router, Route} from 'react-router-dom';
import {Button, Container, Row, Col } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from 'universal-cookie';
import JwtDecode from 'jwt-decode';
import axios from 'axios';
import { store } from 'react-notifications-component';

import Trumbowyg from 'react-trumbowyg';
import 'react-trumbowyg/dist/trumbowyg.min.css'

// Import components
import MyNavBar from "./mynavbar.components";
import { Link } from 'react-router-dom';
import '../App.css';

export default class DiaryPage extends Component {
    constructor() {
        super()

        this.onSave = this.onSave.bind(this);
        this.onChangeData = this.onChangeData.bind(this);
        this.onSuccessPost = this.onSuccessPost.bind(this);
        this.onFailPost = this.onFailPost.bind(this);
        this.onDeleteData = this.onDeleteData.bind(this);
        this.onDeletePost = this.onDeletePost.bind(this);
        this.onSavePost = this.onSavePost.bind(this);

        this.state = {
            data : "",
            auth: false,
            userProfile: "",
            email: "",
            uniqueId: "",
            initial_description: "",
            have_id : false
        }
    }

    componentDidMount() {
        const cookies = new Cookies();
        var retrival = cookies.get('jwt');
        var diary_retrival = cookies.get('diary');
        
        // check if you are logged-in
        if (retrival === undefined || retrival === null) {
            console.log("No JWT");
            this.setState({
                auth: false
            })
            this.props.history.push('/login');
        } else {
            console.log("found JWT");
            this.setState({
                auth: true
            })
            let decode = JwtDecode(retrival);
            this.setState({
                userProfile: decode.userName,
                email: decode.email
            })
            
            // if you are logged in, check if u intend to edit a diary
            if (diary_retrival === undefined || diary_retrival === null) {
                console.log("New Entry");
            } else {

                let info = {
                    uniqueId : diary_retrival
                }

                axios.post("https://backend-nikki.herokuapp.com/postings/getPost", info)
                .then((res) => {
                    if (res.data.retrieve == 'Retrieved document') {
                        console.log(res.data.data[0]); 
                        this.setState({
                            have_id: true,
                            uniqueId: res.data.data[0].uniqueID,
                            initial_description: res.data.data[0].description
                        })
                    }
                })
                .catch(err => console.log("Error ", err))
            }
        }
    }
    
    onSave(e) {

        // console.log(this.state.data)
        if (this.state.have_id == true) {
            // Rewrite the previous diary
            let info = {
                uniqueId : this.state.uniqueId,
                description : this.state.data
            }
            axios.post("https://backend-nikki.herokuapp.com/postings/updatePost", info)
            .then(res => {
                console.log("Save Updated");
                console.log(res);
                this.onSavePost();
            })
            .catch(err => {
                console.log("Error" , err);
            })

        } else {
            // Save brand new diary
            let info = {
                email: this.state.email,
                description: this.state.data
            }
            console.log(info);
            // Post data
            axios.post("https://backend-nikki.herokuapp.com/postings/createPost", info)
            .then(res => {
                console.log(res.data.post);
                if (res.data.post == "Successful") {
                    this.onSuccessPost();
                }
    
            })
            .catch(err => {
                console.log("Error!");
                console.log(err);
                this.onFailPost();
            })
        }
        
    }

    onChangeData(e) {
        this.setState({
            data : e.target.innerText
        })
    }

    onDeleteData() {
        let info = {
            username: this.state.userProfile,
            uniqueId: this.state.uniqueId
        }

        axios.post("https://backend-nikki.herokuapp.com/postings/deletePost", info)
        .then(res => {
            console.log(res);
            const cookies = new Cookies();
            cookies.remove("diary");
            this.onDeletePost();

            setTimeout(function() { //Start the timer
                    window.location.reload(false) //After 1 second, set render to true
                }.bind(this), 1100)
        })
        .catch(err => {
            console.log("Error!", err);
        })

    }

    onSuccessPost() {
        store.addNotification({
            title: this.state.userProfile,
            message: "Post Saved!",
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 3000,
              onScreen: true
            }
          });
    }

    onSavePost() {
        store.addNotification({
            title: this.state.userProfile,
            message: "Post Overwrite!",
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 2000,
              onScreen: true
            }
          });
    }

    onFailPost() {
        store.addNotification({
            title: "Warning",
            message: "Post Unable to save!",
            type: "danger",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 3000,
              onScreen: true
            }
          });
    }
    
    
    onDeletePost() {
        store.addNotification({
            title: "Warning",
            message: "Post Deleted",
            type: "danger",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 1000,
              onScreen: true
            }
          });
    }
    render () {
            var wordStyle = {
                fontFamily: "montserrat",
                fontWeight: 500
            };
            return (
            <div>
            <div className="page_background">
            <MyNavBar {...this.state}/>
            <div className="App">
                <header className="App-header" style={{ backgroundColor:"transparent" }}>
                <p style={wordStyle}>How was your day {this.state.userProfile}?</p>
                
                <Container>
                    <Row>
                        <Col xs="1"></Col>
                        <Col xs="10" style= {{ backgroundColor:"wheat"}}>
                            {/* Editor component, go to public/index.html to declare jquery as global */}
                            <Trumbowyg id='react-trumbowyg' 
                            buttons={
                                [
                                    ['viewHTML'],
                                    ['formatting'],
                                    'btnGrp-semantic',
                                    ['link'],
                                    ['insertImage'],
                                    'btnGrp-justify',
                                    'btnGrp-lists',
                                    ['table'], // I ADDED THIS FOR THE TABLE PLUGIN BUTTON
                                ]
                            }
                            data= {this.state.have_id ? this.state.initial_description : null}
                            onChange = {this.onChangeData}
                            placeholder={this.state.have_id ? "": 'Type your text!'}
                            ref="trumbowyg"
                        />

                    <Button variant="primary" size='lg' onClick={this.onSave}>Save</Button>
                    <br></br><br></br>
                    <Link to="/diary">
                        {this.state.have_id && <Button variant="danger" size='lg' onClick={this.onDeleteData}>Delete </Button> }
                    </Link>
                    

                {this.state.postSaved && <p>Post Saved!</p>}
                        </Col>
                        <Col xs="1"></Col>

                    </Row>

                </Container>
                
                </header>
            </div>
            </div>
            </div>
        );
    }
}
