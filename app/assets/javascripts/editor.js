$(document).ready(function() {

    // setup

    var Delta = Quill.import('delta');

    var save = $(".save");

    var token = $('meta[name="csrf-token"]').attr('content');

    var created = false;

    var quill = new Quill('#editor', {
        modules: {
            toolbar: {
                container: "#toolbar",
            },
        },
        placeholder: 'Compose an epic...',
        theme: "snow"
    });

    var content = quill.getContents();
    var timeoutId;

    quill.on('text-change', function() {
        save.html("saving...")
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function() {
            var newContent = quill.getContents()
            var diff = content.diff(newContent)
            console.log(diff.ops)

            if (diff.ops.length > 0) {
                content = newContent;

                //send save request
                if (created) {

                } else {
                    $.ajax({
                        type: 'POST',
                        url: '/articles',
                        data: { content: JSON.stringify(content) }
                    }).done(function(msg) {
                        save.html("saved")
                        created = true;
                    }).fail(function(err) {
                        console.log(err)
                    })
                }



            } else {
                save.html("")
            }

        }, 1000);

    });


})