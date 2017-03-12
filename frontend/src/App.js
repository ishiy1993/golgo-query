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
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(e) {
    if(e.key === "Enter") {
      const v = e.target.value;
      if(v.length === 0) { return; }
      this.setState({loading: true, value: v});
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
        <div className="info">
          <p>Loading</p>
        </div>
      );
    } else if (epis.length === 0 && value.length !== 0) {
      content = (
        <div className="info">
          <p>Nothing</p>
        </div>
      );
    } else if (epis.length === 0) {
      content = (
        <div className="info">
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
            <input type="text" onKeyPress={this.handleInput} />
          </div>
          <div className="App-content">
            {content}
          </div>
        </div>
        <div className="App-footer">
          <p>Copyright (c) 2017, ishiy</p>
          <p>このサービスの情報はCC-BY-SA 3.0で配布されている<a href="https://ja.wikipedia.org/w/index.php?title=%E3%82%B4%E3%83%AB%E3%82%B413%E3%81%AE%E3%82%A8%E3%83%94%E3%82%BD%E3%83%BC%E3%83%89%E4%B8%80%E8%A6%A7&oldid=60657089">Wikipediaの情報</a>をもとにしています。</p>
        </div>
      </div>
    );
  }
}

export default App;
