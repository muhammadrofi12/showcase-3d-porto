import { chromium, expect } from "@playwright/test";
import fs from "node:fs";
fs.mkdirSync("output", { recursive: true });
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--enable-webgl", "--ignore-gpu-blocklist"],
});
const errors = [];
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (msg) => {
  if (msg.type() === "error" && /shader|webgl/i.test(msg.text()))
    errors.push(msg.text());
});
try {
  await page.goto("http://127.0.0.1:5173/");
  await page.locator("canvas").waitFor();
  await page.waitForTimeout(5000);
  await page.getByRole("button", { name: "Acara malam", exact: true }).click();
  const slider = page.getByRole("slider", { name: "Waktu lingkungan" });
  await expect(slider).toHaveValue("20");
  await page.waitForTimeout(3500);
  await page.screenshot({ path: "output/market-night.png" });
  await slider.fill("17.75");
  await page.waitForTimeout(700);
  await page.screenshot({ path: "output/market-before-opening.png" });
  await slider.fill("18");
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "output/market-dusk.png" });
  await slider.focus();
  await page.keyboard.press("End");
  await expect(slider).toHaveValue("22");
  await page.waitForTimeout(700);
  await page.screenshot({ path: "output/market-late-night.png" });
  const area = page.getByRole("combobox", { name: "Area acara" });
  for (const name of ["food", "tech", "shops"]) {
    await area.selectOption(name);
    await page.waitForTimeout(1900);
    await page.screenshot({ path: `output/market-${name}-detail.png` });
  }
  await slider.fill("10");
  await page.waitForTimeout(800);
  await page.screenshot({ path: "output/shops-closed-day.png" });
  await slider.fill("18");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "output/shops-open-dusk.png" });
  await slider.fill("22");
  await page.waitForTimeout(700);
  await page.getByRole("button", { name: "Lihat Monas", exact: true }).click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "output/market-monas.png" });
  // Rotate toward the shops along the eastern edge of the park.
  await page.mouse.move(1000, 470);
  await page.mouse.down();
  await page.mouse.move(1350, 470, { steps: 30 });
  await page.mouse.up();
  await page.waitForTimeout(1600);
  await page.screenshot({ path: "output/market-shops.png" });
  await page
    .getByRole("button", { name: "Masuk gallery", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Lobby & Reception", exact: true }),
  ).toBeVisible();
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  mobile.on("pageerror", (e) => errors.push(e.message));
  await mobile.goto("http://127.0.0.1:5173/");
  await mobile
    .getByRole("button", { name: "Tutup katalog dan masuk 3D" })
    .click();
  await mobile.waitForTimeout(3500);
  await mobile
    .getByRole("button", { name: "Acara malam", exact: true })
    .click();
  await mobile.waitForTimeout(3000);
  await mobile.screenshot({ path: "output/market-mobile.png" });
  await expect(
    mobile.getByRole("combobox", { name: "Area acara" }),
  ).toHaveValue("tech");
  for (const name of ["food", "shops"]) {
    await mobile
      .getByRole("combobox", { name: "Area acara" })
      .selectOption(name);
    await mobile.waitForTimeout(2000);
    await mobile.screenshot({ path: `output/market-mobile-${name}.png` });
  }
  const overflow = await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  if (overflow) throw Error("Mobile overflow");
  if (errors.length) throw Error(errors.join("\n"));
  fs.writeFileSync(
    "output/market-result.json",
    JSON.stringify(
      {
        errors,
        keyboardSlider: true,
        eventShortcut: true,
        lobbyAfterEvent: true,
        mobileOverflow: overflow,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS night event shortcut, time slider keyboard, lobby navigation, mobile layout; screenshots captured for day/night visibility review.",
  );
} finally {
  await browser.close();
}
