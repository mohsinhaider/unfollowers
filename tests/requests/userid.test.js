/**
 * @file userid.test.js 
 * Tests the userid() request function, which returns an Instagram user id given an a valid, existing username.
 *
 * @author Mohsin Haider
 */

const { userid } = require('../../src/requests/userid');
const { REQUESTS_TEST_USERNAME } = require('../constants/constants');

test('Should retrieve id of an existing Instagram user', async () => {
    const instagramUserId = await userid(USERID_TEST_USERNAME);
    expect(instagramUserId).toBe('25025320');
});