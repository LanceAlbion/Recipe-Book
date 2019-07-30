//Recipe Book
//Author: Chris Meyring

import './style.sass';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link, Switch, withRouter, Redirect } from "react-router-dom";
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

const handlePicDisplay = (str) => {
  let src;
  switch (str) {
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
  return src;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      entries: [

      ],
      searchMatchEntries: [

      ]
    };

    this.addRecipe = this.addRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
    this.updateLastEaten = this.updateLastEaten.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.overwriteRecipe = this.overwriteRecipe.bind(this);
    this.num2frac = this.num2frac.bind(this);
  }

  num2frac(value) {
    if (value % 1 === 0) {
      return value;
    }
    let splitAry = value.toString().split(".");
    let decValue = splitAry[1].slice(0, 2);
    let beforeDec = (splitAry[0] === "0") ? "" : splitAry[0];
    decValue = (decValue.length === 1) ? decValue + "0" : decValue;
    decValue = Number(decValue);

    if (decValue === 33) {
      return beforeDec + " 1/3";
    } else if (decValue === 66) {
      return beforeDec + " 2/3";
    } else {
      let testNum = 1;
      let gcd;
      let numerator;
      let denominator;
      while (testNum <= decValue) {
        if ((decValue / testNum) % 1 === 0 && (100 / testNum) % 1 === 0) {
          gcd = testNum;
        }
      testNum++;
      }
      if (gcd) {
        numerator = decValue / gcd;
        denominator = 100 / gcd;
        return (beforeDec + " " + numerator + "/" + denominator);
      } else {
        return beforeDec + " " + decValue + "/" + 100;
      }
    }
  }

  updateSearch(e) {
    const searchStr = e.target.value;
    let searchMatch = this.state.entries.filter(entry => {
      return entry.name.toLowerCase().includes(searchStr.toLowerCase());
    });

    this.setState({
      search: searchStr,
      searchMatchEntries: searchMatch
    });
  }

  updateLastEaten(e) {
    let newAry = [...this.state.entries];
    const date = new Date();
    newAry[e.target.dataset.id].lastEaten = date.toDateString();
    this.setState({
      entries: newAry
    })
  }

  addRecipe(name, cookTime, ctUnit, ingredientList, instructions, lastEaten, picText, picTitle) {
    this.setState({
      entries: [
        ...this.state.entries,
        {
          name,
          cookTime,
          ctUnit,
          ingredientList,
          instructions,
          picText,
          picTitle,
          lastEaten
        }
      ]
    });
  }

  overwriteRecipe(name, cookTime, ctUnit, ingredientList, instructions, lastEaten, picText, picTitle, index) {
    const newAry = [...this.state.entries];
    const newRecipe = {
      name,
      cookTime,
      ctUnit,
      ingredientList,
      instructions,
      picText,
      picTitle,
      lastEaten
    }
    newAry.splice(index, 1, newRecipe);

    this.setState({
      entries: newAry
    });
  }

  deleteRecipe(e) {
    let newAry = [...this.state.entries];
    newAry.splice(e.target.dataset.id, 1);
    this.setState({
      entries: newAry
    });
  }

  render() {
    console.log(this.state);
    const results = (this.state.search !== "") ? this.state.searchMatchEntries : this.state.entries;
    return (
      <>
        <Navbar updateSearch={this.updateSearch} search={this.state.search}/>
        <Switch>
          <Route
            exact path="/"
            render={() => <Home entries={results} search={this.state.search} deleteRecipe={this.deleteRecipe} updateLastEaten={this.updateLastEaten}/>} />
          <Route
            path="/add"
            render={() => <Add onSubmit={this.addRecipe} num2frac={this.num2frac}/>} />
          <Route
            exact path="/:id"
            render={({match}) => <SingleRecipe recipe={this.state.entries[match.params.id]} num2frac={this.num2frac} currentUrl={match.url}/>} />
            <Route
            path="/:id/edit"
            render={({match}) => <Add onSubmit={this.overwriteRecipe} num2frac={this.num2frac} currentUrl={match.params.id} id={match.params.id} recipe={this.state.entries[match.params.id]} />} />
        </Switch>
      </>
    );
  }
}

class NavbarComponent extends React.Component {
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
          <input id="searchbar" className="form-control form-control-override-border no-box-shadow-focus" value={this.props.search} type="text" placeholder="Search..." onChange={(e) => {this.props.updateSearch(e)}}/>
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

    }
  }
  render() {
    let homeBody;
    if (this.props.entries.length === 0 && this.props.search !== "") {
      homeBody = <NoSearchResultsFound></NoSearchResultsFound>;
    } else if (this.props.entries.length === 0) {
      homeBody = <Placeholder></Placeholder>;
    } else {
      homeBody = <div className="row w-75 mx-auto"><RecipeList rList={this.props.entries} deleteRecipe={this.props.deleteRecipe} updateLastEaten={this.props.updateLastEaten}></RecipeList></div>;
    }
    return homeBody;
  }
}

const NoSearchResultsFound = () => {
  return (
    <div className="mt-5 pt-5">
      <h1 className="text-center light-gray-font font-weight-bold">No matches found</h1>
    </div>
  );
}

const Placeholder = () => {
  return (
  <div className="dynamic-body">
    <div id="home-placeholder" className="pt-5">
      <i id="home-placeholder-pic" className="fas fa-book-open fa-9x"></i>
      <h1 id="home-placeholder-text" className="font-weight-bold light-gray-font">There's nothing here!<br />Press the + at the top of the screen or the <br/> button below to start adding recipes</h1>
      <div className="d-block text-center">
        <Link to="add" className="no-box-shadow-focus btn btn-lg btn-info mt-3" type="button">Add First Entry</Link>
      </div>
    </div>
  </div>
  );
}

const RecipeList = (props) => {
  return props.rList.map((recipe, id) => {
    return <Recipe name={recipe.name} picText={recipe.picText} id={id} key={`recipe${id}`} lastEaten={recipe.lastEaten} deleteRecipe={props.deleteRecipe} updateLastEaten={props.updateLastEaten}></Recipe>
  });
}

class Recipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDisplayed: false
    }
    this.showConfirm = this.showConfirm.bind(this);
    this.hideConfirm = this.hideConfirm.bind(this);
  }

  showConfirm() {
    this.setState({
      confirmDisplayed: true
    });
  }

  hideConfirm() {
    this.setState({
      confirmDisplayed: false
    })
  }

  render() {
    return (
      <div className="col-3 mt-4">
        <div className="card">
          <div className="card-header d-flex justify-content-between entry-header">
            <div className={(this.state.confirmDisplayed) ? "d-inline-block" : "d-inline-block invisible"}>
              <h5 className="d-inline">Are you sure?</h5>
              <button className="btn btn-outline-secondary ml-2 btn-sm" data-id={this.props.id} type="button" onClick={(e) => {this.hideConfirm();this.props.deleteRecipe(e)}}>Yes</button>
              <button className="btn btn-outline-secondary ml-2 btn-sm" type="button" onClick={this.hideConfirm}>No</button>
            </div>
            <button className="btn btn-sm delete-entry-btn" type="button" onClick={this.showConfirm}>X</button>
          </div>
          <Link className="home-entry-pic" to={this.props.id.toString()}>
          <img className="home-entry-pic" src={handlePicDisplay(this.props.picText)} data-id={this.props.id}/>
          </Link>
          <div className="card-body border-top">
            <h2 className="card-title text-center font-weight-bold entry-card-text">{(this.props.name || "N/A")}</h2>
          </div>
          <div className="card-footer entry-footer">
            <h3 className="text-center">Last Eaten: {this.props.lastEaten}</h3>
            <button className="btn btn-lg btn-block just-ate-btn" type="button" data-id={this.props.id} onClick={(e) => {this.props.updateLastEaten(e)}}>Just Ate</button>
          </div>
        </div>
      </div>
    );
  }
}

class Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      cookTime: "",
      ctUnit: "",
      amount: "",
      unit: "",
      food: "",
      instructions: "",
      dropdownText: "Blank",
      placeholderSrc: "blank",
      errorEnabled: false,
      errorMessage: "",
      showDropdown: false,
      ingredients: [],
      lastEaten: "Never",
      index: null,
      redirect: false
    };
    this.saveInput = this.saveInput.bind(this);
    this.storeIngredient = this.storeIngredient.bind(this);
    this.displayError = this.displayError.bind(this);
    this.toggleCookTimeUnit = this.toggleCookTimeUnit.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);
    this.cloneIngredientList = this.cloneIngredientList.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }

  componentDidMount() {
    if (this.props.recipe) {
      this.setState({
        name: this.props.recipe.name,
        cookTime: this.props.recipe.cookTime,
        ctUnit: this.props.recipe.ctUnit,
        instructions: this.props.recipe.instructions,
        dropdownText: this.props.recipe.picTitle,
        placeholderSrc: this.props.recipe.picText,
        ingredients: this.cloneIngredientList(),
        lastEaten: this.props.recipe.lastEaten,
        index: this.props.id
      });
    }
  }

  validateFields() {
    console.log(this.state.cookTime !== "");
    if (isNaN(this.state.cookTime)) {
      this.displayError("Cook time must be a number");
    } else if (!isNaN(this.state.cookTime) && this.state.ctUnit === "" && this.state.cookTime !== "") {
      this.displayError("A cook unit must be selected when cook time is provided");
    } else if (this.state.ctUnit !== "" && this.state.cookTime === "") {
      this.displayError("A cook time must be selected when cook unit is provided");
    } else {
      this.displayError("Cook time is a required field and must be a number");

      this.props.onSubmit(this.state.name, this.state.cookTime, this.state.ctUnit, this.state.ingredients, this.state.instructions, this.state.lastEaten, this.state.placeholderSrc, this.state.dropdownText, this.state.index);
      this.setState({
        redirect: true
      });
    }
  }

  cloneIngredientList() {
    if (this.props.recipe) {
      const list = this.props.recipe.ingredientList;
      const newAry = [];

      for (let i = 0; i < list.length; i++) {
        newAry.push({amount: list[i].amount, unit: list[i].unit, food: list[i].food});
      }

      return newAry;
    } else {
      return [];
    }
  }

  deleteIngredient(e) {
    let newAry = [...this.state.ingredients];
    newAry.splice(e.target.dataset.id, 1);

    this.setState({
      ingredients: newAry
    })
  }

  toggleDropdown() {
    this.setState({
      showDropdown: !this.state.showDropdown
    });
  }

  handleDropdownSelect(e) {
    this.setState({
      dropdownText: e.target.innerText,
      placeholderSrc: e.target.innerText.toLowerCase()
    })
    this.toggleDropdown();
  }

  toggleCookTimeUnit(e) {
    if (e.target.innerText === "Hour(s)" && this.state.ctUnit === "Hour(s)") {
      this.setState({
        ctUnit: ""
      });
    } else if (e.target.innerText === "Hour(s)" && this.state.ctUnit !== "Hour(s)") {
      this.setState({
        ctUnit: "Hour(s)"
      });
    } else if (e.target.innerText === "Minute(s)" && this.state.ctUnit === "Minute(s)") {
      this.setState({
        ctUnit: ""
      });
    } else if (e.target.innerText == "Minute(s)" && this.state.ctUnit !== "Minute(s)") {
      this.setState({
        ctUnit: "Minute(s)"
      });
    }
  }

  displayError(errorMessage) {
    this.setState({
      errorEnabled: true,
      errorMessage
    });
  }

  storeIngredient() {
    const amountIsNum = (!isNaN(this.state.amount) && (this.state.amount !== "") && (this.state.amount.indexOf("/") === -1));
    const foodExists = (this.state.food !== "");

    if (amountIsNum && foodExists) {
    
      this.setState({
        amount: "",
        unit: "",
        food: "",
        errorEnabled: false,
        ingredients: [
          ...this.state.ingredients, { amount: this.state.amount, unit: this.state.unit, food: this.state.food, }
        ]
      });
    } else if (!amountIsNum) {
      this.displayError("First ingredient field must be a number. Non whole numbers must be a decimal value");
    } else if (!foodExists) {
      this.displayError("Third ingredient field must be filled");
    }
  }

  saveInput(e) {
    const name = e.target.dataset.name;
    const value = e.target.value;

    this.setState({
      [name]: value
    });
  }

  render() {
    const redirect = this.state.redirect ? <Redirect to="/"></Redirect> : null
    let ingredientList = this.state.ingredients.map((obj, key) => {
      return (
          <div className="d-flex justify-content-between center-align list-group-item light-gray-background" key={key}>
            <p className="mb-0 font-weight-bold">{this.props.num2frac(obj.amount)} {obj.unit} {obj.food}</p>
            <button className="btn btn-light btn-sm font-weight-bold delete-ingredient-btn" data-id={key} type="button" onClick={(e) => { this.deleteIngredient(e) }}>X</button>
          </div>
      );
    });

    return (
      <div className="w-50 mx-auto">
        {redirect}
        <div className={this.state.errorEnabled ? "toast fade show full-width text-center mt-2" : "toast fade hide full-width text-center mt-2"} role="alert" aria-live="assertive" aria-atomic="true">
          <div id="error-text" className="toast-body text-danger font-weight-bold">{this.state.errorMessage}</div>
        </div>
        <h4 className="mt-3">Name</h4>
        <input id="name-input" className="form-control no-box-shadow-focus form-control-override-border" value={this.state.name} type="text" data-name="name" onChange={(e) => this.saveInput(e)} />
        <h4 className="mt-2">Cook Time</h4>
        <div className="input-group w-25">
          <input id="cooktime-input" className="form-control no-box-shadow-focus form-control-override-border" value={this.state.cookTime} data-name="cookTime" onChange={(e) => this.saveInput(e)} type="text" />
          <div className="btn-group" role="group">
            <button id="hours-btn" className={(this.state.ctUnit === "Hour(s)") ? "btn btn-secondary no-box-shadow-focus bg-selected no-border-radius" : "btn btn-secondary no-box-shadow-focus no-border-radius"} type="button" onClick={(e) => { this.toggleCookTimeUnit(e) }}>Hour(s)</button>
            <button id="minutes-btn" className={(this.state.ctUnit === "Minute(s)") ? "btn btn-secondary no-box-shadow-focus bg-selected" : "btn btn-secondary no-box-shadow-focus"} type="button" onClick={(e) => { this.toggleCookTimeUnit(e) }}>Minute(s)</button>
          </div>
        </div>
        <h4 className="mt-2">Ingredients</h4>
        <div className="input-group">
          <input className="form-control no-box-shadow-focus form-control-override-border" value={this.state.amount} placeholder="1" data-name="amount" onChange={(e) => this.saveInput(e)} />
          <input className="form-control no-box-shadow-focus form-control-override-border" value={this.state.unit} placeholder="cup" data-name="unit" onChange={(e) => this.saveInput(e)} />
          <input className="form-control no-box-shadow-focus form-control-override-border" value={this.state.food} placeholder="rice" data-name="food" onChange={(e) => this.saveInput(e)} />
          <button id="add-ingredient-btn" className="btn btn-success no-box-shadow-focus" type="button" onClick={this.storeIngredient}>
            <i className="fas fa-plus fa-lg"></i>
          </button>
        </div>
        <div className="w-50 ml-3 mt-2 list-group">
          {ingredientList}
        </div>
        <p><small className="text-primary">Non whole numbers must be a decimal value</small></p>
        <h4 className="mt-2">Instructions</h4>
        <input className="form-control no-box-shadow-focus form-control-override-border" value={this.state.instructions} type="text" data-name="instructions" onChange={(e) => this.saveInput(e)} />
        <h4 className="mt-2">Choose your picture</h4>
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle no-box-shadow-focus" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" onClick={this.toggleDropdown}>
            {this.state.dropdownText}
          </button>
          <div className={(this.state.showDropdown) ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="dropdownMenuButton" onClick={(e) => { this.handleDropdownSelect(e) }}>
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
        <img id="placeholder-pic" className="mt-3" src={handlePicDisplay(this.state.placeholderSrc)} />
        <div className="mt-3">
          <button className="btn btn-outline-success mr-4" onClick={this.validateFields}>Add</button>
          <Link to="/" className="btn btn-outline-danger">Cancel</Link>
        </div>
      </div>
    )
  }
}

class SingleRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      portion: 1
    }
    this.updatePortion = this.updatePortion.bind(this);
  }

  updatePortion(value) {
    this.setState({
      portion: value
    });
  }

  render() {
    let ingredientList = (this.props.recipe.ingredientList.length === 0) ? <h4 className="text-center">N/A</h4> : this.props.recipe.ingredientList.map((entry, key) => {
      return (
      <div className="text-center" key={key}>
        <input type="checkbox" id={`ingredient${key}`} name={`ingredient${key}`}/>
        <label className="ml-2 single-r-ingredient-item" htmlFor={`ingredient${key}`}>{this.props.num2frac(entry.amount * this.state.portion)} {entry.unit} {entry.food}</label>
      </div>
      );
    });
    return (
    <div className="mt-4">
      <div className="card w-50 mx-auto">
        <img className=" card-img-top w-50 mx-auto d-block mt-4" src={handlePicDisplay(this.props.recipe.picText)}/>
          <div className="card-body">
            <h2 className="text-center">Name</h2>
            <h4 className="text-center">{this.props.recipe.name || "N/A"}</h4>
            <h2 className="text-center mt-4">Cook Time</h2>
            <h4 className="text-center">{this.props.recipe.cookTime || "N/A"} {this.props.recipe.ctUnit}</h4>
            <h2 className="text-center mt-4">Portion</h2>
            <div className="d-flex justify-content-center">
              <div className="btn-toolbar">
                <button className={(this.state.portion === 0.5) ? "btn btn-secondary bg-selected no-border-radius": "btn btn-secondary no-border-radius"} onClick={() => {this.updatePortion(.5)}} type="button">0.5</button>
                <button className={(this.state.portion === 1) ? "btn btn-secondary bg-selected no-border-radius": "btn btn-secondary no-border-radius"} onClick={() => {this.updatePortion(1)}} type="button">1</button>
                <button className={(this.state.portion === 1.5) ? "btn btn-secondary bg-selected no-border-radius": "btn btn-secondary no-border-radius"} onClick={() => {this.updatePortion(1.5)}} type="button">1.5</button>
                <button className={(this.state.portion === 2) ? "btn btn-secondary bg-selected no-border-radius": "btn btn-secondary no-border-radius"} onClick={() => {this.updatePortion(2)}} type="button">2</button>
              </div>
            </div>
            <h2 className="text-center mt-4">Ingredients</h2>
            <div>
              {ingredientList}
            </div>
            <h2 className="text-center mt-4">Instructions</h2>
            <h4 className="text-center">{this.props.recipe.instructions || "N/A"}</h4>
            <Link to={`${this.props.currentUrl}/edit`} className="btn btn-primary mt-4 w-50 mx-auto d-block">Edit</Link>
          </div>
      </div>
    </div>
    );
  }
}

const Navbar = withRouter(NavbarComponent)

ReactDOM.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>,
  rootElm
);