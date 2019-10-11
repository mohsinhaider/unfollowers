/**
 * @file followers.test.js 
 * Tests the /nonfollower/follower GET endpoint, a route developed to provide test coverage for the followers() function.
 *
 * @author Mohsin Haider
 */

const app = require('../../src/app');
const supertest = require('supertest');

beforeAll(async (done) => {
    await supertest(app)
        .get('/api/login')
        .expect(200);
    
    done();
});

test('Should retrieve followers of an existing Instagram user', async () => {
    await supertest(app)
        .get('/api/nonfollower/follower')
        .query({
            username: 'roxy.tillerson'
        })
        .expect(200);
});

