import React from "react";

class App extends React.Component {
  state = {
    isLoading: false,
    cityName: "",
    weather: {},
  };
  constructor(props) {
    super(props);
    this.getWeather = this.getWeather.bind(this);
    this.convertToFlag = this.convertToFlag.bind(this);
  }

  convertToFlag(countryCode) {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  }
  async getWeather(location) {
    try {
      this.setState({
        isLoading: true,
      });
      // 1) Getting location (geocoding)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
      );
      const geoData = await geoRes.json();
      console.log(geoData);

      if (!geoData.results) throw new Error("Location not found");

      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);
      this.setState({
        cityName: `${name} ${this.convertToFlag(country_code)}`,
      });
      // console.log(`${name} ${this.convertToFlag(country_code)}`);

      // 2) Getting actual weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();
      console.log(weatherData.daily);
      for (let i = 0; i < 7; i++) {
        const test = {};
        for (const key of Object.keys(weatherData.daily)) {
          test[key] = weatherData.daily[key][i];
          // console.log(weatherData.daily[key][i]);
        }
        console.log(test);
      }
      this.setState({
        weather: weatherData.daily,
      });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    return (
      <div className="app">
        {/* <Counter /> */}
        <h1>Classy Weather</h1>
        <Search getWeather={this.getWeather} cityName={this.state.cityName} />
        {this.state.isLoading && <Loader />}
        {!this.state.isLoading && this.state.cityName && (
          <ForcastList
            city={this.state.cityName}
            weather={this.state.weather}
          />
        )}
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
  state = {
    query: "",
  };
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(newQuery) {
    this.setState({ query: newQuery });
  }

  render() {
    return (
      <React.Fragment>
        <input
          type="search"
          placeholder="Search from location..."
          value={this.state.query}
          onChange={(e) => this.handleChange(e.target.value)}
          // onChange={(e) => this.props.getWeather(e.target.value)}
        />
        {!this.props.cityName && (
          <button onClick={() => this.props.getWeather(this.state.query)}>
            Search
          </button>
        )}
      </React.Fragment>
    );
  }
}

class Loader extends React.Component {
  render() {
    return <span className="loader">Loading</span>;
  }
}

class ForcastList extends React.Component {
  render() {
    const {
      temperature_2m_max: max,
      temperature_2m_min: min,
      time: dates,
      weathercode: codes,
    } = this.props.weather;
    return (
      <React.Fragment>
        <h2> Weather {this.props.city} </h2>
        <ul className="weather">
          {max.map((temp, i) => (
            <DayCard
              max={max[i]}
              min={min[i]}
              date={dates[i]}
              code={codes[i]}
              key={i}
              isToday={i === 0}
            />
          ))}
        </ul>
      </React.Fragment>
    );
  }
}

class DayCard extends React.Component {
  constructor(props) {
    super(props);
    this.getWeatherIcon = this.getWeatherIcon.bind(this);
    this.formatDay = this.formatDay.bind(this);
  }
  getWeatherIcon(wmoCode) {
    const icons = new Map([
      [[0], "☀️"],
      [[1], "🌤"],
      [[2], "⛅️"],
      [[3], "☁️"],
      [[45, 48], "🌫"],
      [[51, 56, 61, 66, 80], "🌦"],
      [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
      [[71, 73, 75, 77, 85, 86], "🌨"],
      [[95], "🌩"],
      [[96, 99], "⛈"],
    ]);
    const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
    if (!arr) return "NOT FOUND";
    return icons.get(arr);
  }
  formatDay(dateStr) {
    return new Intl.DateTimeFormat("en", {
      weekday: "short",
    }).format(new Date(dateStr));
  }
  render() {
    return (
      <li className="day">
        <span>{this.getWeatherIcon(this.props.code)}</span>
        <p>{this.props.isToday ? "Today" : this.formatDay(this.props.date)}</p>
        <p>
          {Math.floor(this.props.min)}&deg; -
          <strong>{Math.ceil(this.props.max)}&deg;</strong>
        </p>
      </li>
    );
  }
}
