module.exports = {
    delay: () => {
        const lambd = 0.7;
        const expRandom = (-Math.log(1.0 - Math.random()) / lambd);
        return Math.min(expRandom * 1000, 5000);
    }
}