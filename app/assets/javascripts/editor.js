$(document).ready(function() {

    var Delta = Quill.import('delta');

    var save = $(".save");

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
            var diff = newContent.diff(content)
            if (diff.ops.length > 0) {

                save.html("saved")
                content = newContent;

                //send save request

            } else {
                save.html("")
            }

        }, 1000);

    });


})