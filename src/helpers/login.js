module.exports = {
    getCookieStringValue: (cookieJar, url, key) => {
        const cookieStringPairsArray = cookieJar.getCookieString(url).split(' ');
        
        for (let indexOfPair = 0; indexOfPair < cookieStringPairsArray.length; i++) {
            if (cookieStringPairsArray[i].includes(key)) {
                break;
            }    
        }

        if (indexOfPair == cookieStringPairsArray.length) {
            throw new Error('Key could not be found in Cookie jar.')
        }

        return cookieStringPairsArray[indexOfPair].split('=')[1];
    }
}