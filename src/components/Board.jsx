import { useEffect, useRef, useState } from "react";
import { PLAYER_O, PLAYER_X, Square } from "./Square";
import { win_check } from "../../utils/win_check";

const BOARD_SIDES = 3;
const BOARD_INDICES = [...Array(BOARD_SIDES).keys()];
const CELL_COUNT = BOARD_SIDES * BOARD_SIDES;

export function Board() {
    const [status, setStatus] = useState(new Array(CELL_COUNT).fill(undefined));
    const [winner, setWinner] = useState();
    const [gameOver, setGameOver] = useState(false);
    const [lastCell, setLastCell] = useState();
    const [robotMode, setRobotMode] = useState(false);
    const [darkTheme, setDarkTheme] = useState(false);
    const [wins, setWins] = useState({ [PLAYER_X]: 0, [PLAYER_O]: 0 });
    const lastPlayer = useRef();

    useEffect(() => {
        document.body.classList.toggle("dark-theme", darkTheme);
    }, [darkTheme]);

    function handleClick(idx) {
        if (status[idx] || gameOver) return;

        const player = robotMode
            ? PLAYER_X
            : lastPlayer.current === PLAYER_X
              ? PLAYER_O
              : PLAYER_X;
        lastPlayer.current = player;

        const newStatus = [...status];
        newStatus[idx] = player;
        let nextLastCell = idx;
        let result = win_check(newStatus);

        if (robotMode && !result) {
            const emptyCells = newStatus.flatMap((cell, index) =>
                cell ? [] : [index],
            );
            const robotCell =
                emptyCells[Math.floor(Math.random() * emptyCells.length)];
            newStatus[robotCell] = PLAYER_O;
            nextLastCell = robotCell;
            result = win_check(newStatus);
        }

        setStatus(newStatus);
        setLastCell(nextLastCell);
        setWinner(result === "tie" ? undefined : result);
        setGameOver(Boolean(result));
        if (result && result !== "tie") {
            setWins((currentWins) => ({
                ...currentWins,
                [result]: currentWins[result] + 1,
            }));
        }
    }

    function handlePlayAgain() {
        setStatus(new Array(CELL_COUNT).fill(undefined));
        setWinner(undefined);
        setGameOver(false);
        setLastCell(undefined);
        lastPlayer.current = undefined;
    }

    return (
        <main className={`app-shell${darkTheme ? " dark-theme" : ""}`}>
            <div className="outside">
                <label className="toggle-option">
                    <input
                        id="robot-mode"
                        type="checkbox"
                        checked={robotMode}
                        onChange={(event) => {
                            handlePlayAgain();
                            setRobotMode(event.target.checked);
                        }}
                    />
                    Play with robot
                </label>
                {robotMode && (
                    <div className="robot-hint">You are X; robot is O.</div>
                )}

                <div className="board">
                    {BOARD_INDICES.map((rowIndex) => (
                        <div className="board-row" key={rowIndex}>
                            {BOARD_INDICES.map((columnIndex) => {
                                const index =
                                    rowIndex * BOARD_SIDES + columnIndex;
                                return (
                                    <Square
                                        key={index}
                                        value={status[index]}
                                        highlight={index === lastCell}
                                        onSquareClick={() => handleClick(index)}
                                    />
                                );
                            })}
                        </div>
                    ))}
                    <div className="game-status">
                        {gameOver && winner && `Game over! ${winner} won`}
                        {gameOver && !winner && "Draw! No winner"}
                    </div>
                    {gameOver && (
                        <button
                            className="play-again"
                            onClick={handlePlayAgain}
                        >
                            Play again
                        </button>
                    )}
                    <div className="win-counter" aria-label="Win counts">
                        <span>X wins: {wins[PLAYER_X]}</span>
                        <span>O wins: {wins[PLAYER_O]}</span>
                    </div>
                    <label className="toggle-option">
                        <input
                            id="dark-theme"
                            type="checkbox"
                            checked={darkTheme}
                            onChange={(event) =>
                                setDarkTheme(event.target.checked)
                            }
                        />
                        Dark theme
                    </label>
                </div>
            </div>
        </main>
    );
}

export default Board;
