module.exports = {
    compareWithLimit: (req, res, next) => {
        const targetInstagramUserMetadata = req.body.metadata;

        if (targetInstagramUserMetadata.followerCount > 4000 || targetInstagramUserMetadata.followingCount > 4000) {
            return res.status(200).send({ error: 'Oops! Your followers or following count is above 4000.' });
        }

        return next();
    }
}