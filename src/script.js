//Recipe Book
//Author: Chris Meyring

/*
Used to store recipe entries with the following fields:
-Name
-Cook time
-Cook unit
-Ingredients
-Instructions
-Picture

Available features are as follows:
-Add recipe
-Look at catalogue of recipes
-Keep track of when you've last eaten a recipe
-Edit recipe
-Delete recipe
-Adjust portion sizes with multipliers 0.5, 1, 1.5, and 2
*/

import './style.sass';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link, Switch, withRouter, Redirect } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.css';
import blank from './assets/placeholder.jpg';
import beef from './assets/beef.png';
import pasta from './assets/pasta.jpeg';
import pork from './assets/ham.jpg';
import potato from './assets/potato.jpg';
import rice from './assets/rice.jpg';
import taco from './assets/taco.jpg';
import chess from './assets/chess.jpg';
import tictac from './assets/tictac.png';
import chicken from './assets/chicken.jpg';

const rootElm = document.getElementById('root');
let saveLog = localStorage.getItem('saveLog') ? JSON.parse(localStorage.getItem('saveLog')) : [];

//example recipes. Access by typing "devdoor" into the search bar
const examples = [
  {
    name: "Beef cubes w/ noodles",
    cookTime: 20,
    ctUnit: "Minute(s)",
    instructions: "Cut the beef into cubes, Oil the pan and cook the beef. Boil the water and place the noodles in until tender",
    lastEaten: "Never",
    picText: "beef",
    picTitle: "Beef",
    ingredientList: [
      {
        amount: 1,
        unit: "pound",
        food: "beef"
      },
      {
        amount: 1,
        unit: "package",
        food: "noodles"
      },
      {
        amount: 6,
        unit: "cups",
        food: "water"
      },
      {
        amount: 1,
        unit: "tablespoon",
        food: "oil"
      }
    ]
  },
  {
    name: "Boiled chicken w/ cheesse",
    cookTime: 1,
    ctUnit: "Minute(s)",
    instructions: "Bring water to boil and place chicken in water. After 30 seconds, add the cheese. Cook for remaining 30 seconds and serve.",
    lastEaten: "Never",
    picText: "chicken",
    picTitle: "Chicken",
    ingredientList: [
      {
        amount: 2,
        unit: "pounds",
        food: "chicken"
      },
      {
        amount: 3,
        unit: "cups",
        food: "cheese"
      },
      {
        amount: 4,
        unit: "cups",
        food: "water"
      }
    ]
  },
  {
    name: "Sweet pasta",
    cookTime: 15,
    ctUnit: "Minute(s)",
    instructions: "Take pasta, sugar, brown sugar, maple syrup and put in blender for 15 minutes. Serve hot.",
    lastEaten: "Never",
    picText: "pasta",
    picTitle: "Pasta",
    ingredientList: [
      {
        amount: 1,
        unit: "pound",
        food: "pasta (cooked)"
      },
      {
        amount: 1,
        unit: "tablespoon",
        food: "sugar",
      },
      {
        amount: 2,
        unit: "cups",
        food: "brown sugar"
      },
      {
        amount: 4,
        unit: "tablespoons",
        food: "maple syrup"
      }
    ]
  },
  {
    name: "Pork pork",
    cookTime: 18,
    ctUnit: "Hour(s)",
    instructions: "Grind pork, leave other pork intact. Pound the ground pork into the approximately 1 pound of unground pork. Cook until pounded ground pork is browned on all sides and unpound ground pork comes to an internal temperature of 120 degrees. Serve with unmelted butter",
    lastEaten: "Never",
    picText: "pork",
    picTitle: "Pork",
    ingredientList: [
      {
        amount: 1,
        unit: "cup",
        food: "pork"
      },
      {
        amount: 3,
        unit: "pounds",
        food: "pork"
      },
      {
        amount: 2,
        unit: "tablespoons",
        food: "butter"
      }
    ]
  },
  {
    name: "Peanutbutter potato pie",
    cookTime: 3,
    ctUnit: "Hour(s)",
    instructions: "I have no experience baking pies. If you cook all ingredients and mash it into the pie crust it should turn out fine, I think.",
    lastEaten: "Never",
    picText: "potato",
    picTitle: "Potato",
    ingredientList: [
      {
        amount: 1,
        unit: "cup",
        food: "peanutbutter"
      },
      {
        amount: 5,
        unit: "cups",
        food: "potato"
      },
      {
        amount: 1,
        unit: "pie",
        food: "crust"
      },
      {
        amount: 2,
        unit: "tablespoons",
        food: "sugar"
      }
    ]
  },
  {
    name: "Chess-y rice",
    cookTime: 1,
    ctUnit: "Hour(s)",
    instructions: "Grab board, place half ingredients on one side and half on the opposite side. Take your turn, realize there is no friend in the ingredient list. Play chess by yourself, eat rice and contemplate life",
    lastEaten: "Never",
    picText: "chess",
    picTitle: "Chess",
    ingredientList: [
      {
        amount: 2,
        food: "kings"
      },
      {
        amount: 2,
        food: "queens"
      },
      {
        amount: 4,
        food: "rooks"
      },
      {
        amount: 4,
        food: "bishops"
      },
      {
        amount: 4,
        food: "knights"
      },
      {
        amount: 16,
        food: "pawns"
      },
      {
        amount: 12,
        unit: "cups",
        food: "rice"
      }
    ]
  },
  {
    name: "Tic-tac taco",
    cookTime: 4,
    ctUnit: "Hour(s)",
    instructions: "Eat taco for nourishment. Combine rest of ingredients in order. Repeat until out of tacos or frustrated",
    lastEaten: "Never",
    picText: "tictac",
    picTitle: "Tictac",
    ingredientList: [
      {
        amount: 1,
        unit: "bottom-left",
        food: "X"
      },
      {
        amount: 1,
        unit: "center",
        food: "O"
      },
      {
        amount: 1,
        unit: "top-right",
        food: "X"
      },
      {
        amount: 1,
        unit: "bottom-right",
        food: "O"
      },
      {
        amount: 1,
        unit: "top-left",
        food: "X"
      },
      {
        amount: 3,
        food: "tacos"
      }
    ]
  }
];

const handlePicDisplay = (str) => {
  let src;
  switch (str) {
    case "tictac":
      src = tictac;
      break;
    case "chess":
      src = chess;
      break;
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
      entries: this.props.saveLog,
      searchMatchEntries: []
    };

    this.addRecipe = this.addRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
    this.updateLastEaten = this.updateLastEaten.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.overwriteRecipe = this.overwriteRecipe.bind(this);
    this.num2frac = this.num2frac.bind(this);
    this.saveEntryList = this.saveEntryList.bind(this);
    this.setExampleEntries = this.setExampleEntries.bind(this);
  }

  setExampleEntries() {
    this.setState({
      entries: this.props.examples,
      search: ""
    }, this.saveEntryList);
  }

  saveEntryList() {
    localStorage.setItem('saveLog', JSON.stringify(this.state.entries));
  }

  //determines if value has a float. if it does, transforms float into a fraction and returns the new value
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
    const searchMatch = this.state.entries.filter(entry => {
      return entry.name.toLowerCase().includes(searchStr.toLowerCase());
    });

    this.setState({
      search: searchStr,
      searchMatchEntries: searchMatch
    });
  }

  updateLastEaten(e) {
    const newAry = [...this.state.entries];
    const date = new Date();
    newAry[e.target.dataset.id].lastEaten = date.toDateString();
    this.setState({
      entries: newAry
    }, this.saveEntryList);
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
    }, this.saveEntryList);
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
    }, this.saveEntryList);
  }

  deleteRecipe(e) {
    const newAry = [...this.state.entries];
    newAry.splice(e.target.dataset.id, 1);
    this.setState({
      entries: newAry
    }, this.saveEntryList);
  }

  render() {
    const results = (this.state.search !== "") ? this.state.searchMatchEntries : this.state.entries;
    return (
      <>
        <Navbar updateSearch={this.updateSearch} search={this.state.search} setExampleEntries={this.setExampleEntries}/>
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
        <div id="devdoor-container" className={this.props.search === "devdoor" ? "d-block" : "d-none"}>
          <button className="btn btn-lg btn-danger d-block mx-auto" onClick={this.props.setExampleEntries}>Example Entries</button>
          <p className="text-center mt-2 text-danger font-weight-bold">Do not click! <br/>Will overwrite your recipes!</p>
        </div>
        <div className={(this.props.location.pathname === "/") ? "input-group w-50" : "input-group w-50 invisible"}>
          <div className="input-group-prepend">
            <i className="fas fa-search input-group-text pt-2 fa-lg"></i>
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
      idToDelete: 0,
      showModal: false
    }
    this.storeId = this.storeId.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal() {
    this.setState({
      showModal: true
    })
  }

  hideModal(e) {
    if (!e.target.className.includes('content')) {
      this.setState({
        showModal: false
      });
    }
  }

  storeId(e) {
    this.setState({
      idToDelete: e.target.dataset.id
    });
  }

  render() {
    let homeBody;

    if (this.props.entries.length === 0 && this.props.search !== "") {
      homeBody = <NoSearchResultsFound></NoSearchResultsFound>;
    } else if (this.props.entries.length === 0) {
      homeBody = <Placeholder></Placeholder>;
    } else {
      homeBody = 
        <>
            <div id="modal" className={this.state.showModal ? "d-block modal show drag-into-screen fade-opacity" : "d-block modal"} tabIndex="-1" onClick={(e) => {this.hideModal(e)}}>
              <div className="modal-dialog" role="document">
                <div className={this.state.showModal ? "modal-content content fade-opacity" : "modal-content content"}>
                  <div className="modal-body content">
                    <p className="content">Are you sure?</p>
                  </div>
                  <div className="modal-footer content">
                    <button type="button" className="btn btn-danger" data-id={this.state.idToDelete} onClick={(e) => {this.props.deleteRecipe(e)}}>Yes</button>
                    <button type="button" className="btn btn-secondary">No</button>
                  </div>
                </div>
              </div>
            </div>
          <div className="row w-75 mx-auto mt-5">
            <RecipeList rList={this.props.entries} updateLastEaten={this.props.updateLastEaten} storeId={this.storeId} showModal={this.showModal}></RecipeList>
          </div>
        </>
    }

    return homeBody;
  }
}

const NoSearchResultsFound = () => {
  return (
    <div className="h-100 pt-5 light-pink-bg">
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
        <Link to="add" className="no-box-shadow-focus btn btn-lg btn-success mt-3" type="button">Add First Entry</Link>
      </div>
    </div>
  </div>
  );
}

const RecipeList = (props) => {
  return props.rList.map((recipe, id) => {
    return <Recipe name={recipe.name} picText={recipe.picText} id={id} key={`recipe${id}`} lastEaten={recipe.lastEaten} storeId={props.storeId} updateLastEaten={props.updateLastEaten} showModal={props.showModal}></Recipe>
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
    const {name, picText, id, lastEaten, updateLastEaten, storeId, showModal} = this.props;
    return (
      <div className="col-4 mb-5">
        <div className="card">
          <Link className="no-text-decoration" to={id.toString()}>
            <img src={handlePicDisplay(picText)} className="card-img-top mb-3 home-recipe-thumbnail"/>
          </Link>
          <h3 className="card-title text-center mb-3">{name}</h3>
          <p className="card-text text-center">{`Last Eaten: ${lastEaten}`}</p>
          <div className="d-flex justify-content-around mb-3">
            <a href="#" className="card-link d-inline" data-id={id} onClick={(e) => {updateLastEaten(e)}}>Just Ate</a>
            <a href="#" className="card-link d-inline" data-id={id} onClick={(e) => {storeId(e);showModal()}}>Delete</a>
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
      const {name, cookTime, ctUnit, instructions, lastEaten} = this.props.recipe
      this.setState({
        name,
        cookTime,
        ctUnit,
        instructions,
        dropdownText: this.props.recipe.picTitle,
        placeholderSrc: this.props.recipe.picText,
        ingredients: this.cloneIngredientList(),
        lastEaten,
        index: this.props.id
      });
    }
  }

  validateFields() {
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
    const ingredientList = this.state.ingredients.map((obj, key) => {
      return (
          <div className="d-flex justify-content-between center-align list-group-item" key={key}>
            <p className="mb-0 font-weight-bold">{this.props.num2frac(obj.amount)} {obj.unit} {obj.food}</p>
            <button className="btn btn-light btn-sm font-weight-bold delete-ingredient-btn" data-id={key} type="button" onClick={(e) => { this.deleteIngredient(e) }}>X</button>
          </div>
      );
    });

    return (
      <div className="w-50 mx-auto">
        {redirect}
        <div id="error-toast" className={this.state.errorEnabled ? "error-toast show text-center rounded-lg w-50 fade-opacity" : "error-toast text-center rounded-lg w-50"} role="alert" aria-live="assertive" aria-atomic="true">
          <div id="error-text" className="toast-body text-danger font-weight-bold">{this.state.errorMessage}</div>
        </div>
        <h4 className="mt-3">Name</h4>
        <input id="name-input" className="form-control no-box-shadow-focus form-control-override-border" value={this.state.name} type="text" data-name="name" onChange={(e) => this.saveInput(e)} />
        <h4 className="mt-2">Cook Time</h4>
        <div className="input-group w-25">
          <input id="cooktime-input" className="form-control no-box-shadow-focus form-control-override-border" value={this.state.cookTime} data-name="cookTime" onChange={(e) => this.saveInput(e)} type="text" />
          <div className="btn-group" role="group">
            <button id="hours-btn" className={(this.state.ctUnit === "Hour(s)") ? "btn bg-selected no-box-shadow-focus no-border-radius text-white" : "btn btn-secondary no-box-shadow-focus no-border-radius "} type="button" onClick={(e) => { this.toggleCookTimeUnit(e) }}>Hour(s)</button>
            <button id="minutes-btn" className={(this.state.ctUnit === "Minute(s)") ? "btn bg-selected no-box-shadow-focus text-white" : "btn btn-secondary no-box-shadow-focus"} type="button" onClick={(e) => { this.toggleCookTimeUnit(e) }}>Minute(s)</button>
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
        <div className="ml-3 mt-2 list-group">
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
        <div className="mt-3 mb-5">
          <button className="btn btn-outline-success mr-4" onClick={this.validateFields}>{this.props.recipe ? "Save Changes" : "Add"}</button>
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
    let recipe = this.props.recipe;
    let ingredientList = (recipe.ingredientList.length === 0) ? <h4>N/A</h4> : recipe.ingredientList.map((entry, key) => {
      return (
      <div className="mb-2" key={key}>
        <input className="mr-2 d-inline" id={`ingredient${key}`} type="checkbox"/>
        <label htmlFor={`ingredient${key}`} className="d-inline">{this.props.num2frac(entry.amount * this.state.portion)} {entry.unit} {entry.food}</label>
      </div>
      );
    });

    return (
      <div className="container mt-5">
        <div id="img-header-single">
        <img className="img-fluid" src={handlePicDisplay(recipe.picText)}/>
        </div>
        <h1 className="mt-4 text-center mb-5">{recipe.name}</h1>
        <div className="row justify-content-between mb-5">
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title mb-4">
                  <h3>Ingredients</h3>
                </div>
                <h5>Portion</h5>
                <div className="btn-group mb-5">
                  <button className={(this.state.portion === 0.5) ? "btn btn-secondary bg-selected ": "btn btn-secondary"} onClick={() => {this.updatePortion(.5)}} type="button">0.5</button>
                  <button className={(this.state.portion === 1) ? "btn btn-secondary bg-selected ": "btn btn-secondary"} onClick={() => {this.updatePortion(1)}} type="button">1</button>
                  <button className={(this.state.portion === 1.5) ? "btn btn-secondary bg-selected": "btn btn-secondary"} onClick={() => {this.updatePortion(1.5)}} type="button">1.5</button>
                  <button className={(this.state.portion === 2) ? "btn btn-secondary bg-selected": "btn btn-secondary"} onClick={() => {this.updatePortion(2)}} type="button">2</button>
                </div>
                <div>
                  {ingredientList}
                </div>
              </div>
            </div>
          </div>
          <div className="col-7">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-4">
                  <h3 className="card-title">Instructions</h3>
                  <h5 className="align-self-center">Cooktime: {recipe.cookTime || "N/A"} {recipe.ctUnit}</h5>
                </div>
                <p className="card-text">{recipe.instructions || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
        <Link className="btn btn-outline-primary btn-block" to={`${this.props.currentUrl}/edit`}>Edit</Link>
      </div>
    );
  }
}

const Navbar = withRouter(NavbarComponent)

ReactDOM.render(
  <BrowserRouter>
    <App saveLog={saveLog} examples={examples}/>
  </BrowserRouter>,
  rootElm
);