import * as React from 'react';
import './App.css';

const GameHeader: React.SFC<{ winner: string, resetFunction: Function }> = ({ winner, resetFunction}) => (
  <div>
    <h1>{`The winner is ${winner}`}</h1>
    <button onClick={() => resetFunction()}>Reset</button>
  </div>
);

const BLANK_SYMBOL = '?';
const PLAYER_ONE_SYMBOL = 'Y';
const PLAYER_TWO_SYMBOL = 'N';
const DRAW_SYMBOL = 'Nobody';

const winningComboIndices = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

export interface AppProps {

}

export interface AppState {
  playerOneSymbol: string;
  playerTwoSymbol: string;
  currentTurnSymbol: string;
  board: string[];
  winner: string | null;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
  }

  componentWillMount() {
    this.reset();
  }

  getInitialStateZZZ() {
    return {
      playerOneSymbol: PLAYER_ONE_SYMBOL,
      playerTwoSymbol: PLAYER_TWO_SYMBOL,
      currentTurnSymbol: PLAYER_ONE_SYMBOL,
      board: [
        BLANK_SYMBOL, BLANK_SYMBOL, BLANK_SYMBOL,
        BLANK_SYMBOL, BLANK_SYMBOL, BLANK_SYMBOL,
        BLANK_SYMBOL, BLANK_SYMBOL, BLANK_SYMBOL,
      ],
      winner: null,
    };
  }

  handleClick(index: number) {

    if (this.state.winner) {
      return;
    }

    const selectedCellCurrentValue = this.state.board[index];

    if (selectedCellCurrentValue !== BLANK_SYMBOL) {
      return;
    }

    this.state.board[index] = this.state.currentTurnSymbol;

    this.setState({
      board: this.state.board,
      currentTurnSymbol: (
        this.state.currentTurnSymbol === this.state.playerOneSymbol ?
          this.state.playerTwoSymbol :
          this.state.playerOneSymbol
      ),
      winner: this.checkForWinner(),
    });
  }

  checkForWinner(): string | null {
    const board = this.state.board;

    const foundWinningCombo = winningComboIndices.find((combo: number[]) => {
      if (
        board[combo[0]] !== BLANK_SYMBOL &&
        // board[combo[1]] !== '' &&
        // board[combo[2]] !== '' &&
        board[combo[0]] === board[combo[1]] &&
        board[combo[1]] === board[combo[2]]) {
        return true;
      } else {
        return false;
      }
    });

    if (foundWinningCombo) {
      return this.state.currentTurnSymbol;
    }

    const emptyCells = this.state.board.filter((cell: string) => cell === BLANK_SYMBOL);

    return emptyCells.length === 0 ? DRAW_SYMBOL : null;
  }

  reset() {
    this.setState(this.getInitialStateZZZ());
  }

  render() {
    return (
      <div className="app-container">
        {this.state.winner ? <GameHeader winner={this.state.winner} resetFunction={() => this.reset()} /> : null}

        <div className="board">
          {this.state.board.map((cell, index) => {
            return <div key={index} onClick={() => this.handleClick(index)} className="square">{cell}</div>;
          })}
        </div>
      </div>
    );
  }
}

export default App;