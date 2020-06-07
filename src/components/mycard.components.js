import React , {Component} from 'react';
import {Nav, Navbar, Button, FormControl, Form, Card} from 'react-bootstrap';
import '../App.css';
import Cookies from 'universal-cookie';
import Moment from 'react-moment';
import 'moment-timezone';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default class MyCard extends Component {
    constructor(props) {
        super(props)

        this.onAccess = this.onAccess.bind(this);

        this.state = {
            uniqueID : this.props.uniqueID
        }
    }

    onAccess() {
        const cookies = new Cookies();
        cookies.set('diary', String(this.state.uniqueID)); 
    }
    

    render () {
        const nav_style = {
            textAlign: "center"
        }

        // Set timing
        var y_m_d = this.props.createdAt.slice(0,10);
        var h_m_s = this.props.createdAt.slice(11, 19);
        console.log(h_m_s);

        var display = ""
        if (this.props.description.length > 30) {
            display = this.props.description.slice(0,30) + "...";
        } else {
            display = this.props.description;
        }

        return  (
            <div>
                <Card
                bg='info'
                // key={idx}
                text='white'
                style={{ width: '18rem' }}
                >
                <Card.Header><Moment local>{this.props.createdAt}</Moment></Card.Header>
                <Card.Body>
                    
                    <Card.Text>
                        {display}
                    </Card.Text>

                    <Link to="/diary">
                        <Button variant="primary" onClick={this.onAccess} >Review</Button>
                    </Link>
                    
                </Card.Body>
                </Card>
                <br />
            </div>
        )
    }
}
