import { chromium } from "@playwright/test";
import fs from "node:fs";
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--enable-webgl", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (message) => {
  if (message.type() === "error" && /shader|webgl/i.test(message.text()))
    errors.push(message.text());
});
await page.goto("http://127.0.0.1:5173/");
await page.locator("canvas").waitFor();
await page.waitForTimeout(4500);
await page.screenshot({ path: "output/environment-day.png" });
await page.getByRole("button", { name: "Lihat langit" }).click();
await page.waitForTimeout(2000);
await page.screenshot({ path: "output/sky-day.png" });
await page.getByRole("button", { name: "Lihat Monas" }).click();
await page.waitForTimeout(2200);
await page.screenshot({ path: "output/monas-day.png" });
const slider = page.getByRole("slider", { name: "Waktu lingkungan" });
await slider.fill("18");
await page.waitForTimeout(700);
await page.screenshot({ path: "output/monas-dusk.png" });
await slider.fill("22");
await page.waitForTimeout(700);
await page.screenshot({ path: "output/monas-night.png" });
await page.getByRole("button", { name: "Lihat langit" }).click();
await page.waitForTimeout(2000);
await page.screenshot({ path: "output/sky-night.png" });
if ((await slider.getAttribute("aria-valuetext")) !== "Malam 22:00")
  throw Error("Night time label");
await slider.fill("6");
await page.waitForTimeout(400);
if (
  !(await page
    .locator(".time-control output")
    .filter({ hasText: "Pagi" })
    .count())
)
  throw Error("Morning label");
// Three successive horizontal drags traverse more than a full revolution.
for (let i = 0; i < 3; i++) {
  await page.mouse.move(1130, 470);
  await page.mouse.down();
  await page.mouse.move(400, 470, { steps: 32 });
  await page.mouse.up();
  await page.waitForTimeout(300);
}
await page.screenshot({ path: "output/camera-360.png" });
await page.getByRole("button", { name: "Masuk gallery", exact: true }).click();
await page.waitForTimeout(1800);
await page
  .getByRole("heading", { name: "Lobby & Reception", exact: true })
  .waitFor();
await slider.fill("22");
await page.screenshot({ path: "output/lobby-night.png" });
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
await mobile.goto("http://127.0.0.1:5173/");
await mobile
  .getByRole("button", { name: "Tutup katalog dan masuk 3D" })
  .click();
await mobile.waitForTimeout(3000);
await mobile.screenshot({ path: "output/environment-mobile.png" });
const overflow = await mobile.evaluate(
  () => document.documentElement.scrollWidth > innerWidth,
);
if (overflow) throw Error("Mobile overflow");
await browser.close();
fs.writeFileSync(
  "output/environment-result.json",
  JSON.stringify(
    {
      errors,
      monasView: true,
      timeRange: [6, 22],
      cameraDragSequence: true,
      mobileOverflow: overflow,
    },
    null,
    2,
  ),
);
if (errors.length) throw Error(errors.join("\n"));
console.log(
  "PASS environment, Monas, time control, repeated camera drag, mobile layout",
);
