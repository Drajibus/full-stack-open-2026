const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("api/testing/reset");
    await request.post("api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });
    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    const locator = page.getByRole("button", { name: "log in" });
    await expect(locator).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
      await expect(page.getByText("Connected as")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "mlukai", "salanen");
      await expect(page.getByText("Wrong username or password")).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
      await expect(page.getByText("Connected as")).toBeVisible();
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: "create new blog" }).click();
      await page
        .getByRole("textbox", { name: "title" })
        .fill("a new blog can be created");
      await page.getByRole("textbox", { name: "author" }).fill("Playwright");
      await page
        .getByRole("textbox", { name: "url" })
        .fill("http://its-a-test.com");
      await page.getByRole("button", { name: "create" }).click();
      page.pause();
      await expect(page.getByText("Playwright", { exact: true })).toBeVisible();
    });
  });
});
