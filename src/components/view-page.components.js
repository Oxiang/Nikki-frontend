import React, { Component } from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import '../styles.css';
import Cookies from 'universal-cookie';
import JwtDecode from 'jwt-decode';
import axios from 'axios';

import MyNavBar from "./mynavbar.components";
import MyCard from "./mycard.components";
import { Card , Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';

// One item component
// selected prop will be passed
const MenuItem = ({props, selected}) => {
  return <div className={`menu-item ${selected ? 'active' : ''}`}><MyCard {...props}></MyCard></div>;
};

// All items component
// Important! add unique key
export const Menu = (list, selected) =>
  list.reverse().map(el => {
    const {name} = el;
    return <MenuItem  props={el} key={name} selected={selected} />;
  });


const Arrow = ({ text, className }) => {
  return (
    <div
      className={className}
    >{text}</div>
  );
};

const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });

const selected = 'item1';

export default class ViewPage extends Component {
  constructor(props) {
    super(props);
    // call it again if items count changes

    this.state = {
        auth : false,
        userProfile: "",
        posts: [],
        selected: 0,
        menuItems : []
    }
  }

  state = {
    selected
  };

  componentDidMount() {
    console.log("https://backend-nikki.herokuapp.com/postings/viewPost")
    const cookies = new Cookies();
    cookies.remove('diary');
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
        let decode = JwtDecode(retrival);
        this.setState({
            userProfile: decode.userName
        })

        let info = {
            email : decode.email
        }

        
        axios.post("https://backend-nikki.herokuapp.com/postings/viewPost", info)
        .then((res) => {
            // console.log(res.data.posts);
            this.setState({
                posts : res.data.posts,
                menuItems: Menu(res.data.posts, selected)
            })
        })
        .catch(err => console.log("Error ", err))
    }
    
}
  onSelect = key => {
    this.setState({ selected: key });
  }


  render() {
    const { selected } = this.state;
    // Create menu from items
    const menu = this.state.menuItems;

      var wordStyle = {
        fontFamily: "montserrat",
        fontWeight: 500
    };

    return (
        <div>
          <div className="page_background">
            <MyNavBar {...this.state}/>
                <div className="App">
                <header className="App-header-overwrite">
                <br></br>
                {this.state.auth? <p style={wordStyle}>Welcome back {this.state.userProfile}</p>:<p>Welcome to Nikki</p>}

                <ScrollMenu
                data={menu}
                arrowLeft={ArrowLeft}
                arrowRight={ArrowRight}
                selected={selected}
                onSelect={this.onSelect}
                inertiaScrolling={true}
                transition={0.5}
                translate={1}
                wheel={true}
                />

                <Link to={this.state.auth? "/diary" : "/signUp"}>
                    <Button variant="primary" size='lg'>{this.state.auth? "Start Writing" : "Sign Up"}</Button>
                </Link>
            </header>
        </div>
        </div>
        </div>

    );
  }
}