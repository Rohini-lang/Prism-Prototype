#!/usr/bin/env node
/**
 * Script to capture screenshots of the Stakeholder Analytics Dashboard.
 * Run with: node scripts/screenshot-dashboard.mjs
 * Requires: npm install playwright (or npx playwright install)
 */
import { chromium } from "playwright";
import { writeFileSync } from "fs";
import { join } from "path";

const BASE_URL = "http://localhost:5173/";
const OUTPUT_DIR = join(process.cwd(), "screenshots");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  try {
    // Navigate to dashboard
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(500); // Let animations settle

    // Screenshot 1: Initial state (empty state)
    const screenshot1 = await page.screenshot({ fullPage: true });
    writeFileSync(join(OUTPUT_DIR, "01-initial-empty-state.png"), screenshot1);
    console.log("Saved: screenshots/01-initial-empty-state.png");

    // Click "Run Analysis" button
    const runBtn = page.getByRole("button", { name: "Run Analysis" });
    await runBtn.click();

    // Wait 2 seconds for analysis to complete (mock uses 1.5s)
    await page.waitForTimeout(2000);

    // Screenshot 2: Results (charts, KPI chips, tables)
    const screenshot2 = await page.screenshot({ fullPage: true });
    writeFileSync(join(OUTPUT_DIR, "02-after-analysis-results.png"), screenshot2);
    console.log("Saved: screenshots/02-after-analysis-results.png");

    console.log("\nDone. Check the screenshots folder.");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
