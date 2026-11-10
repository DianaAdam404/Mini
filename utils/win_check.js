const WIN_POSITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

export function win_check(board) {
    const winningPosition = WIN_POSITIONS.find(([first, second, third]) => {
        return (
            board[first] &&
            board[first] === board[second] &&
            board[first] === board[third]
        );
    });

    if (winningPosition) return board[winningPosition[0]];
    if (board.every(Boolean)) return "tie";
    return undefined;
}

export default win_check;
