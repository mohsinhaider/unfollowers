const app = require('../src/app');
const supertest = require('supertest');

test('Should login an existing Instagram user', async () => {
    const response = await supertest(app)
        .get('/api/login')
        .expect(200);
});