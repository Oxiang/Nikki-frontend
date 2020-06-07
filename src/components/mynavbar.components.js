import React , {Component} from 'react';
import {Nav, Navbar, Button, FormControl, Form} from 'react-bootstrap';
import '../App.css';
import Cookies from 'universal-cookie';

export default class MyNavBar extends Component {
    constructor(props) {
        super(props)

        this.onLogOut = this.onLogOut.bind(this);
    }

    onLogOut() {
        const cookies = new Cookies();
        cookies.remove('jwt');
    }

    render () {

        const nav_style = {
            textAlign: "center"
        }

        return  (
            <Navbar scrolling fixed="top" dark expand="lg">
            <Navbar.Brand href="/"> <img src="../nikki-logo.svg" style={{ height:"25px"}}></img> Nikki</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                {/* <Nav.Link href="/test">Explore</Nav.Link> */}
                <Nav.Link href="/diary">Write</Nav.Link>
                <Nav.Link href="/view">View</Nav.Link>
                {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown> */}
                </Nav>
                <Form inline>
                {/* <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-success">Search</Button> */}
                {this.props.auth ? <Button onClick={this.onLogOut} href="/">Logout</Button> : <Button href="/login">Login</Button> }
                {/* <Button href="/login">Login</Button> */}
                </Form>
            </Navbar.Collapse>
            </Navbar>
        )
    }
}
