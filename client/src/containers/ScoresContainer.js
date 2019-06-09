import React, { Component } from 'react'
import axios from 'axios'
import Leaderboard from '../components/Leaderboard'
export default class leaderboardContainer extends Component {
  state = {
    topScores: [],
    lastUpdated: new Date(),
    refreshBtnClasses: 'refreshBtn'
  }
  componentDidMount() {
    this.fetchTopScores();
    this.interval = setInterval(() => {
      this.fetchTopScores()
    }, 120000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchTopScores = () => {
    axios.get('http://localhost:8080/endlessrunner/topScores')
      .then(response => {
        this.setState({
          topScores: response.data,
          lastUpdated: new Date()
        })
      })
  }

  render() {
    return (
      <Leaderboard scores={this.state.topScores}
        lastUpdated={this.state.lastUpdated}
        fetchTopScores={this.fetchTopScores}
        refreshBtnClasses={this.state.refreshBtnClasses}
      />
    )
  }
}
