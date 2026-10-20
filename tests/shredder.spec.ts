import { test, expect } from "@playwright/test";
test.setTimeout(30000);

test("shredder accepts a mouse drop after scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 750 });
  await page.goto("/");
  await page.getByRole("button", { name: /01.*The Nonsense Shredder/ }).click();
  await expect(page.locator(".paper-slip").first()).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 400));
  const slip = await page.locator(".paper-slip").first().boundingBox();
  const target = await page.locator(".shredder").boundingBox();
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await page.mouse.move(slip!.x + slip!.width / 2, slip!.y + slip!.height / 2);
  await page.mouse.down();
  await page.mouse.move(target!.x + target!.width / 2, target!.y + 30, {
    steps: 20,
  });
  await page.mouse.up();
  await expect(page.locator(".paper-slip")).toHaveCount(9);
  await expect(page.locator(".shred-station .pill")).toContainText(
    "1 shredded",
  );
});

test("mobile touch drop and tap controls shred every slip", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  await page.goto(`http://127.0.0.1:${process.env.TEST_PORT || "3100"}`);
  await page.getByRole("button", { name: /01.*The Nonsense Shredder/ }).tap();
  await expect(page.locator(".paper-slip:visible")).toHaveCount(3);
  await page
    .locator(".game-panel")
    .evaluate((e) =>
      window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 10),
    );
  const slip = await page.locator(".paper-slip").first().boundingBox();
  const target = await page.locator(".shredder").boundingBox();
  const client = await context.newCDPSession(page);
  const sx = slip!.x + slip!.width / 2,
    sy = slip!.y + slip!.height / 2;
  const tx = target!.x + target!.width / 2,
    ty = target!.y + 30;
  expect(sy).toBeGreaterThan(0);
  expect(ty).toBeLessThan(844);
  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: sx, y: sy }],
  });
  for (let i = 1; i <= 15; i++)
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        { x: sx + ((tx - sx) * i) / 15, y: sy + ((ty - sy) * i) / 15 },
      ],
    });
  await client.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page.locator(".paper-slip")).toHaveCount(9);
  for (let i = 0; i < 9; i++) {
    await page.locator(".paper-slip:visible").first().tap();
    await page
      .getByRole("button", { name: "Shred this slip", exact: true })
      .tap();
  }
  await expect(page.locator(".paper-slip")).toHaveCount(0);
  await expect(page.locator(".shred-station .pill")).toContainText(
    "10 shredded",
  );
  await expect(
    page.getByRole("button", { name: "Proceed to more nonsense" }),
  ).toBeVisible();
  await context.close();
});

test("WhatsApp label and uppercase message are independent", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "madam-ji-v1",
      JSON.stringify({ scene: 5, completed: [], missionSet: "pop-v1" }),
    ),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Open your final gift" }).click();
  const link = page.getByRole("link", { name: /Talk to Bhuvi about the site/ });
  await expect(link).toContainText("Talk to Bhuvi about the site?");
  await expect(link).toHaveAttribute(
    "href",
    "https://wa.me/919940183984?text=BHUVI%20YOU%20ARE%20THE%20BEST",
  );
});
