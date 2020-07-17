const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const keys = require('../config/keys');
const requireLogin = require('../middlewares/requireLogin');

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
    region: 'ap-south-1'
})
module.exports = app => {
    app.get('/api/upload', requireLogin, (req, res, next) => {
       // 'myUserId/lsdfsfsdf.jpeg'
       const key = `${req.user.id}/${uuid()}.jpeg`;
        s3.getSignedUrl('putObject', {
           Bucket: 'my-blog-bucket-0404',
           ContentType: 'image/jpeg',
           Key: key
       }, (err, url) => res.send({key, url}));

    });

};



