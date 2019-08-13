$(document).ready(function () {

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
    }).done(function (data) {

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

        quill.on('text-change', function () {
            save.html("saving...")
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
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

                    }).done(function (data) {

                        if (data.status == 1) {
                            save.html("saved")
                        } else {
                            save.html("error")
                        }


                    }).fail(function (err) {

                        save.html("Save failed")

                        console.log(err)
                    })




                } else {
                    save.html("")
                }

            }, 1000);

        });

        // add image from unsplash

        $(".unsplash-image").click(function () {
            $(".image-wrapper").css("display", "flex");
        })

        $(".image-close").click(function () {
            $(".image-wrapper").hide();
        })

        $('.image-results').masonry({
            itemSelector: '.image-option',
            columnWidth: 200,
            horizontalOrder: true
        });


        function getImages(query, page) {
            $.ajax({
                method: "GET",
                url: "https://api.unsplash.com/search/photos",
                data: {
                    client_id: "45fb81ea68f0f569712dfe304925d9e7753afa93f01c4ca90ccf3ffce423652f",
                    query: query,
                    per_page: 20,
                    page: page
                }
            }).done(function (data) {
                data.results.forEach(img => {
                   var item =  $(`
                        <div class="image-option">
                            <img src="${img.urls.thumb}" alt="">
                        </div>
                    `)

                    $(".image-results").append(item).masonry('appended', item).masonry();;
                })

                


            }).fail(function (err) {
                console.log(err)
            }).always(function () {
                
            })
        }

        $("form#unsplash-search").submit(function (e) {
            e.preventDefault();

            var query = $(".image-search-input").val();
            $(".image-results").empty()

            getImages(query, 1); 

        })



    }).fail(function (e) {
        console.log(e)
    })




})