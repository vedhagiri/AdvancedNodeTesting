const Page = require('./helpers/page');

let page;
beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await page.close();
});



describe('When logged in', async () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });
    test('can see blog create form', async () => {
        const text = await page.getContentsOf('form label');
        expect(text).toEqual('Blog Title');
    });
    // valid input testcase.
    describe('And using valid inputs', async () => {
        beforeEach(async () => {
            await page.type('.title input', 'My Title');
            await page.type('.content input', 'My Content');
            await page.click('form button');
        });

        test('Submiting takes user to the review screen', async () => {
            const text = await page.getContentsOf('h5');
            expect(text).toEqual('Please confirm your entries');
        });

        test('Submiting then saving adds blog to index', async () => {
            await page.click('button.green');
            await page.waitFor('.card');

            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');

            expect(title).toEqual('My Title');
            expect(content).toEqual('My Content');
        });
    });
    // Invalid inputs testcase 
    describe('And using invalid inputs', async () => {
        beforeEach(async () => {
            await page.click('form button');
        });

        test('the form shows an error message', async () => {
            const titleError = await page.getContentsOf('.title .red-text');
            const contentError = await page.getContentsOf('.content .red-text');
            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');
        });

    });
});

describe('User is not logged in', async () => {

    // const actions = [
    //     { 
    //         method: 'get',
    //         path: '/api/blogs'
    //     },
    //     { 
    //         method: 'post',
    //         path: '/api/blogs', 
    //         data: { title: 'T', content: 'C'}
    //     }
    // ];

    // test('Blog releated actions are prohibited', async () => {
    //     const results = await page.execRequests(actions);

    //     for(let result of results){
    //         expect(result).toEqual({ error: 'You must log in!' });
    //     }

    // });

    test('User cannot create blog post', async () => {

        const result = await page.post('/api/blogs', {
            title: "Automation testing Title",
            content: 'Automation testing content'
        });
       expect(result).toEqual({ error: 'You must log in!' });

    });

    test('User cannot get a list of blogs', async () => {
        const result = await page.get('/api/blogs');
        expect(result).toEqual({ error: 'You must log in!' });
    });

});