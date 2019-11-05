module.exports = {
    delay: (userCount) => {
        let delayMs = 0;

        if (userCount <= 4000) {
            delayMs = 39;
        }
 
        return delayMs;
    }
}