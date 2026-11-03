// @ts-check
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("the board has 9 squares", async ({ page }) => {
    const squares = page.locator(".square");
    await expect(squares).toHaveCount(9);
});

test("players take turns", async ({ page }) => {
    const squares = page.locator(".square");
    let texts;

    await squares.nth(0).click();
    texts = await squares.nth(0).textContent();
    expect(texts).toEqual("X");

    await squares.nth(1).click({ button: "right" });
    texts = await squares.nth(1).textContent();
    expect(texts).toEqual("O");
});
test("the same player cannot play twice in a row", async ({ page }) => {
    const squares = page.locator(".square");

    await expect(squares.nth(0)).toHaveText("");
    await squares.nth(0).click();
    await expect(squares.nth(0)).toHaveText("X");

    await squares.nth(0).click();
    await expect(squares.nth(0)).toHaveText("X");
});
test("win status is displayed when a player wins", async ({ page }) => {
    const squares = page.locator(".square");
    const status = page.locator(".game-status");

    await squares.nth(0).click();
    await squares.nth(3).click();
    await squares.nth(1).click();
    await squares.nth(4).click();
    await squares.nth(2).click();

    await expect(status).toHaveText("Game over! X won");
});

test("draw status is displayed when the game ends in a draw", async ({
    page,
}) => {
    const squares = page.locator(".square");
    const status = page.locator(".game-status");

    await squares.nth(0).click();
    await squares.nth(1).click();
    await squares.nth(2).click();
    await squares.nth(4).click();
    await squares.nth(3).click();
    await squares.nth(5).click();
    await squares.nth(7).click();
    await squares.nth(6).click();
    await squares.nth(8).click();

    await expect(status).toHaveText("Draw! No winner");
});

test("highlight last played cell", async ({ page }) => {
    const squares = page.locator(".square");

    await squares.nth(0).click();
    await expect(squares.nth(0)).toHaveClass(/last-played/);

    await squares.nth(1).click();
    await expect(squares.nth(1)).toHaveClass(/last-played/);
    await expect(squares.nth(0)).not.toHaveClass(/last-played/);
});

test("reset the game when clicking play again", async ({ page }) => {
    const squares = page.locator(".square");
    await squares.nth(0).click();
    await squares.nth(3).click();
    await squares.nth(1).click();
    await squares.nth(4).click();
    await squares.nth(2).click();
    await expect(page.getByText("Game over! X won")).toBeVisible();
    const playAgainButton = page.locator(".play-again");
    await playAgainButton.click();
    for (let i = 0; i < 9; i++) {
        await expect(squares.nth(i)).toHaveText("");
    }
});

test("robot mode: player X plays against robot O", async ({ page }) => {
    const squares = page.locator(".square");
    const robotModeCheckbox = page.locator("#robot-mode");

    await robotModeCheckbox.check();

    await squares.nth(0).click();
    await expect(squares.nth(0)).toHaveText("X");

    // Wait for the robot to make a move
    await page.waitForTimeout(500);

    let oPlayed = false;
    for (let i = 0; i < 9; i++) {
        const text = await squares.nth(i).textContent();
        if (text === "O") {
            oPlayed = true;
            break;
        }
    }
    expect(oPlayed).toBe(true);
});

test("background color changes when dark theme is toggled", async ({
    page,
}) => {
    const darkThemeCheckbox = page.locator("#dark-theme");
    const body = page.locator("body");

    await darkThemeCheckbox.check();
    await expect(body).toHaveClass(/dark-theme/);

    await darkThemeCheckbox.uncheck();
    await expect(body).not.toHaveClass(/dark-theme/);
});
