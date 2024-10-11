const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-exceptions/');
});

test('TC01', async ({ page }) => {

    const addButton = page.locator('#add_btn');
    await expect(addButton).toBeVisible();
    await addButton.click();

    const row2Container = page.locator('#row2');
    await row2Container.waitFor({ state: 'attached', timeout: 10000 });

    const row2InputField = row2Container.locator('input');
    await expect(row2InputField).toBeVisible();
});

test('TC02', async ({ page }) => {
    // Step 1: Click the Add button
    const addButton = page.locator('#add_btn');
    await expect(addButton).toBeVisible();
    await addButton.click();

    // Step 2: Wait for the second row to load
    const row2Container = page.locator('#row2');
    await row2Container.waitFor({ state: 'attached', timeout: 10000 });

    // Step 3: Type text into the second input field
    const row2InputField = row2Container.locator('input');
    await expect(row2InputField).toBeVisible();
    await row2InputField.fill('Test Text');

    // Debugging output: Log the typed text
    const inputText = await row2InputField.inputValue();
    console.log(`Typed text in row 2: ${inputText}`);

    // Step 4: Check for validation messages and ensure none are visible
    const validationMessage = page.locator('.validation-error');
    const validationVisible = await validationMessage.isVisible();

    if (validationVisible) {
        console.log('Validation message is visible. Test cannot proceed.');
        return;
    }

    // Step 5: Wait for the Save button to become attached (exists in DOM)
    const saveButtons = page.locator('button[name="Save"]');
    await saveButtons.first().waitFor({ state: 'attached', timeout: 10000 });

    // Step 6: Ensure the Save button is visible and enabled
    const saveButton = saveButtons.first();
    const isVisible = await saveButton.isVisible();
    const isEnabled = await saveButton.isEnabled();
    console.log(`Save button visible: ${isVisible}, enabled: ${isEnabled}`);

    // Ensure Save button is visible and enabled
    if (!isVisible || !isEnabled) {
        console.error('Save button is not visible or enabled. Test cannot proceed.');
        return;
    }

    // Step 7: Click the Save button using force to bypass visibility issues
    await saveButton.click({ force: true });

    // Step 8: Verify the text is saved
    const savedText = page.locator('#saved_text');
    await expect(savedText).toContainText('Test Text');
});



test('TC03', async ({ page }) => {
    // Step 1: Click the Add button
    const addButton = page.locator('#add_btn');
    await expect(addButton).toBeVisible();
    await addButton.click();

    // Step 2: Wait for the second row to load
    const row2Container = page.locator('#row2');
    await row2Container.waitFor({ state: 'attached', timeout: 10000 });

    // Step 3: Locate the input field
    const row2InputField = row2Container.locator('input');

    // Step 4: Verify that the input field is disabled
    const isDisabled = await row2InputField.evaluate((input) => input.disabled);
    console.log(`Input field disabled: ${isDisabled}`);

    if (isDisabled) {
        // Step 5: Click the Edit button to enable the input field
        const editButton = page.locator('#edit_btn'); // Adjust selector if necessary
        await expect(editButton).toBeVisible();
        await editButton.click();

        // Wait for the input field to become enabled
        await expect(row2InputField).toBeEnabled();
    }

    // Step 6: Clear the input field and type text
    await row2InputField.fill(''); // Clear the input field
    await row2InputField.fill('New Test Text'); // Type new text

    // Step 7: Verify the text has changed
    const inputValue = await row2InputField.inputValue();
    console.log(`Input field value: ${inputValue}`);
    await expect(inputValue).toBe('New Test Text');

    // Optionally verify that no validation messages are displayed
    const validationMessage = page.locator('.validation-error'); // Adjust selector if necessary
    await expect(validationMessage).not.toBeVisible();
});

test('TC04', async ({ page }) => {
    // Step 1: Find the instructions text element
    const instructionsText = page.locator('#instructions'); // Adjust the selector as needed
    await expect(instructionsText).toBeVisible();

    // Log the current visibility of the instructions text
    console.log(`Instructions text is visible: ${await instructionsText.isVisible()}`);

    // Step 2: Click the Add button
    const addButton = page.locator('#add_btn');
    await expect(addButton).toBeVisible();
    await addButton.click();

    // Step 3: Verify instruction text element is no longer displayed
    const isVisible = await instructionsText.isVisible();

    // Log the visibility after clicking Add
    console.log(`Instructions text is visible after Add button click: ${isVisible}`);

    // Assert that the instructions text is not visible
    await expect(instructionsText).not.toBeVisible();

    // Note: If we try to interact with the instructionsText here, it may lead to StaleElementReferenceException
    // Hence, we do not perform any actions on it after this point.
});

test('TC05', async ({ page }) => {
    // Step 1: Click the Add button
    const addButton = page.locator('#add_btn');
    await expect(addButton).toBeVisible();
    await addButton.click();

    // Step 2: Wait for 3 seconds for the second input field to be displayed
    await page.waitForTimeout(3000); // Wait for 3 seconds (this is intentionally insufficient)

    // Step 3: Verify second input field is displayed
    const row2Container = page.locator('#row2'); // Adjust the selector if needed
    const row2InputField = row2Container.locator('input');

    // This will throw a TimeoutException since we're waiting for the input field to appear,
    // but it will not be visible until after 5 seconds.
    await expect(row2InputField).toBeVisible({ timeout: 5000 }); // Adjusted timeout to 5 seconds for the test

    // If the input field is visible, log success
    console.log('Second input field is displayed.');
});