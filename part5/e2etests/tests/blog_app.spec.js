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

    await request.post("/api/users", {
      data: {
        name: "Jean Sibelius",
        username: "jsibel",
        password: "finlandia",
      },
    });

    const loginResponse = await request.post("/api/login", {
      data: {
        username: "mluukkai",
        password: "salainen",
      },
    });

    const loginData = await loginResponse.json();
    const token = loginData.token;

    await request.post("/api/blogs", {
      data: {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 0,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const loginResponse2 = await request.post("/api/login", {
      data: {
        username: "jsibel",
        password: "finlandia",
      },
    });

    const loginData2 = await loginResponse2.json();
    const token2 = loginData2.token;

    await request.post("/api/blogs", {
      data: {
        title: "Writing long musical pieces",
        author: "A musician",
        url: "http://listen.com",
        likes: 0,
      },
      headers: {
        Authorization: `Bearer ${token2}`,
      },
    });

    await page.goto("/");
  });

  test("Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed", async ({
    page,
  }) => {
    await page.getByText("Canonical string reduction").click();

    expect(page.getByRole("heading")).toContainText(
      "Canonical string reduction",
    );
    expect(page.getByRole("heading")).toContainText("Edsger W. Dijkstra");

    expect(
      page.getByRole("link", {
        name: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      }),
    ).toBeVisible();

    expect(page.getByText("likes 0")).toBeVisible();
    expect(page.getByText("Added by Matti Luukkainen")).toBeVisible();

    await expect(page.getByRole("button", { name: "like" })).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "remove" }),
    ).not.toBeVisible();
  });

  test("Login form is shown", async ({ page }) => {
    await page.getByRole("link", { name: "login" }).click();
    await expect(page.getByRole("button", { name: "log in" })).toBeVisible();
  });

  describe("Login", () => {
    test("Login succeeds with the correct username/password combination", async ({
      page,
    }) => {
      await page.getByRole("link", { name: "login" }).click();
      await loginWith(page, "mluukkai", "salainen");
      await expect(page.getByText("Connected as")).toBeVisible();
    });

    test("Login fails if the username/password is incorrect", async ({
      page,
    }) => {
      await page.getByRole("link", { name: "login" }).click();

      await loginWith(page, "mlukai", "salanen");

      await expect(page.getByText("Wrong username or password")).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByRole("link", { name: "login" }).click();
      await loginWith(page, "mluukkai", "salainen");
    });

    test("Authenticated users who are not the blog’s creator are shown only the like button", async ({
      page,
    }) => {
      await page.getByText("Writing long musical pieces").click();

      await expect(page.getByRole("button", { name: "like" })).toBeVisible();
      await expect(
        page.getByRole("button", { name: "remove" }),
      ).not.toBeVisible();
    });

    test("The blog’s creator is also shown the delete button", async ({
      page,
    }) => {
      await page.getByText("Canonical string reduction").click();

      await expect(page.getByRole("button", { name: "like" })).toBeVisible();
      await expect(page.getByRole("button", { name: "remove" })).toBeVisible();
    });

    test("A logged-in user can create a blog", async ({ page }) => {
      await page.getByRole("link", { name: "new blog" }).click();

      await createBlog(
        page,
        "A new blog can be created",
        "Playwright",
        "http://its-a-test.com",
      );

      await expect(
        page.getByText("A new blog can be created", { exact: true }),
      ).toBeVisible();
    });

    test("A logged-in user can like blogs", async ({ page }) => {
      await page
        .getByRole("link", { name: "Writing long musical pieces" })
        .click();

      await page.getByRole("button", { name: "like" }).click();

      expect(page.getByText("likes 1")).toBeVisible();
    });

    test("A logged-in user can delete a blog", async ({ page }) => {
      await page
        .getByRole("link", { name: "Canonical string reduction" })
        .click();

      page.on("dialog", async (dialog) => {
        await dialog.accept();
      });

      await page.getByRole("button", { name: "remove" }).click();

      await expect(
        page.getByRole("link", { name: "Canonical string reduction" }),
      ).not.toBeVisible();
    });

    // test("one blog delete button is not available except for the creator", async ({
    //   page,
    // }) => {
    //   await createBlog(
    //     page,
    //     "delete button not available",
    //     "Playwright Pw",
    //     "http://its-a-test.com",
    //   );
    //   await expect(
    //     page.getByText("Playwright Pw", { exact: true }),
    //   ).toBeVisible();

    //   await page.getByRole("button", { name: "logout" }).click();

    //   const blogDiv = page.locator("div").filter({
    //     hasText: "delete button not available",
    //     hasNotText: "New blog created!",
    //   });

    //   await blogDiv.getByRole("button", { name: "view" }).click();

    //   await expect(
    //     blogDiv.getByRole("button", { name: "remove" }),
    //   ).not.toBeVisible();
    // });

    // test("blogs are sorted by desc like numbers", async ({ page }) => {
    //   await createBlog(
    //     page,
    //     "First in order",
    //     "Playwright first",
    //     "http://its-a-test.com",
    //   );
    //   await createBlog(
    //     page,
    //     "Second in order",
    //     "Playwright second",
    //     "http://its-a-test.com",
    //   );
    //   await createBlog(
    //     page,
    //     "Last in order",
    //     "Playwright last",
    //     "http://its-a-test.com",
    //   );

    //   await page
    //     .locator("div")
    //     .filter({
    //       hasText: "First in order",
    //       hasNotText: "New blog created!",
    //     })
    //     .getByRole("button", { name: "view" })
    //     .click();

    //   await page
    //     .locator("div")
    //     .filter({
    //       hasText: "Second in order",
    //       hasNotText: "New blog created!",
    //     })
    //     .getByRole("button", { name: "view" })
    //     .click();

    //   await page
    //     .locator("div")
    //     .filter({
    //       hasText: "Last in order",
    //       hasNotText: "New blog created!",
    //     })
    //     .getByRole("button", { name: "view" })
    //     .click();

    //   await page
    //     .locator("div")
    //     .filter({
    //       hasText: "First in order",
    //       hasNotText: "New blog created!",
    //     })
    //     .getByRole("button", { name: "like" })
    //     .click();
    //   await expect(
    //     page
    //       .locator("div")
    //       .filter({
    //         hasText: "First in order",
    //         hasNotText: "New blog created!",
    //       })
    //       .getByText("likes 1"),
    //   ).toBeVisible();

    //   await page
    //     .locator("div")
    //     .filter({
    //       hasText: "Second in order",
    //       hasNotText: "New blog created!",
    //     })
    //     .getByRole("button", { name: "like" })
    //     .click();
    //   await expect(
    //     page
    //       .locator("div")
    //       .filter({
    //         hasText: "Second in order",
    //         hasNotText: "New blog created!",
    //       })
    //       .getByText("likes 1"),
    //   ).toBeVisible();

    //   await page
    //     .locator("div")
    //     .filter({
    //       hasText: "First in order",
    //       hasNotText: "New blog created!",
    //     })
    //     .getByRole("button", { name: "like" })
    //     .click();
    //   await expect(
    //     page
    //       .locator("div")
    //       .filter({
    //         hasText: "First in order",
    //         hasNotText: "New blog created!",
    //       })
    //       .getByText("likes 2"),
    //   ).toBeVisible();

    //   const blogs = page.locator(".blog");

    //   await expect(blogs.first()).toContainText("First in order");
    //   await expect(blogs.last()).toContainText("Last in order");

    //   const expectedLikes = ["likes 2", "likes 1", "likes 0"];
    //   for (let index = 0; index < 3; index++) {
    //     const blog = blogs.nth(index);
    //     const likesDiv = await blog
    //       .getByRole("button", { name: "like" })
    //       .locator("..");

    //     await expect(likesDiv).toContainText(expectedLikes[index]);
    //   }
    // });
  });
});
