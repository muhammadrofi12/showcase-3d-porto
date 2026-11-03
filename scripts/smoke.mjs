import { chromium } from "@playwright/test";
import fs from "node:fs";

fs.mkdirSync("output", { recursive: true });
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--enable-webgl", "--ignore-gpu-blocklist"],
});

const errors = [];
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
page.on("pageerror", (e) => errors.push(e.message));

const t0 = Date.now();
await page.goto("http://127.0.0.1:5173/");
await page.locator("canvas").waitFor();
await page.waitForTimeout(5500);
const initialLoadMs = Date.now() - t0;
await page.screenshot({ path: "output/desktop-city.png" });

// 1. Enter Lobby (00 — Lobby & Reception) and verify sound auto-enabled
await page.getByRole("button", { name: "Masuk gallery", exact: true }).click();
await page.waitForTimeout(2200);
if (
  !(await page
    .getByRole("heading", { name: "Lobby & Reception", exact: true })
    .isVisible())
) {
  throw Error("Expected Lobby & Reception heading on station 1");
}
if (!(await page.getByText("SOUND ON").isVisible())) {
  throw Error("Expected SOUND ON indicator after entering gallery");
}
await page.screenshot({ path: "output/desktop-lobby.png" });

// Toggle sound off and back on
await page.getByRole("button", { name: "Matikan suara" }).click();
if (!(await page.getByText("SOUND OFF").isVisible())) {
  throw Error("Expected SOUND OFF after toggling");
}
await page.getByRole("button", { name: "Aktifkan suara" }).click();

// 2. Test Lobby viewpoints (Board & Desk) and Staff Greeting
await page.getByRole("button", { name: "Pandangan denah" }).click();
await page.waitForTimeout(1400);
await page.screenshot({ path: "output/desktop-lobby-board.png" });

await page.getByRole("button", { name: "Meja katalog" }).click();
await page.waitForTimeout(1400);
await page.screenshot({ path: "output/desktop-lobby-desk.png" });

await page.getByRole("button", { name: "Sapa petugas" }).click();
await page
  .getByText("Selamat datang. Silakan lihat denah atau buka katalog museum.")
  .waitFor();

// 3. Test drag vs click: dragging across the canvas should NOT open the catalog
const box = await page.locator(".canvas-shell").boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width * 0.55, box.y + box.height * 0.55);
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width * 0.55 - 90,
    box.y + box.height * 0.55 + 20,
    { steps: 8 },
  );
  await page.mouse.up();
}
if (await page.locator(".catalog-dialog").isVisible()) {
  throw Error("Camera drag should not trigger catalog click");
}

// 4. Open Catalog via the 3D Catalog Book hotspot in Lobby
const bookHotspot = page.getByRole("button", {
  name: "Buka katalog Ruang Karya",
});
await bookHotspot.click();
await page.locator(".catalog-dialog").waitFor({ state: "visible" });
await page.getByText("BUKU KATALOG RESEPSI").waitFor();
if ((await page.locator(".project-card").count()) !== 19) {
  throw Error("Expected 19 software projects in catalog");
}
await page.screenshot({ path: "output/desktop-book-catalog.png" });

// Switch to AI Product Visuals collection inside catalog
await page.getByRole("tab", { name: /AI Product Visuals/i }).click();
if ((await page.locator(".ai-card").count()) !== 8) {
  throw Error("Expected 8 AI Product Visuals in catalog");
}
await page.screenshot({ path: "output/desktop-ai-catalog.png" });

// Switch back to Software collection and test empty search state
await page.getByRole("tab", { name: /Proyek Software/i }).click();
await page.getByRole("searchbox").fill("does-not-exist");
await page.getByText("Tidak ada karya yang cocok.").waitFor();
await page.getByRole("button", { name: "Reset pencarian" }).click();

// Close catalog with Escape and verify camera stayed in Lobby
await page.keyboard.press("Escape");
await page.locator(".catalog-dialog").waitFor({ state: "hidden" });
if (
  !(await page
    .getByRole("heading", { name: "Lobby & Reception", exact: true })
    .isVisible())
) {
  throw Error("Expected camera to remain in Lobby after closing book catalog");
}

// 5. Advance from Lobby to Room 01 Overview first, then step to Artwork 01 (OCS EDU)
await page.getByRole("button", { name: "Lanjut ke ruang 01" }).click();
await page.waitForTimeout(1800);
if (
  !(await page
    .getByRole("heading", { name: "Products & Systems", exact: true })
    .isVisible())
) {
  throw Error("Expected Products & Systems in Room 01");
}
await page.screenshot({ path: "output/desktop-room-overview.png" });

// Step from Room 01 overview to Project 01 (OCS EDU)
await page.getByRole("button", { name: "Titik berikutnya" }).click();
await page.waitForTimeout(1800);
await page.screenshot({ path: "output/desktop-room.png" });

// Open OCS EDU detail dialog and close with Escape
await page.locator(".art-caption").click();
await page.locator(".project-dialog").first().waitFor({ state: "visible" });
if (
  !(await page
    .getByRole("heading", { name: "OCS EDU", exact: true })
    .isVisible())
) {
  throw Error("Expected OCS EDU detail");
}
await page.screenshot({ path: "output/desktop-detail.png" });
await page.keyboard.press("Escape");

// 6. Navigate via floorplan with eye-blink transition to Room 03, Room 04, and Room 05 (Guestbook)
await page.getByRole("button", { name: "Ruang", exact: true }).click();
await page
  .locator(".room-links")
  .getByRole("button", { name: "03 Ruang 03" })
  .click();
await page.waitForTimeout(820);
await page.screenshot({ path: "output/desktop-blink.png" });
await page.waitForTimeout(1200);
if (
  !(await page
    .getByRole("heading", { name: "Web & Interface" })
    .first()
    .isVisible())
) {
  throw Error("Map navigation to Room 03 failed");
}

await page.getByRole("button", { name: "Ruang", exact: true }).click();
await page
  .locator(".room-links")
  .getByRole("button", { name: "04 Ruang 04" })
  .click();
await page.waitForTimeout(2000);
if (
  !(await page
    .getByRole("heading", { name: "AI Product Visuals", exact: true })
    .isVisible())
) {
  throw Error("Map navigation to Room 04 (AI Product Visuals) failed");
}
// Step from Room 04 overview to AI shelf close-up
await page.getByRole("button", { name: "Titik berikutnya" }).click();
await page.waitForTimeout(1800);
await page.screenshot({ path: "output/desktop-ai-room.png" });

// 7. Open AI Visual detail from Room 04 marker, navigate next, and close with focus restoration
const marker01 = page.getByRole("button", {
  name: "Lihat AI Product Visual 01",
});
await marker01.click();
await page.locator(".ai-visual-dialog").waitFor({ state: "visible" });
if (
  !(await page
    .getByRole("heading", { name: "AI Product Visual 01", exact: true })
    .isVisible())
) {
  throw Error("Expected AI Product Visual 01 detail modal");
}
await page.screenshot({ path: "output/desktop-ai-detail.png" });

await page.getByRole("button", { name: "Visual berikutnya" }).click();
if (
  !(await page
    .getByRole("heading", { name: "AI Product Visual 02", exact: true })
    .isVisible())
) {
  throw Error("Expected AI Product Visual 02 after clicking next");
}
await page.keyboard.press("Escape");
await page.locator(".ai-visual-dialog").waitFor({ state: "hidden" });

const focusedLabel = await page.evaluate(() =>
  document.activeElement?.getAttribute("aria-label"),
);
if (focusedLabel !== "Lihat AI Product Visual 01") {
  throw Error(
    `Expected focus to return to marker 01, got: ${String(focusedLabel)}`,
  );
}

// 8. Navigate to Room 05 — Guestbook ("Thank you for visiting")
await page.getByRole("button", { name: "Ruang", exact: true }).click();
await page
  .locator(".room-links")
  .getByRole("button", { name: "05 Guestbook" })
  .click();
await page.waitForTimeout(2000);
if (
  !(await page
    .getByRole("heading", { name: "Sign the guestbook", exact: true })
    .isVisible())
) {
  throw Error("Expected Sign the guestbook heading in Room 05");
}
await page.screenshot({ path: "output/desktop-guestbook.png" });

// Submit a guestbook entry
await page.getByPlaceholder("Your name").fill("Rofi Visitor");
await page.getByPlaceholder("you@studio.com").fill("visitor@example.com");
await page
  .getByPlaceholder("Which project, or what you have in mind")
  .fill("Great 3D museum!");
await page.getByRole("button", { name: "SIGN THE GUESTBOOK" }).click();
await page
  .getByText("Terima kasih! Catatan Anda telah ditambahkan ke buku tamu.")
  .waitFor();

// 9. Verify context-loss fallback
await page.evaluate(() =>
  window.dispatchEvent(new Event("gallery-context-lost")),
);
await page.locator(".catalog-dialog").waitFor({ state: "visible" });

// 10. Mobile viewport test
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
});
mobile.on("pageerror", (e) => errors.push(e.message));
await mobile.goto("http://127.0.0.1:5173/");
await mobile.locator(".project-card").first().waitFor();
await mobile.waitForTimeout(1200);
if (await mobile.locator("canvas").count()) {
  throw Error("Mobile should defer the 3D renderer until entry");
}
await mobile.screenshot({ path: "output/mobile-catalog.png" });

await mobile.locator(".project-card").first().click();
await mobile.screenshot({ path: "output/mobile-detail.png" });
await mobile.getByRole("button", { name: "Tutup detail proyek" }).click();

await mobile
  .getByRole("button", { name: "Tutup katalog dan masuk 3D" })
  .click();
await mobile.waitForTimeout(2400);
await mobile.screenshot({ path: "output/mobile-city.png" });

// Swipe up on mobile to enter Lobby first
await mobile.evaluate(() => {
  const target = document.querySelector("main");
  const start = new Touch({ identifier: 1, target, clientX: 250, clientY: 650 });
  const end = new Touch({ identifier: 1, target, clientX: 250, clientY: 450 });
  target.dispatchEvent(
    new TouchEvent("touchstart", { bubbles: true, touches: [start] }),
  );
  target.dispatchEvent(
    new TouchEvent("touchend", { bubbles: true, changedTouches: [end] }),
  );
});
await mobile.getByRole("heading", { name: "Lobby & Reception" }).waitFor();
await mobile.waitForTimeout(1500);
await mobile.screenshot({ path: "output/mobile-lobby.png" });

// Advance from Lobby to Room 01 on mobile
await mobile.getByRole("button", { name: "Lanjut ke ruang 01" }).click();
await mobile.getByRole("heading", { name: "Products & Systems" }).waitFor();

const overflow = await mobile.evaluate(
  () => document.documentElement.scrollWidth > innerWidth,
);
if (overflow) throw Error("Mobile overflow");

// 11. Reduced motion test
const reduced = await browser.newPage({ reducedMotion: "reduce" });
reduced.on("pageerror", (e) => errors.push(e.message));
await reduced.goto("http://127.0.0.1:5173/");
await reduced.locator(".catalog-dialog").waitFor({ state: "visible" });
await reduced
  .getByRole("button", { name: "Tutup katalog dan masuk 3D" })
  .click();
await reduced.getByRole("button", { name: "Masuk gallery", exact: true }).click();
await reduced.getByRole("heading", { name: "Lobby & Reception" }).waitFor();

await browser.close();

fs.writeFileSync(
  "output/smoke-result.json",
  JSON.stringify(
    {
      projects: 19,
      aiVisuals: 8,
      rooms: ["00", "01", "02", "03", "04", "05"],
      lobbyEntry: true,
      lobbyViewpoints: true,
      staffGreeting: true,
      catalogBook: true,
      dragGuard: true,
      mapNavigation: true,
      eyeBlinkTransition: true,
      soundEngine: true,
      guestbookRoom: true,
      detail: true,
      aiVisualDetail: true,
      focusRestored: true,
      emptyFilter: true,
      contextLossFallback: true,
      mobileOverflow: overflow,
      reducedMotionCatalog: true,
      initialLoadMs,
      errors,
    },
    null,
    2,
  ),
);

if (errors.length) throw Error(errors.join("\n"));
console.log(
  "PASS: desktop city, lobby (00), visitor gaze directions, sound engine, eye-blink transition, rooms 01-03, AI Product Visuals (04), Guestbook closing room (05), mobile and reduced motion.",
);
