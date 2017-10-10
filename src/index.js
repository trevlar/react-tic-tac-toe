import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className={props.className}  
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    var isAWin;
    if (this.props.winningSquares) {
      isAWin = this.props.winningSquares.find((n) => n === i)
    }
    return (
      <Square 
        className={'square ' + (isAWin > -1? 'win':'')}
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      turnNumber: 0,
      whoseTurn: 'X'
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.turnNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinningResults(squares);
    if (winner != null || squares[i]) {
      return;
    }

    let xIsNext = this.state.whoseTurn === 'X';
        squares[i] = xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      turnNumber: history.length,
      whoseTurn: xIsNext ? 'O' : 'X',
    });
  }

  jumpTo(turn) {
    this.setState({
      turnNumber: turn,
      whoseTurn: (turn % 2) === 0? 'X' : 'O',
    })
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.turnNumber];
    const winner = calculateWinningResults(current.squares);

    const moves = history.map((board, turn, history) => {
      let lastBoard = history[turn-1];
      var moveToSquare;
      if (lastBoard) {
        for (let i = 0; i < 9; i++) {
          if (lastBoard.squares[i] !== board.squares[i]) {
            moveToSquare = i;
            break;
          }
        }
      }
      var col = [1, 2, 3, 1, 2, 3, 1, 2, 3][moveToSquare];
      var row = [1, 1, 1, 2, 2, 2, 3, 3, 3][moveToSquare];
      const desc = turn ?
        `Go to turn (${row},${col})`:
        `Go to game start`;
      return (
        <li key={turn} className={(this.state.turnNumber === turn ? 'selected' : '')}>
            <button onClick={() => this.jumpTo(turn)}>{desc}</button>
        </li>
      )
    });

    let status, winningSquares;
    if (winner) {
      status = `${winner.player} is the Winner!`;
      winningSquares = winner.places;
    } else if (this.state.turnNumber >= 9) {
      status = `It's a tie`;
    } else {
      status = `Next player: ${this.state.whoseTurn}`
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            winningSquares={winningSquares}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinningResults(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], 
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {player: squares[a], places: [a,b,c]};
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
