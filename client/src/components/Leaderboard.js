import React, { Component } from 'react'

export default class Leaderboard extends Component {
  constructor(props) {
    super(props)
  }
  clickHandler = () => {
    this.props.fetchTopScores()
  }
  render() {
    let lastUpdatedStr = this.props.lastUpdated.toUTCString()
    return (
      <>
        <div className='leaderboard'>
          <div className='headers'>
            <h1 className='headers__ranking'> Rank </h1>
            <h1 className='headers__score'> Score </h1>
            <h1 className='headers__name'> Name </h1>
          </div>
          {this.props.scores.map(score => {
            return (
              <div className='row'>
                <h3 className='ranking'>{score.Ranking}</h3>
                <h3 className='score'>{score.score}</h3>
                <h3 className='name'>{score.name}</h3>
              </div>
            );
          })}
          <div className='lastUpdatedFlex'>
            <h5 className="lastUpdated"> Last Updated: {lastUpdatedStr} </h5>
            <div className={this.props.refreshBtnClasses} onClick={this.clickHandler} />
          </div>
        </div>
      </>
    );
  }
}

