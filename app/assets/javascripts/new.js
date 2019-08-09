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
                    handlers: ['bold', 'italic', 'underline', 'strike']
                },
        },
        placeholder: 'Compose an epic...',

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

                        if(data.status == 1){
                            save.html("saved")
                        }else{
                            save.html("error")
                        }




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

                        window.history.pushState({}, 'Edit', `/articles/${id}/edit`);

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