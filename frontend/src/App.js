import React, { Component } from 'react';
import './App.css';

function search(word, onSuccess, onError) {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/search', true);
  xhr.setRequestHeader("Accept","application/json");
  xhr.setRequestHeader("Content-Type","application/json");
  xhr.onreadystatechange = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        let value = JSON.parse(xhr.responseText);
        onSuccess(value);
      } else {
        let value = JSON.parse(xhr.responseText);
        onError(value);
      }
    }
  }
  xhr.send(JSON.stringify({query: word}));
}

class Episode extends Component {
  constructor(props) {
    super(props);
    this.state = {focus: false, episode: props.episode};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(s => ({
      focus: !s.focus
    }));
  }

  render() {
    const focus = this.state.focus;
    const epi = this.state.episode;

    return (
      <li className="episode" onClick={this.handleClick}>
        <div className="volume">{epi.volume}</div>
        <div className="episode-num">{epi.episode}</div>
        <h2>{epi.title}</h2>
        <span>{epi.publish}, </span>
        <span>{epi.page} pages</span>
        { focus &&
            <p>{epi.summary}</p>
        }
      </li>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {value: "", loading: false, episodes: []};
    this.handleChange = this.handleChange.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }

  handleInput(e) {
    const v = this.state.value;
    if(e.key === "Enter" && v.length !== 0) {
      console.log(e.key, v);
      this.setState({loading: true});
      search(v, (res) => {
        this.setState({loading: false, episodes: res});
      }, (err) => {
        console.log(err);
        this.setState({loading: false, episodes: []});
      });
    }
  }

  render() {
    const loading = this.state.loading;
    const value = this.state.value;
    const epis = this.state.episodes;
    const epiList = epis.map((epi)=>
      <Episode episode={epi} />
    );

    let content;

    if (loading) {
      content = (
        <p>Loading</p>
      );
    } else if (epis.length === 0 && value.length !== 0) {
      content = (
        <p>Nothing</p>
      );
    } else if (epis.length === 0) {
      content = (
        <div className="episode">
          <h2>Welcome to Golgo Query</h2>
          <p>Enter a keyword and press enter key</p>
        </div>
      );
    } else {
      content = (
        <ul className="episodes">
          {epiList}
        </ul>
      );
    };

    return (
      <div className="App">
        <div className="App-header">
          <h1>Golgo Query</h1>
        </div>
        <div className="App-main">
          <div className="App-form">
            <input type="text" onChange={this.handleChange} onKeyPress={this.handleInput} />
          </div>
          <div className="App-content">
            {content}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
