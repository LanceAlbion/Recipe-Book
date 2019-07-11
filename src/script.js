//Recipe Book
//Author: Chris Meyring

import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import magnifyingGlass from './assets/magnifying-glass.png';

const rootElm = document.getElementById('root');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "home"
    };
    this.changePage = this.changePage.bind(this);
  }

  changePage(e) {
    const id = e.target.id;
    if (id === "homepage-btn") {
      this.setState({currentPage: "home"});
    }
    if (id ==="add-entry-btn") {
      this.setState({currentPage: "add"});
    }
  }

  render() {
    return (
      <React.Fragment>
      <div id="navbar">
        <button id="homepage-btn" type="button" onClick={(e) => this.changePage(e)}>Home</button>
        <img id="search-icon" src={magnifyingGlass}></img>
        <input id="searchbar" type="search" placeholder="Search..."/>
        <button id="add-entry-btn" type="button" onClick={(e) => this.changePage(e)}>Add</button>
      </div>
      <BodyRenderer page={this.state.currentPage}/>
      </React.Fragment>
    );
  }
}

const BodyRenderer = (props) => {
  if (props.page === "home") {
    return <p>Home</p>
  }
  if (props.page === "add") {
    return <p>Add</p>
  }
}
 
ReactDOM.render(<App/>, rootElm);