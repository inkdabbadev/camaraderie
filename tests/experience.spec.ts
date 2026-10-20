import { test, expect } from "@playwright/test";
import { MAZE, HAZARDS, TOKENS, catches } from "../src/lib/game";
test("basket collisions require overlapping positions", () => {
  expect(catches(50, 85, 50)).toBe(true);
  expect(catches(20, 85, 70)).toBe(false);
  expect(catches(50, 50, 50)).toBe(false);
});
test("complete all missions, persist completion and download certificate", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("button", { name: "I’m suspicious." }).click();
  await expect(page.getByRole("status")).toContainText("Valid concern");
  await page.getByRole("button", { name: "Fine, what now?" }).click();
  await page.getByRole("button", { name: "Accept my fate" }).click();
  for (let i = 0; i < 5; i++) {
    await page.locator(".paper-slip").first().click();
    await page.getByRole("button", { name: "Shred selected paper" }).click();
  }
  await page.getByRole("button", { name: "Proceed to more nonsense" }).click();
  await expect(page.locator(".maze")).toBeVisible();
  let pos = { x: 1, y: 1 };
  for (const target of TOKENS) {
    const queue = [{ ...pos, path: [] as string[] }];
    const seen = new Set<string>();
    let solution: string[] = [];
    while (queue.length) {
      const n = queue.shift()!;
      if (n.x === target.x && n.y === target.y) {
        solution = n.path;
        break;
      }
      for (const [dx, dy, key] of [
        [1, 0, "ArrowRight"],
        [-1, 0, "ArrowLeft"],
        [0, 1, "ArrowDown"],
        [0, -1, "ArrowUp"],
      ] as const) {
        const x = n.x + dx,
          y = n.y + dy,
          k = `${x},${y}`;
        if (
          MAZE[y]?.[x] === "." &&
          !seen.has(k) &&
          !HAZARDS.some((h) => h.x === x && h.y === y)
        ) {
          seen.add(k);
          queue.push({ x, y, path: [...n.path, key] });
        }
      }
    }
    expect(solution.length).toBeGreaterThan(0);
    for (const key of solution) {
      await page.keyboard.press(key);
    }
    pos = target;
  }
  await expect(page.locator(".tokens .found")).toHaveCount(3);
  await page.getByRole("button", { name: "Proceed to more nonsense" }).click();
  await page.clock.install();
  await page.getByRole("button", { name: "Start popping" }).click();
  for (let round = 0; round < 3; round++) {
    for (let i = 0; i < 6; i++)
      await page.locator(".nonsense-bubble").nth(i).click();
    await page.clock.runFor(800);
  }
  await expect(page.locator(".pop-stats")).toContainText("18 POPPED");
  await page
    .getByRole("button", { name: "Pause popping", exact: true })
    .click();
  const popRemaining = await page.locator(".arcade-hud").innerText();
  await page.clock.runFor(2000);
  expect(await page.locator(".arcade-hud").innerText()).toBe(popRemaining);
  await page
    .getByRole("button", { name: "Resume popping", exact: true })
    .first()
    .click();
  await page.clock.runFor(31000);
  await expect(page.getByText("Nonsense: demolished.")).toBeVisible();
  await expect(page.getByText("CERTIFIED NONSENSE POPPER")).toBeVisible();
  await page.getByRole("button", { name: "Proceed to more nonsense" }).click();
  await page.evaluate(() => {
    Math.random = () => 0.5;
  });
  await page.getByRole("button", { name: "Let it rain compliments" }).click();
  await page.clock.runFor(3000);
  await page.getByRole("button", { name: "Pause game" }).click();
  const remaining = await page.locator(".arcade-hud").innerText();
  await page.clock.runFor(4000);
  expect(await page.locator(".arcade-hud").innerText()).toBe(remaining);
  await page.getByRole("button", { name: "Resume the chaos" }).click();
  await page.clock.runFor(31000);
  await expect(page.getByText("Officially pretty wonderful.")).toBeVisible();
  expect(
    Number((await page.locator(".arcade-hud b").innerText()).split(" ")[0]),
  ).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Proceed to more nonsense" }).click();
  for (let i = 1; i <= 3; i++)
    await page.getByRole("button", { name: `Reveal award ${i}` }).click();
  await page
    .getByRole("button", { name: "Open the final gift", exact: true })
    .click();
  await page.getByRole("button", { name: "Open your final gift" }).click();
  await expect(
    page.getByText("MUSKAAN IS AN ASSHOLE.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Talk to Bhuvi/ }),
  ).toHaveAttribute(
    "href",
    "https://wa.me/919940183984?text=BHUVI%20YOU%20ARE%20THE%20BEST",
  );
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download your Official Certificate" })
    .click();
  expect((await download).suggestedFilename()).toContain(
    "Certificate-of-Excellence.png",
  );
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Download your Official Certificate" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("mobile layout, navigation and repeatable happiness", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Hello, Madam Ji." }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/mobile-debug.png",
    fullPage: true,
  });
  const overflow = await page.evaluate(() =>
    [...document.querySelectorAll("body *")]
      .filter((e) => e.getBoundingClientRect().right > innerWidth + 1)
      .map((e) => ({
        class: e.className,
        right: e.getBoundingClientRect().right,
      })),
  );
  expect(overflow).toEqual([]);
  await page.screenshot({
    path: "test-results/mobile-home.png",
    fullPage: true,
  });
  for (let i = 0; i < 3; i++)
    await page
      .getByRole("button", { name: "Emergency happiness button" })
      .click();
  await expect(page.getByRole("status")).toBeVisible();
  await page.getByRole("button", { name: "Dismiss message" }).click();
  await page.getByRole("button", { name: /03.*Pop the Nonsense/ }).click();
  await expect(
    page.getByRole("heading", {
      name: "Big feelings. Tiny bubbles. POP.",
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/mobile-pop.png",
    fullPage: true,
  });
});
