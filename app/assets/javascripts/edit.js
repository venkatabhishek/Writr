$(document).ready(function() {

    // setup

    var Delta = Quill.import('delta');

    var save = $(".save");

    var token = $('meta[name="csrf-token"]').attr('content');

    // editor handlers

    // parse url
    var id = window.location.pathname.split("/")[2];
    var content;

    // get initial content
    $.ajax({
        method: "GET",
        url: `/articles/${id}/content`
    }).done(function(data) {
        content = new Delta(JSON.parse(data.content).ops)

        var quill = new Quill('#editor', {
            modules: {
                toolbar: {
                    container: "#toolbar",
                    handlers: {

                    }
                },
            },
            placeholder: 'Compose an epic...',
        });


        quill.setContents(content)

        var timeoutId;

        quill.on('text-change', function() {
            save.html("saving...")
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                var newContent = quill.getContents()
                var diff = content.diff(newContent)

                if (diff.ops.length > 0) {
                    content = newContent;

                    // update existing article

                    $.ajax({
                        type: 'PATCH',
                        url: '/articles/' + id,
                        data: {
                            article: {
                                content: JSON.stringify(content)
                            }
                        }

                    }).done(function(data) {

                        if (data.status == 1) {
                            save.html("saved")
                        } else {
                            save.html("error")
                        }


                    }).fail(function(err) {

                        save.html("Save failed")

                        console.log(err)
                    })




                } else {
                    save.html("")
                }

            }, 1000);

        });


    }).fail(function(e) {
        console.log(e)
    })




})