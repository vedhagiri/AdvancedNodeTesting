const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');

var browser, page;
beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');
});

afterEach(async () => {
    await browser.close();
});
// describe('an essay on the best flavor', () => {
test('The header has the correct text', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster');
});

test('Clicking login start oAuth flow', async ()=> {
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});
// });
test('When signIn, show the logout button', async () =>{
    // const id = '5ef578a5995e666a495183eb';
    const user  = await userFactory();
    console.log('User Records:', user);
    const { session, sig } = sessionFactory(user);
    console.log(session, sig);
    // eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNWVmNTc4YTU5OTVlNjY2YTQ5NTE4M2ViIn19
    // 4_aqp6hV-e4_31yYeV6gshLdjbM
    await page.setCookie({ name: 'session', value: session});
    await page.setCookie({ name: 'session.sig', value: sig});
    await page.goto('http://localhost:3000/');

    await page.waitFor('a[href="/auth/logout"]');
    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

    console.log(text);
    expect(text).toEqual('Logout');

});


// {"_id":{"$oid":"5ef578a5995e666a495183eb"},"googleId":"112328781197817998111","displayName":"Vedhagiri Prakasam","__v":{"$numberInt":"0"}}