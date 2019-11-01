const { login } = require('../requests/login');

module.exports = {
    botLogin: async (req, res, next) => {
        try {
            const accountNumber = Math.floor(Math.random() * 3) + 1;

            if (accountNumber === 1) { // strawsapp_avondale
                req.csrfTokenValue = "sPWbSBStGHoa6HgTgbXsC43SBVG6hjY8";
                req.sessionId = "23094727907%3AmNXfDHODQF1aPX%3A25";
            } 
            else if (accountNumber === 2) { // strawsapp_bucktown
                req.csrfTokenValue = "6egDPzQzJIwAuIuBmrZOPJVXaLCTBdKB";
                req.sessionId = "23126523015%3AKZHuB6SBSFGh37%3A0";
            }
            else if (accountNumber == 3) { // strawsapp_douglas
                req.csrfTokenValue = "jyotFHoOfZwp5OF1WHL5cbobFIqZUxyZ";
                req.sessionId = "23289411621%3Adbm5EnLzL0JZvg%3A14";
            }
            
            next();
        }
        catch (error) {
            console.log(`Login process failed. Error message: ${error}`);
        }
    }
}