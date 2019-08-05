$(document).ready(function() {

    // setup

    var Delta = Quill.import('delta');

    var save = $(".save");

    var token = $('meta[name="csrf-token"]').attr('content');

    var created = false;
    var id = -1;

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

            if (diff.ops.length > 0) {
                content = newContent;

                // send save request
                if (created) {

                    // update existing article

                    $.ajax({
                        type: 'PATCH',
                        url: '/articles/'+id,
                        data: {
                            article: {
                                content: JSON.stringify(content)
                            }
                        }

                    }).done(function(data) {

                        save.html("saved")


                    }).fail(function(err) {

                        save.html("Save failed")

                        console.log(err)
                    })

                } else {

                    // create new article

                    $.ajax({
                        type: 'POST',
                        url: '/articles',
                        data: {
                            article: {
                                content: JSON.stringify(content)
                            }
                        }

                    }).done(function(data) {

                        save.html("saved")

                        id = data.id
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