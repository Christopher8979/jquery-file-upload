var express = require('express');
var router = express.Router();
var fs = require('fs');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});


var JFUM = require('jfum');
var jfum = new JFUM({
    minFileSize: 100, // 0 kB
    maxFileSize: 5242880, // 5 mB
    acceptFileTypes: /\.(doc?x|pdf|zip)$/i // gif, jpg, jpeg, png
});


router.options('/upload', jfum.optionsHandler.bind(jfum));

router.post('/upload', jfum.postHandler.bind(jfum), function(req, res) {
    // Check if upload failed or was aborted
    if (req.jfum.error) {
        // req.jfum.error
        console.log(req.jfum.error);
        res.status(400).jsonp({
            'error': req.jfum.error
        });
    } else {
        async.each(req.jfum.files, function(file, callback) {

            // Perform operation on file here.
            console.log('Processing file ' + file);

            // Check if file has errors
            if (file.errors.length > 0) {
                for (var j = 0; j < file.errors.length; j++) {
                    file.errors[j].code
                    file.errors[j].message
                }
                callback(file);

            } else {

                var encoding = '';

                fs.readFile(file.path, function(err, data) {
                    if (err) throw err;
                    file.buffer = data;
                    console.log('field - ', file.field); // - form field name
                    console.log('path - ', file.path); // - full path to file on disk
                    console.log('name - ', file.name); // - original file name
                    console.log('size - ', file.size); // - file size on disk
                    console.log('mime - ', file.mime); // - file mime type
                    console.log('\n\n');

                    callback();
                    // console.log(data);
                });

            }
        }, function(err) {
            // if any of the file processing produced an error, err would equal that error
            if (err) {
                // One of the iterations produced an error.
                // All processing will now stop.
                console.log(req.jfum.error);
                res.status(400).jsonp({
                    'AllFilesWithErrors': req.jfum.files,
                    'error': err
                });
            } else {
                res.status(200).jsonp({
                    'files': req.jfum.files
                });
            }
        });
    }
});



module.exports = router;
