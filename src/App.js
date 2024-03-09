import React from "react";

class App extends React.Component {
  render() {
    // Add your code here
    return (
      <div className="app">
        {/* <Counter /> */}
        <h1>Classy Weather</h1>
        <Search />
        <Loader />
        <ForcastList />
      </div>
    );
  }
}
export default App;

// class Counter extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       count: 0,
//     };
//     this.handleDecrement = this.handleDecrement.bind(this);
//     this.handleIncrement = this.handleIncrement.bind(this);
//   }

//   handleDecrement() {
//     this.setState((currentState) => {
//       return { count: currentState.count - 1 };
//     });
//   }

//   handleIncrement() {
//     this.setState((currentState) => {
//       return { count: currentState.count + 1 };
//     });
//   }
//   render() {
//     return (
//       <React.Fragment>
//         <button onClick={this.handleDecrement}>-</button>
//         <span>{this.state.count}</span>
//         <button onClick={this.handleIncrement}>+</button>
//       </React.Fragment>
//     );
//   }
// }

class Search extends React.Component {
  render() {
    return <input type="search" placeholder="search from location" />;
  }
}

class Loader extends React.Component {
  render() {
    return <span className="loader">Loading</span>;
  }
}

class ForcastList extends React.Component {
  render() {
    return <h2> Weather City</h2>;
  }
}
