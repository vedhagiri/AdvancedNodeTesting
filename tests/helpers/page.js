const puppeteer = require('puppeteer');
const userFactory = require('../factories/userFactory');
const sessionFactory = require('../factories/sessionFactory');

class CustomPage {

    static async build() {
        const browser = await puppeteer.launch({ headless: false});

        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get: function(target, property){
                return customPage[property] || browser[property] || page[property];
            }
        })
    }

    constructor(page) {
        this.page = page;
    }

    async login () {
        const user  = await userFactory();
        const { session, sig } = sessionFactory(user);
        await this.page.setCookie({ name: 'session', value: session});
        await this.page.setCookie({ name: 'session.sig', value: sig});
        await this.page.goto('http://localhost:3000/blogs');

        await this.page.waitFor('a[href="/auth/logout"]');
    }

    async getContentsOf(selector) {
        return this.page.$eval(selector, el => el.innerHTML);
    }

    async get(path) {
        
       return await this.page.evaluate(
            (_path) => {
                return fetch(_path, {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: { 
                        'Content-Type': 'application/json'
                    }
                }).then( res => res.json());
            }, path
        )

    }

    async post(path, body){

       return await this.page.evaluate(
            (_p, _b) => {
                return fetch(_p, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(_b)
                }).then(res => res.json());

            }, path, body
        );
    }
}

module.exports = CustomPage;