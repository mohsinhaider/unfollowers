/**
 * @file login.test.js 
 * Tests the login() request function, which logs in the server as an Instagram user and sends a 200 OK response.
 *
 * @author Mohsin Haider
 */

const app = require('../../src/app');
const supertest = require('supertest');

test('Should login an existing Instagram user', async () => {
    const response = await supertest(app)
        .get('/api/login')
        .expect(200);
});