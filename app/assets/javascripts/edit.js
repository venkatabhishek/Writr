$(document).ready(function() {

    // setup

    var Delta = Quill.import('delta');

    var save = $(".save");

    // parse url
    var id = window.location.pathname.split("/")[2];
    var content;
    var timeoutId;

    // get initial content
    $.ajax({
        method: "GET",
        url: `/articles/${id}/content`
    }).done(function(data) {

        var quill = new Quill('#editor', {
            modules: {
                toolbar: {
                    container: "#toolbar",
                    handlers: ['bold', 'italic', 'underline', 'strike']
                },
            },
            placeholder: 'Compose an epic...',
        });

        content = new Delta(JSON.parse(data.content).ops)
        quill.setContents(content)

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

        // add image from unsplash

        $(".unsplash-image").click(function(){
            $(".image-wrapper").css("display", "flex");
        })

        $(".image-close").click(function(){
            $(".image-wrapper").hide();
        })

        $("form#unsplash-search").submit(function(e){
            e.preventDefault();

            console.log("submitted")
        })

    }).fail(function(e) {
        console.log(e)
    })




})