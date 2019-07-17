//Recipe Book
//Author: Chris Meyring

import './style.sass';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Link, Switch, withRouter} from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.css';
import blank from './assets/placeholder.png';
import beef from './assets/beef.png';
import chicken from './assets/chicken.png';
import pasta from './assets/pasta.png';
import pork from './assets/pork.jpg';
import potato from './assets/potato.png';
import rice from './assets/rice.jpg';
import taco from './assets/taco.png';

const rootElm = document.getElementById('root');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [

      ]
    };

    this.addRecipe = this.addRecipe.bind(this);
  }

  addRecipe(name, cookTime, ctUnit, ingredientList, instructions, pic) {
    this.setState({entries: [
      ...this.state.entries, 
      {
        name,
        cookTime,
        ctUnit,
        ingredientList,
        instructions,
        pic
      }
    ]
  });

  }

  render() {
    console.log(this.state);
    const NavbarRouter = withRouter(Navbar);
    return (
      <>
        <NavbarRouter/>
        <Switch>
          <Route 
            exact path="/"
            render={() => <Home/>}/>
          <Route
            path="/add"
            render={() => <Add addRecipe={this.addRecipe}/> }/>
          <Route
            path="/recipe"
            component={SingleRecipe}/>
        </Switch>
      </>
    );
  }
}

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

    render() {
      return (
        <div id="navbar" className="pt-2 pb-2">
          <Link to="/" id="homepage-btn" className="btn ml-3 no-box-shadow-focus fa-lg btn-light" type="button">
            <i className="fas fa-home"></i>
          </Link>
          <div className={(this.props.location.pathname === "/") ? "input-group w-50" : "input-group w-50 invisible"}>
            <div className="input-group-prepend">
              <i id="search-icon" className="fas fa-search input-group-text pt-2 fa-lg"></i>
            </div>
            <input id="searchbar" className="form-control form-control-override-border no-box-shadow-focus" type="text" placeholder="Search..."/>
          </div>
          <Link to="/add" id="add-entry-btn" className="btn btn-success mr-3 no-box-shadow-focus" type="button">
            <i className="fas fa-plus fa-lg"></i>
          </Link>
        </div>
      );
    }
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: this.props.entries
    }
  }
  render() {
    return (
      <div className="dynamic-body">
        <div id ="home-placeholder" className="pt-5">
          <i id="home-placeholder-pic" className="fas fa-book-open fa-9x"></i>
          <h1 id="home-placeholder-text" className="font-weight-bold">There's nothing here!<br/>Press the + button to start adding recipes<br/>Alternatively, press the populate button to set up example recipes</h1>
          <button id="populate-btn" className="no-box-shadow-focus btn btn-lg btn-warning mt-3 mx-auto" type="button">Populate</button>
          <Link to="/recipe" className="btn btn-warning" type="button">Recipe</Link>
        </div>
      </div>
    )
  }
}

class Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      cooktime: "",
      ctUnit: "",
      amount: "",
      unit: "",
      food: "",
      instructions: "",
      dropdownText: "Blank",
      placeholderSrc: blank,
      errorEnabled: false,
      errorMessage: "",
      showDropdown: false,
      ingredients: [

      ]
    };
    this.saveInput = this.saveInput.bind(this);
    this.storeIngredient = this.storeIngredient.bind(this);
    this.displayError = this.displayError.bind(this);
    this.toggleSelect = this.toggleSelect.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);
  }

  deleteIngredient(e) {
    let newAry = [...this.state.ingredients];
    newAry.splice(e.target.dataset.key, 1);

    this.setState({
      ingredients: newAry
    })
  }

  toggleDropdown() {
    this.setState({
      showDropdown: !this.state.showDropdown
    })
  }

  handleDropdownSelect(e) {
    let src;
    switch(e.target.innerText.toLowerCase()) {
      case "blank":
        src = blank;
        break;
      case "beef":
        src = beef;
        break;
      case "chicken":
        src = chicken;
        break;
      case "pasta":
        src = pasta;
        break;
      case "pork":
        src = pork;
        break;
      case "potato":
        src = potato;
        break;
      case "rice":
        src = rice;
        break;
      case "taco":
        src = taco;
        break;
      default:
        src = blank;
    }

    console.log(src);

    this.setState({
      dropdownText: e.target.innerText,
      placeholderSrc: src
    })
    this.toggleDropdown();
  }

  toggleSelect(e) {
    if (e.target.innerText === "Hour(s)") {
      this.setState({
        ctUnit: "hours"
      });
    } else if (e.target.innerText === "Minute(s)") {
      this.setState({
        ctUnit: "minutes"
      })
    }
  }

  displayError(errorMessage) {
    this.setState({
      errorEnabled: true,
      errorMessage
    })
  }

  storeIngredient() {
    const amountIsNum = (!isNaN(this.state.amount));
    const foodExists = (this.state.food !== "");

    if (amountIsNum && foodExists) {
      this.setState({
        amount: "",
        unit: "",
        food: "",
        errorEnabled: false,
        errorMessage: "",
        ingredients: [
          ...this.state.ingredients, {amount: this.state.amount, unit: this.state.unit, food: this.state.food}
        ]
      });
    } else if (!amountIsNum) {
      this.displayError("First ingredient field must be a number");
    } else if (!foodExists) {
      this.displayError("Third ingredient field must be filled");
    }
  }

  saveInput(e) {
    const name = e.target.dataset.name;
    const value = e.target.value;
      
    this.setState({
      [name] : value
    });
  }

  render() {
    console.log(this.state);
    let ingredientList
    if (this.state.ingredients.length > 0) {
      ingredientList = this.state.ingredients.map((obj, key) => {
        return (
          <div className="ml-3 mt-2" key={key}>
            <div className="d-inline-block ingredient-border">
              <p className="d-inline mr-2 ml-2 text-success font-weight-bold">{obj.amount} {obj.unit} {obj.food}</p>
              <button className="btn btn-light btn-sm font-weight-bold mr-2 mt-1 mb-1" data-key={key} type="button" onClick={(e) => {this.deleteIngredient(e)}}>X</button>
            </div>
          </div>
        );
      })
    } else {
      ingredientList = <div></div>
    }
  return (
    <div className="w-50 mx-auto">
      <div className={this.state.errorEnabled ? "toast fade show" : "toast fade hide"} role="alert" aria-live="assertive" aria-atomic="true">
      <div className="toast-body">{this.state.errorMessage}</div>
      </div>
      <h4 className="mt-3">Name</h4>
      <input id="name-input" className="form-control no-box-shadow-focus form-control-override-border" type="text" data-name="name" onChange={(e) => this.saveInput(e)}/>
      <h4 className="mt-2">Cook Time</h4>
      <div className="input-group w-25">
        <input id="cooktime-input" className="form-control no-box-shadow-focus form-control-override-border" data-name="cooktime" onChange={(e) => this.saveInput(e)} type="text"/>
        <div className="btn-group" role="group">
          <button id="hours-btn" className={(this.state.ctUnit === "hours") ? "btn btn-secondary no-box-shadow-focus bg-selected" : "btn btn-secondary no-box-shadow-focus"} type="button" onClick={(e) => {this.toggleSelect(e)}}>Hour(s)</button>
          <button id="minutes-btn" className={(this.state.ctUnit ==="minutes") ? "btn btn-secondary no-box-shadow-focus bg-selected" : "btn btn-secondary no-box-shadow-focus"} type="button" onClick={(e) => {this.toggleSelect(e)}}>Minute(s)</button>
        </div>
      </div>
      <h4 className="mt-2">Ingredients</h4>
      <div className="input-group">
        <input className="form-control no-box-shadow-focus form-control-override-border" value={this.state.amount} placeholder="1" data-name="amount" onChange={(e) => this.saveInput(e)}/>
        <input className="form-control no-box-shadow-focus form-control-override-border" value={this.state.unit} placeholder="cup" data-name="unit" onChange={(e) => this.saveInput(e)}/>
        <input className="form-control no-box-shadow-focus form-control-override-border" value={this.state.food} placeholder="rice" data-name="food" onChange={(e) => this.saveInput(e)}/>
        <button id="add-ingredient-btn" className="btn btn-success no-box-shadow-focus" type="button" onClick={this.storeIngredient}>
          <i className="fas fa-plus fa-lg"></i>
      </button>
      </div>
      <div>
        {ingredientList}
      </div>
      <h4 className="mt-2">Instructions</h4>
      <input className="form-control no-box-shadow-focus form-control-override-border" type="text" data-name="instructions" onChange={(e) => this.saveInput(e)}/>
      <h4 className="mt-2">Choose your picture</h4>
      <div className="dropdown">
        <button className="btn btn-secondary dropdown-toggle no-box-shadow-focus" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" onClick={this.toggleDropdown}>
          {this.state.dropdownText}
        </button>
        <div className={(this.state.showDropdown) ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="dropdownMenuButton" onClick={(e) => {this.handleDropdownSelect(e)}}>
          <a className="dropdown-item" href="#">Blank</a>
          <a className="dropdown-item" href="#">Beef</a>
          <a className="dropdown-item" href="#">Chicken</a>
          <a className="dropdown-item" href="#">Pasta</a>
          <a className="dropdown-item" href="#">Pork</a>
          <a className="dropdown-item" href="#">Potato</a>
          <a className="dropdown-item" href="#">Rice</a>
          <a className="dropdown-item" href="#">Taco</a>
        </div>
      </div>
      <img id="placeholder-pic" className="mt-3" src={this.state.placeholderSrc}/>
      <div className="mt-3">
        <Link to="/" className="btn btn-outline-success mr-4" onClick={() => this.props.addRecipe(this.state.name, this.state.cooktime, this.state.ctUnit, this.state.ingredients, this.state.instructions, this.state.placeholderSrc)}>Add</Link>
        <Link to="/" className="btn btn-outline-danger">Cancel</Link>
      </div>
    </div>
  )
}
}

class SingleRecipe extends React.Component {
  render() {
    return (
      <div className="w-50 mx-auto">
        <img id="single-recipe-pic" className="w-25 mx-auto mt-3" src={beef}/>
        <h2 className="text-center mt-2">Placeholder Name</h2>
        <div className="mt-5 w-50 mx-auto text-center">
          <h2 className="d-inline mr-3">Cook Time:</h2>
          <h2 className="d-inline">240 Minutes</h2>
        </div>
        <h2 className="text-center mt-5">Portion</h2>
        <div className="btn-group d-block text-center" role="group">
          <button className="btn btn-secondary" type="button">0.5</button>
          <button className="btn btn-secondary" type="button">1</button>
          <button className="btn btn-secondary" type="button">1.5</button>
          <button className="btn btn-secondary" type="button">2</button>
        </div>
        <h2 className="text-center mt-3">Ingredients</h2>
        <div className="text-center mt-3">
          <div>
            <input type="checkbox" name="ingredient1" id="ingredient1"/>
            <label className="ml-2 single-r-ingredient-item" htmlFor="ingredient1">Ingredient 1</label>
          </div>
          <div>
            <input type="checkbox" name="ingredient2" id="ingredient2"/>
            <label className="ml-2 single-r-ingredient-item" htmlFor="ingredient2">Ingredient 2</label>
          </div>
          <div>
            <input type="checkbox" name="ingredient3" id="ingredient3"/>
            <label className="ml-2 single-r-ingredient-item" htmlFor="ingredient3">Ingredient 3</label>
          </div>
          <div>
            <input type="checkbox" name="ingredient4" id="ingredient4"/>
            <label className="ml-2 single-r-ingredient-item" htmlFor="ingredient4">Ingredient 4</label>
          </div>
        </div>
        <h2 className="text-center mt-5">Instructions</h2>
        <p id="single-entry-instructions" className="text-center mt-3">Test instructions that run multiple lines.sdsadawdwcdwybdgdegyesesftfestfgsetcfetsftesftseftesftstefesfttfebftftsebfsefestfbsteftescfbefeffefebsfefteysfteeycfeunufeyeyfefefefefcfyfefesfefeffesfefefefefesfesfesfefefesfsefesnfesfessdsadawdwcdwybdgdegyesesftfestfgsetcfetsftesftseftesftstefesfttfebftftsebfsefestfbsteftescfbefeffefebsfefteysfteeycfeunufeyeyfefefefefcfyfefesfefeffesfefefefefesfesfesfefefesfsefesnfesfessdsadawdwcdwybdgdegyesesftfestfgsetcfetsftesftseftesftstefesfttfebftftsebfsefestfbsteftescfbefeffefebsfefteysfteeycfeunufeyeyfefefefefcfyfefesfefeffesfefefefefesfesfesfefefesfsefesnfesfessdsadawdwcdwybdgdegyesesftfestfgsetcfetsftesftseftesftstefesfttfebftftsebfsefestfbsteftescfbefeffefebsfefteysfteeycfeunufeyeyfefefefefcfyfefesfefeffesfefefefefesfesfesfefefesfsefesnfesfes</p>
      </div>
    );
  }
}

ReactDOM.render(
<BrowserRouter>
  <App/>
</BrowserRouter>,
rootElm
);