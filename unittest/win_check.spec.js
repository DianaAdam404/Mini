import { expect, test } from "@jest/globals";
import { win_check } from "../utils/win_check";

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

const WIN_CASES = ["X", "O"].flatMap((player) =>
    WIN_POSITIONS.map((positions) => ({ player, positions })),
);

test.each(WIN_CASES)(
    "returns $player as winner for positions $positions",
    ({ player, positions }) => {
        const board = Array(9).fill(undefined);
        positions.forEach((position) => {
            board[position] = player;
        });

        expect(win_check(board)).toBe(player);
    },
);

test("win_check returns tie when board is full and no winner", () => {
    const board2 = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];
    expect(win_check(board2)).toBe("tie");
});

test("win_check continues when the board is not full and has no winner", () => {
    const board = ["X", "O", "X", "X", "O", undefined, "O", "X", "X"];
    expect(win_check(board)).toBeUndefined();
});
