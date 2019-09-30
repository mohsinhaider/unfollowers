/**
 * @file followers.test.js 
 * Tests the followers() request function, which retrieves the followers of an Instagram user.
 *
 * @author Mohsin Haider
 */

const { followers } = require('../../src/requests/followers');
const { REQUESTS_TEST_USERNAME } = require('../constants/constants');
const setup = require('../fixtures/setup');

jest.setTimeout(20000);

beforeAll(async () => {
    await setup();
});

test('Should retrieve followers of an existing Instagram user', async () => {
    const followersList = await followers(REQUESTS_TEST_USERNAME, 
        process.env.SERVER_CSRF_TOKEN_VALUE, process.env.SERVER_SESSION_ID_VALUE);
    console.debug(followersList);
    expect(followersList[0].length).toBe(24);
});

