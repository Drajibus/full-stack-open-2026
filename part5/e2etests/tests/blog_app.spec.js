const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });
    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByRole("button", { name: "log in" })).toBeVisible();
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
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(
        page,
        "a new blog can be created",
        "Playwright",
        "http://its-a-test.com",
      );
      await expect(page.getByText("Playwright", { exact: true })).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await createBlog(
        page,
        "a new blog can be created",
        "Playwright",
        "http://its-a-test.com",
      );
      await expect(page.getByText("Playwright", { exact: true })).toBeVisible();

      const blogDiv = page.locator("div").filter({
        hasText: "a new blog can be created",
        hasNotText: "New blog created!",
      });

      await blogDiv.getByRole("button", { name: "view" }).click();

      await blogDiv.getByRole("button", { name: "like" }).click();

      const textAfter = blogDiv
        .getByRole("button", { name: "like" })
        .locator("..");

      await expect(textAfter).toContainText("likes 1");
    });
  });
});
