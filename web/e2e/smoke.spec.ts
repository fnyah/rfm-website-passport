import { expect, test, type Page } from "@playwright/test";

// Seeded by scripts/seed.cjs.
const ADMIN = { username: "admin", password: "devpassword123" };

const publicPages = [
  { path: "/", text: "Public History Field School" },
  { path: "/about", text: "Keynote at the Ontario History Educators Conference" },
  { path: "/projects", text: "Mapping Kensington Market" },
  { path: "/blog", text: "Teaching with Primary Sources" },
];

for (const { path, text } of publicPages) {
  test(`public ${path} renders seeded content`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByText(text).first()).toBeVisible();
  });
}

test.describe("at 390px wide", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const path of ["/", "/projects"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBe(0);
    });
  }
});

test("legacy plain text keeps its paragraphs", async ({ page }) => {
  await page.goto("/");
  const article = page.locator("article", { hasText: "Legacy Oral History Seminar" });
  const paragraphs = article.locator(".prose-content > p");
  await expect(paragraphs).toHaveCount(2);
  await expect(paragraphs.nth(0).locator("br")).toHaveCount(1);
  await expect(paragraphs.nth(1)).toHaveText(
    "The seminar ends with a public listening night & discussion."
  );
});

async function signIn(page: Page) {
  await page.getByLabel("Username").fill(ADMIN.username);
  await page.getByLabel("Password").fill(ADMIN.password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

test("admin: sign-in gate, add and delete a course", async ({ page }) => {
  // Anonymous visitors are sent to the login page.
  await page.goto("/admin/home");
  await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fadmin%2Fhome/);

  await signIn(page);
  await expect(page).toHaveURL(/\/admin\/home$/);
  await expect(page.getByRole("heading", { name: "Home page", level: 1 })).toBeVisible();

  // Add a course.
  const title = `E2E course ${Date.now()}`;
  await page.goto("/admin/home/new");
  await page.getByLabel("Course name").fill(title);
  const editor = page.locator(".ProseMirror");
  await editor.click();
  await editor.pressSequentially("Added by the smoke test.");
  await page.getByRole("button", { name: "Add this course" }).click();
  await expect(page.getByRole("status")).toContainText("Saved.");

  const publicPage = await page.context().newPage();
  await publicPage.goto("/");
  await expect(publicPage.getByRole("heading", { name: title })).toBeVisible();
  await publicPage.close();

  // Delete it through the confirm dialog.
  const card = page.locator("li", { has: page.getByRole("heading", { name: title }) });
  await card.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Yes, delete it" }).click();
  await expect(page.getByRole("status")).toContainText("Deleted.");
  await expect(page.getByRole("heading", { name: title })).toHaveCount(0);

  // Signing out ends the session: /admin is gated again.
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/admin/home");
  await expect(page).toHaveURL(/\/login/);
});
