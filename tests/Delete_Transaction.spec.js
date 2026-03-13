const { test, expect } = require("@playwright/test");
const sections = require("../pageObjects/UI_Pages/pageIndex");
const path = require("path");
require("dotenv").config();

test.beforeEach("Login to AI Flow", async ({ page }) => {
    const loginPage = new sections.LoginPage(test, page);
    await loginPage.launchingApplication([process.env.base_url_env]);
    await loginPage.loginToLovable([process.env.lovableUsername], [process.env.lovablePassword]);
    await loginPage.loginWithValidCredentials([process.env.user_name], [process.env.password]);
});

test("Verify Deleting a Bank Transaction is only possible for transactions from a PDF File", async ({ page }) => {
    const cashPosting = new sections.CashPosting(test, page);
    await cashPosting.navigateToCashPosting();
    const cardCount = await cashPosting.reconciliationCards.count();
    for (let i = 0; i < cardCount; i++) {
        await cashPosting.reconciliationCards.nth(i).click();
        await cashPosting.headerDepositsInBankRFMS.waitFor({ state: 'visible' });

        const hasDeleteBtn = await cashPosting.readUploadedPdfFiles();

        if (hasDeleteBtn) {
            console.log(`Delete button found in card ${i + 1}`);
            return;
        }
    }

    throw new Error("No delete buttons found in any reconciliation card.");
});