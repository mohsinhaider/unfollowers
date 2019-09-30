/**
 * @file userid.test.js 
 * Tests the userid() request function, which returns an Instagram user id given an a valid, existing username.
 *
 * @author Mohsin Haider
 */

const { userid } = require('../../src/requests/userid');

test('Should retrieve id of an existing Instagram user', async () => {
    const instagramUserId = await userid('instagram');
    expect(instagramUserId).toBe('25025320');
});