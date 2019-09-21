module.exports = {
    /**
        * Returns the value of a Cookie.
        * @param {object} cookieJar   A 'requests' package structure that holds cookies by URL
        * @param {String} url         URL in cookieJar that holds individual cookie key-value pairs.
        * @param {String} key         Key in key-value pair located in a Cookie.
    */
    getCookieStringValue: (cookieJar, url, key) => {
        const cookieStringPairsArray = cookieJar.getCookieString(url).split(' ');
        
        for (var indexOfPair = 0; indexOfPair < cookieStringPairsArray.length; indexOfPair++) {
            if (cookieStringPairsArray[indexOfPair].includes(key)) {
                break;
            }    
        }

        if (indexOfPair == cookieStringPairsArray.length) {
            throw new Error('Key could not be found in Cookie jar.')
        }

        return cookieStringPairsArray[indexOfPair].split('=')[1];
    }
}