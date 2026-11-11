import { expect, test, type Page } from '@playwright/test';

const IGNORED_CONSOLE = [/Download the React DevTools/i, /GPU stall due to ReadPixels/i, /WebGL.*performance/i];

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (!IGNORED_CONSOLE.some((r) => r.test(text))) errors.push(`console: ${text}`);
  });
  return errors;
}

async function scrollToSection(page: Page, id: string) {
  await page.locator(`#${id}`).evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.waitForTimeout(400);
}

test.describe('Contour site', () => {
  test('loads without errors, renders the 3D stage and has no horizontal scroll', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Ice-cold/i);
    await expect(page.locator('canvas')).toHaveCount(1, { timeout: 20_000 });
    const box = await page.locator('canvas').boundingBox();
    expect(box?.width).toBeGreaterThan(200);

    for (const id of ['story', 'products', 'experience', 'contact']) {
      await scrollToSection(page, id);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `horizontal overflow at #${id}`).toBeLessThanOrEqual(0);
    }
    expect(errors).toEqual([]);
  });

  test('navigation moves between sections and marks the active one', async ({ page, isMobile, viewport }) => {
    await page.goto('/');
    const mobileNav = isMobile || (viewport?.width ?? 1200) < 768;
    if (mobileNav) {
      await page.getByRole('button', { name: 'Open menu' }).click();
      const menu = page.locator('#mobile-menu');
      await expect(menu).toBeVisible();
      await menu.getByRole('link', { name: 'Products' }).click();
      await expect(menu).toBeHidden();
    } else {
      await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Products' }).click();
    }
    await expect(page.locator('#products')).toBeInViewport({ ratio: 0.3 });
    if (!mobileNav) {
      await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Products' })).toHaveAttribute(
        'aria-current',
        'location',
      );
    }
  });

  test('product shelf selects a flavour and opens it in the 3D experience', async ({ page }) => {
    await page.goto('/');
    await scrollToSection(page, 'products');
    const vanilla = page.locator('#products').getByRole('button', { name: 'Vanilla', exact: true });
    await vanilla.click();
    await expect(vanilla).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'See Vanilla in 3D' }).click();
    await expect(page.locator('#experience')).toBeInViewport({ ratio: 0.5 });
    await expect(page.getByRole('radio', { name: 'Vanilla' })).toBeChecked();
  });

  test('experience controls: flavour, shake, chill and drag to spin', async ({ page, isMobile }) => {
    const errors = trackErrors(page);
    await page.goto('/');
    await scrollToSection(page, 'experience');
    await page.locator('#experience').getByText('Cherry', { exact: true }).click();
    await expect(page.getByRole('radio', { name: 'Cherry' })).toBeChecked();

    await page.getByRole('button', { name: 'Shake it' }).click();
    await expect(page.getByText(/Shaken 1 time/)).toBeAttached();

    const chill = page.getByRole('switch', { name: 'Chilled' });
    await expect(chill).toHaveAttribute('aria-checked', 'true');
    await chill.click();
    await expect(chill).toHaveAttribute('aria-checked', 'false');

    if (!isMobile) {
      // Drag across the bottle; the cursor switches to grabbing while the bottle is held.
      const vp = page.viewportSize()!;
      const x = vp.width >= 1025 ? vp.width * 0.35 : vp.width * 0.5;
      const y = vp.width >= 1025 ? vp.height * 0.5 : vp.height * 0.33;
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x + 120, y, { steps: 6 });
      const cursor = await page.evaluate(() => document.documentElement.style.cursor);
      await page.mouse.up();
      expect(cursor).toBe('grabbing');
    }
    expect(errors).toEqual([]);
  });

  test('contact form validates and sends', async ({ page }) => {
    await page.goto('/');
    await scrollToSection(page, 'contact');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByText('Enter your full name.')).toBeVisible();
    await expect(page.getByLabel('Full name')).toBeFocused();

    await page.getByLabel('Full name').fill('Playwright Tester');
    await page.getByLabel('Email address').fill('tester@example.com');
    await page.getByLabel('Subject').fill('End-to-end check');
    await page.getByLabel('Message').fill('This message was sent by the automated browser test.');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByRole('heading', { name: 'Message sent' })).toBeVisible();
    await expect(page.getByText('tester@example.com')).toBeVisible();
  });
});

test('screenshots for visual review', async ({ page }, info) => {
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveCount(1, { timeout: 20_000 });
  await page.waitForTimeout(2600);
  const dir = `e2e/screenshots/${info.project.name}`;
  await page.screenshot({ path: `${dir}/1-hero.png` });
  for (const [i, id] of ['story', 'products', 'experience', 'contact'].entries()) {
    await scrollToSection(page, id);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${dir}/${i + 2}-${id}.png` });
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${dir}/6-footer.png` });
});
