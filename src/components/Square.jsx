export const PLAYER_X = "X";
export const PLAYER_O = "O";

export function Square({ value, highlight, onSquareClick }) {
    function handleContextMenu(event) {
        event.preventDefault();
        onSquareClick();
    }
    return (
        <button
            className={"square" + (highlight ? " last-played" : "")}
            onClick={onSquareClick}
            onContextMenu={handleContextMenu}
        >
            {value}
        </button>
    );
}
export default Square;
