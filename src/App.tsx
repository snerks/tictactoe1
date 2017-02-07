import * as React from 'react';
import './App.css';

const BLANK_SYMBOL = '?';
const PLAYER_ONE_SYMBOL = 'Y';
const PLAYER_TWO_SYMBOL = 'N';
const DRAW_SYMBOL = 'Nobody';

const winningCombosIndices = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const GameBoard: React.SFC<{ board: string[], handleClick: (index: number) => void }> = ({ board, handleClick }) => (
  <div className="board">
    {board.map((cell, index) => {
      return <div key={index} onClick={() => handleClick(index)} className="square">{cell}</div>;
    })}
  </div>
);

const GameFooter: React.SFC<{ winner: string, resetFunction: Function }> = ({ winner, resetFunction}) => (
  <div>
    <h1>{`The winner is ${winner}`}</h1>
    <div>
      <button onClick={() => resetFunction()}>Reset</button>
    </div>
  </div>
);

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

  getTheInitialState() {
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

    const foundWinningComboIndices = winningCombosIndices.find((winningComboIndices: number[]) => {
      const firstBoardCellSymbol = board[winningComboIndices[0]];
      const secondBoardCellSymbol = board[winningComboIndices[1]];
      const thirdBoardCellSymbol = board[winningComboIndices[2]];

      return (
        firstBoardCellSymbol !== BLANK_SYMBOL &&
        firstBoardCellSymbol === secondBoardCellSymbol &&
        firstBoardCellSymbol === thirdBoardCellSymbol);
    });

    if (foundWinningComboIndices) {
      return this.state.currentTurnSymbol;
    }

    const blankSymbolCells = this.state.board.filter(
      (cellSymbol: string) => cellSymbol === BLANK_SYMBOL
    );

    return blankSymbolCells.length === 0 ? DRAW_SYMBOL : null;
  }

  reset() {
    this.setState(this.getTheInitialState());
  }

  render() {
    return (
      <div className="app-container">
        <GameBoard board={this.state.board} handleClick={(index: number) => this.handleClick(index)} />

        {this.state.winner ? <GameFooter winner={this.state.winner} resetFunction={() => this.reset()} /> : null}
      </div>
    );
  }
}

export default App;