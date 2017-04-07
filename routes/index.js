var express = require('express');
var router = express.Router();

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



// router.post('/upload', function(req, res) {
//
//     console.log(req);
//
//     // req.file('file')
//     //     .upload({
//     //         // ...options here...
//     //     }, function whenDone(err, uploadedFiles) {
//     //         if (err) return res.negotiate(err);
//     //         else return res.ok({
//     //             files: uploadedFiles,
//     //             textParams: req.params.all()
//     //         });
//     //     });
//     // console.log('upload Url');
//     // console.log(req.files)
//     res.status(200).jsonp({
//         'message': 'dummy'
//     });
// });
//
//
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
        // Here are the uploaded files
        console.log();
        for (var i = 0; i < req.jfum.files.length; i++) {
            var file = req.jfum.files[i];

            // Check if file has errors
            if (file.errors.length > 0) {
                for (var j = 0; i < file.errors.length; i++) {
                    file.errors[j].code
                    file.errors[j].message
                }

            } else {
                console.log('File No - ', (i + 1));
                console.log('field - ', file.field); // - form field name
                console.log('path - ', file.path); // - full path to file on disk
                console.log('name - ', file.name); // - original file name
                console.log('size - ', file.size); // - file size on disk
                console.log('mime - ', file.mime); // - file mime type
                console.log('\n\n');
            }
        }
        res.status(200).jsonp({
            'result': {
                'files': req.jfum.files
            }
        });
    }
});



module.exports = router;
