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
    this.state = {value: "", loading: false, episodes: [{"volume":"94巻","episode":"増刊24話","title":"誇り高き葡萄酒(ワイン)","publish":"1990/11","page":"36","collaborator":"None","summary":"世界最高峰のワイン「ロマネ・モン・リュイザン」のオーナーであるガイヤールは、日本人バイヤーの柳田が1800年ものをオークションで競り落とすだろうと予想する。そこで1905年ものを1800年ものと偽って出品し、柳田はガイヤールの予想通り偽の1800年ものを競り落とす。しかし柳田はガイヤールが出品したものは実は偽物でないかと疑い始め、自らパーティーを主催し、フランスのトップクラスのソムリエらを招くことを計画する。"},{"volume":"131巻","episode":"増刊55話","title":"神の滴","publish":"1998/12","page":"39","collaborator":"None","summary":"市場に十本しか出回らなかったといわれる幻のワイン「シャトー・ラ・ミッション」の七八年ものの発見はワイン通達を沸き返らせたが、生みの親であるワイン職人ジャン・エミールにとっては凶報以外の何ものでもなかった。七八年ものは職人としての情熱をかけて作り上げた極上品だったが、敵対する職人の陰謀で三流ものの瓶を混ぜられてしまい、シャトーの面目を保つために泣く泣く回収したのだったが、よりにもよってその偽の瓶をエミールを快く思わない卸売業者に見つけられてしまったのである。大々的に試飲会を開いて名誉を傷つけようと企む業者に対し、エミールのとった行動とは……。"}
]};
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
    const epis = this.state.episodes;
    const epiList = epis.map((epi)=>
      <Episode episode={epi} />
    );

    let content;

    if (loading) {
      content = (
          <p>Loading</p>
      );
    } else if (epis.length === 0) {
      content = (
          <p>Nothing</p>
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
