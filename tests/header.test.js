const Page = require('./helpers/page');

var page;
beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000/');
});

afterEach(async () => {
    await page.close();
});

test('The header has the correct text', async () => {
    const text = await page.getContentsOf('a.brand-logo');
    expect(text).toEqual('Blogster');
});

test('Clicking login start oAuth flow', async ()=> {
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});

test('When signIn, show the logout button', async () =>{
    await page.login();
    const text = await page.getContentsOf('a[href="/auth/logout"]');
    expect(text).toEqual('Logout');
});