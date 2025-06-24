import React, { useState } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  /**
   * Main App component for the Tic Tac Toe game.
   * Renders responsive board, handles game logic and status.
   */

  // Board state: 9 elements, null | 'X' | 'O'
  const [board, setBoard] = useState(Array(9).fill(null));
  // X is first
  const [xIsNext, setXIsNext] = useState(true);
  // Status (null | 'X wins!' | 'O wins!' | 'It\'s a draw!')
  const [status, setStatus] = useState('');
  // To trigger animation on moves
  const [lastMoveIdx, setLastMoveIdx] = useState(null);

  // Colors: use CSS variables to override for the board
  const theme = {
    '--ttt-accent': '#fbc02d',
    '--ttt-primary': '#1976d2',
    '--ttt-secondary': '#424242',
    '--ttt-bg': '#f9f9f9',
    '--ttt-x': '#1976d2',
    '--ttt-o': '#fbc02d'
  };

  // Helper to decide winner
  function calculateWinner(sq) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // cols
      [0,4,8],[2,4,6] // diags
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) return sq[a];
    }
    return null;
  }

  // Helper to check for draw (all filled, no winner)
  function isDraw(sq) {
    return sq.every(cell => cell) && !calculateWinner(sq);
  }

  // Handle move (square click)
  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (status || board[idx]) return; // ignore if game over or cell filled

    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setLastMoveIdx(idx);

    const winner = calculateWinner(nextBoard);
    if (winner) {
      setStatus(`${winner} wins!`);
    } else if (isDraw(nextBoard)) {
      setStatus(`It's a draw!`);
    } else {
      setStatus('');
      setXIsNext(!xIsNext);
    }
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setStatus('');
    setLastMoveIdx(null);
  }

  // PUBLIC_INTERFACE
  function renderSquare(i) {
    // Animate if this is the last move
    let cls = "ttt-square";
    if (i === lastMoveIdx) cls += " ttt-anim";
    let symbol = board[i];
    return (
      <button
        className={cls}
        key={i}
        onClick={() => handleClick(i)}
        style={{
          color: symbol === 'X' ? 'var(--ttt-x)' : symbol === 'O' ? 'var(--ttt-o)' : 'var(--ttt-secondary)',
          borderColor: status && (symbol === 'X' || symbol === 'O') && calculateWinner(board) && calculateWinner(board) === symbol ? 'var(--ttt-accent)' : 'var(--ttt-secondary)'
        }}
        aria-label={`cell ${i + 1}${symbol ? `: ${symbol}` : ''}`}
        disabled={!!status || !!symbol}
      >
        {symbol}
      </button>
    );
  }

  // Status message
  let gameStatus = status
    ? status
    : `Next player: ` + (xIsNext ? "X" : "O");

  return (
    <div className="app" style={theme}>
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol" style={{ color: 'var(--ttt-accent)' }}>#</span> Tic Tac Toe
            </div>
            <a href="https://react.dev/" style={{ textDecoration: 'none' }}>
              <button className="btn" style={{ background: 'var(--ttt-accent)' }}>React</button>
            </a>
          </div>
        </div>
      </nav>

      <main>
        <div className="ttt-outer">
          <div className="ttt-center">
            <div className="ttt-status" data-testid="game-status">{gameStatus}</div>
            {/* Board */}
            <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
              {Array.from({ length: 3 }).map((_, row) => (
                <div className="ttt-row" key={row} role="row">
                  {Array.from({ length: 3 }).map((_, col) => renderSquare(row * 3 + col))}
                </div>
              ))}
            </div>
            <div className="ttt-controls">
              <button className="btn btn-large ttt-reset" onClick={resetGame} style={{ background: 'var(--ttt-primary)', marginTop: 16 }}>
                Reset Game
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="ttt-footer">
        <span>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--ttt-secondary)", textDecoration: "none" }}>
            &copy; 2024 Minimal Tic Tac Toe
          </a>
        </span>
      </footer>
    </div>
  );
}

export default App;