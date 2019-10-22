const express = require('express');
const { metadata } = require('../requests/metadata');
const { USERID_REQUEST_ERROR_404, USERID_REQUEST_ERROR_PRIVATE_USER } = require('../constants/responses');

const router = express.Router();

router.get('/', async (req, res) => {
    const targetInstagramUsername = req.query.username;
    let rawMetadata, metadataPayload;
    rawMetadata = metadataPayload = null;

    try {
        rawMetadata = await metadata(targetInstagramUsername);
        metadataPayload = {
            metadata: {
                id: rawMetadata.id,
                username: rawMetadata.user,
                fullName: rawMetadata.full_name,
                followerCount: rawMetadata.edge_followed_by.count,
                followingCount: rawMetadata.edge_follow.count
            }
        }
    }
    catch (error) {
        switch (error) {
            case USERID_REQUEST_ERROR_404:
                return res.status(200).send({ error: 'Oops! Is your handle spelled correctly?' });
            case USERID_REQUEST_ERROR_PRIVATE_USER:
                return res.status(200).send({ error: 'Oops! Your profile must be public to use Straws.' });
            default:
                return res.status(500).send(error);
        }
    }

    res.status(200).send(metadataPayload);
});

module.exports = router;