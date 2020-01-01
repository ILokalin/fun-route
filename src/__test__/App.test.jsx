import React from 'react';
import faker from 'faker';
import puppeteer from 'puppeteer';


const width = 1920,
      height = 1080;

let page,
    browser;


beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 80,
    args: [`--window-size=${width},${height}`]

  });

  page = await browser.newPage();

  const context = browser.defaultBrowserContext();
  await context.overridePermissions('http://localhost:3000/', ['geolocation']);

  await page.setViewport({width, height});
  await page.goto('localhost:3000');

})


afterAll(() => {
  browser.close();
})


describe('E2E', () => {
  test('wait for hidden preloader', async () => {
    await page.waitForSelector('.map-region__map');
    await page.waitFor(3000);

    const mapRegion = await page.$('.map-region__map--hidden');

    expect(mapRegion).toEqual(null)
  }, 20000)


  test('set start location', async () => {
    await page.setGeolocation({latitude: 59.95, longitude: 30.31667});

  }, 10000)


  test('user can create first new point', async () => {
    const address = faker.address.city();

    await page.waitForSelector('.new-point');    
    await page.click('input[name=address]');    
    await page.type('input[name=address]', address);

    await page.click('.new-point__add-button')
    await page.waitForSelector('.route__item');

    const routeItemText = await page.$eval('.route__item-name', el => el.textContent);
    expect(routeItemText).toEqual(address)
  }, 16000)


  test('user can create second new point', async () => {
    const address = faker.address.city();

    await page.mouse.move(721,466);
    await page.mouse.down('left');
    await page.mouse.move(850,550);
    await page.mouse.up();
    
    await page.click('input[name=address]');
    await page.type('input[name=address]', address);

    await page.click('.new-point__add-button');
    await page.waitForSelector('.route__item');

    const routeItemText = await page.$$eval('.route__item-name', el => el[1].textContent);
    expect(routeItemText).toEqual(address);
  }, 16000);


  test('user can drag point', async () => {
    const oldAddressPoint = await page.$$eval('.route__item-address', el => el[0].textContent);
    await page.mouse.move(723, 493);
    await page.mouse.down('left');
    await page.mouse.move(300, 550);
    await page.mouse.up();

    await page.waitFor(1000);

    const newAddressPoint = await page.$$eval('.route__item-address', el => el[0].textContent);

    expect(oldAddressPoint === newAddressPoint).toEqual(false);
  }, 16000)


  test('user can change show type of route', async () => {
    await page.click('.route-type__toggle-marker');

  }, 16000)


  test('user can create point and reordering route', async () => {
    const address = faker.address.city();

    await page.waitForSelector('.new-point');    
    await page.click('input[name=address]');    
    await page.type('input[name=address]', address);
    await page.click('.new-point__add-button');
    await page.waitFor(200);
    

    await page.$$eval('button[value=up]', el => el[2].click())
    await page.$$eval('button[value=up]', el => el[1].click())

    await page.$$eval('button[value=up]', el => el[0].click())
    await page.$$eval('button[value=down]', el => el[2].click())
    await page.$$eval('button[value=down]', el => el[0].click())
    

    const routeItemText = await page.$$eval('.route__item-name', el => el[1].textContent);
    expect(address).toEqual(routeItemText);
  }, 16000)


  test('user can change page', async () => {
    await page.click('.header__menu-item');

    await page.waitForSelector('.help');
    await page.waitForSelector('.help-card');
  }, 16000)


  test('user can  return to map page', async () => {
    await page.click('.header__logo');

    await page.waitForSelector('.map-region__map')
    await page.waitFor(3000);

    const mapRegion = await page.$('.map-region__map--hidden');

    expect(mapRegion).toEqual(null)
  }, 16000)


  test('user can delete all point', async () => {
    await page.$$eval('button[value=remove]', el => el[0].click())
    await page.$$eval('button[value=remove]', el => el[0].click())
    await page.$$eval('button[value=remove]', el => el[0].click())

  }, 16000)

  test('user mistake in link', async () => {
    await page.goto('localhost:3000/g');
    await page.waitForSelector('.error-page');

    await page.click('.error-page__link');
    await page.waitForSelector('.map-region__map')
  })
});
