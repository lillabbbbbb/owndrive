/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

describe("User Files E2E Test", () => {
  const username = "username1";
  const password = "password123!";
  const BASE_API = "http://localhost:8000/";

  before(() => {
    // 1️⃣ Reset DB (test-only API)
    cy.request("POST", `${BASE_API}/test/reset-db`);

    // 2️⃣ Create user via API
    cy.request("POST", `${BASE_API}/users`, {
      username,
      email: "username1@example.com",
      password_hash: password, // backend should hash it
      language: "en",
      mode: "light",
      files: [],
    });
  });

  it("Logs in the user", () => {
    cy.visit("/login");

    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Check login success
    cy.url().should("include", "/dashboard");
    cy.contains(`Welcome, ${username}`);

    // Store auth token if your app uses JWT in localStorage
    cy.window().then((win) => {
      const token = win.localStorage.getItem("authToken");
      expect(token).to.exist;
      Cypress.env("authToken", token);
    });
  });

  it("Creates 5 files via API", () => {
    const token = Cypress.env("authToken");
    for (let i = 0; i < 5; i++) {
      const filePayload = {
        created_at: new Date().toISOString(),
        last_edited_at: new Date().toISOString(),
        file_type: faker.helpers.arrayElement(["doc", "txt", "md"]),
        filename: faker.system.fileName(),
        content: faker.lorem.paragraphs(2),
        canView: [], // could add user IDs
        canEdit: [], // could add user IDs
        visibleToGuests: false,
        showsInHomeShared: false,
        private: true,
        status: "active",
        inUse: false,
      };

      cy.request({
        method: "POST",
        url: `${BASE_API}/files`,
        body: filePayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        expect(res.status).to.eq(201);
        cy.log(`Created file: ${res.body.filename}`);
      });
    }
  });

  it("Checks that files appear in the UI", () => {
    cy.visit("/dashboard/files");

    // Wait for files to load
    cy.get(".file-item").should("have.length.at.least", 5);

    // Check first file content
    cy.get(".file-item").first().within(() => {
      cy.get(".filename").should("exist");
      cy.get(".file-type").should("exist");
    });
  });
});
