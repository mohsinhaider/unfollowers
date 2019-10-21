const express = require('express');
const { metadata } = require('../requests/metadata') 

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
        // Move non-follower USERID catch switch here
        return res.sendStatus(500);
    }

    res.status(200).send(metadataPayload);
});

module.exports = router;