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

    test("a blog can be deleted by its creator", async ({ page }) => {
      await createBlog(
        page,
        "a new blog can be created then deleted",
        "Playwright PW",
        "http://its-a-test.com",
      );

      const blogDiv = page.locator("div").filter({
        hasText: "a new blog can be created then deleted",
        hasNotText: "New blog created!",
      });

      await blogDiv.getByRole("button", { name: "view" }).click();

      page.on("dialog", async (dialog) => {
        await dialog.accept();
      });

      await blogDiv.getByRole("button", { name: "remove" }).click();

      await expect(
        page.getByText("Playwright PW", { exact: true }),
      ).not.toBeVisible();
    });

    test("one blog delete button is not available except for the creator", async ({
      page,
    }) => {
      await createBlog(
        page,
        "delete button not available",
        "Playwright Pw",
        "http://its-a-test.com",
      );
      await expect(
        page.getByText("Playwright Pw", { exact: true }),
      ).toBeVisible();

      await page.getByRole("button", { name: "logout" }).click();

      const blogDiv = page.locator("div").filter({
        hasText: "delete button not available",
        hasNotText: "New blog created!",
      });

      await blogDiv.getByRole("button", { name: "view" }).click();

      await expect(
        blogDiv.getByRole("button", { name: "remove" }),
      ).not.toBeVisible();
    });

    test("blogs are sorted by desc like numbers", async ({ page }) => {
      await createBlog(
        page,
        "First in order",
        "Playwright first",
        "http://its-a-test.com",
      );
      await createBlog(
        page,
        "Second in order",
        "Playwright second",
        "http://its-a-test.com",
      );
      await createBlog(
        page,
        "Last in order",
        "Playwright last",
        "http://its-a-test.com",
      );

      await page
        .locator("div")
        .filter({
          hasText: "First in order",
          hasNotText: "New blog created!",
        })
        .getByRole("button", { name: "view" })
        .click();

      await page
        .locator("div")
        .filter({
          hasText: "Second in order",
          hasNotText: "New blog created!",
        })
        .getByRole("button", { name: "view" })
        .click();

      await page
        .locator("div")
        .filter({
          hasText: "Last in order",
          hasNotText: "New blog created!",
        })
        .getByRole("button", { name: "view" })
        .click();

      await page
        .locator("div")
        .filter({
          hasText: "First in order",
          hasNotText: "New blog created!",
        })
        .getByRole("button", { name: "like" })
        .click();
      await expect(
        page
          .locator("div")
          .filter({
            hasText: "First in order",
            hasNotText: "New blog created!",
          })
          .getByText("likes 1"),
      ).toBeVisible();

      await page
        .locator("div")
        .filter({
          hasText: "Second in order",
          hasNotText: "New blog created!",
        })
        .getByRole("button", { name: "like" })
        .click();
      await expect(
        page
          .locator("div")
          .filter({
            hasText: "Second in order",
            hasNotText: "New blog created!",
          })
          .getByText("likes 1"),
      ).toBeVisible();

      await page
        .locator("div")
        .filter({
          hasText: "First in order",
          hasNotText: "New blog created!",
        })
        .getByRole("button", { name: "like" })
        .click();
      await expect(
        page
          .locator("div")
          .filter({
            hasText: "First in order",
            hasNotText: "New blog created!",
          })
          .getByText("likes 2"),
      ).toBeVisible();

      const blogs = page.locator(".blog");

      await expect(blogs.first()).toContainText("First in order");
      await expect(blogs.last()).toContainText("Last in order");

      const expectedLikes = ["likes 2", "likes 1", "likes 0"];
      for (let index = 0; index < 3; index++) {
        const blog = blogs.nth(index);
        const likesDiv = await blog
          .getByRole("button", { name: "like" })
          .locator("..");

        await expect(likesDiv).toContainText(expectedLikes[index]);
      }
    });
  });
});
