$(document).ready(function() {
    $('#fileupload').fileupload({
        url:'/upload',
        dataType: 'json',
        done: function(e, data) {
            console.log(data.result.files);
            $.each(data.result.files, function(index, file) {
                $('<p/>').text(file.name).appendTo(document.body);
            });
        }
    });
});
