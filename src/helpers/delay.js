module.exports = {
    delay: (userCount) => {
        let delayMs = 0;
        if (userCount >= 3500) {
            const lambd = 0.7;
            const expRandom = (-Math.log(1.0 - Math.random()) / lambd);
            delayMs = Math.min(expRandom * 1000, 5000);
        } else {
            delayMs = 39;
        }
        return delayMs;
    }
}