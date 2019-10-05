/**
 * @file userid.test.js 
 * Tests the userid() request function, which returns an Instagram user id given an a valid, existing username.
 *
 * @author Mohsin Haider
 */

const { metadata } = require('../../src/requests/metadata');
const { REQUESTS_TEST_USERNAME } = require('../constants/constants');

test('Should retrieve id of an existing Instagram user', async () => {
    const instagramUserId = await metadata(REQUESTS_TEST_USERNAME);
    expect(instagramUserId).toBe('25025320');
});