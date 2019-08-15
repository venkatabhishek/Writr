$(document).ready(function () {

    // setup

    var Delta = Quill.import('delta');

    // customize image blot

    var Image = Quill.import('formats/image');
    Image.className = 'image-blot';
    Quill.register(Image, true);

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
            scrollingContainer: '#scrolling-container', 
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



        function getImages(query, page) {
            $.ajax({
                method: "GET",
                url: "https://api.unsplash.com/search/photos",
                data: {
                    client_id: "45fb81ea68f0f569712dfe304925d9e7753afa93f01c4ca90ccf3ffce423652f",
                    query: query,
                    per_page: 20,
                    page: page,
                    w: 225
                }
            }).done(function (data) {
                data.results.forEach(img => {
                    var size = img.urls.full ? img.urls.full : img.urls.regular;

                    var item = $(`
                        <div class="image-option-wrapper">
                            <img class="image-option" src="${size}" alt="">
                        </div>
                    `)

                    $(".image-results").append(item);
                })


            }).fail(function (err) {
                console.log(err)
            }).always(function () {
                $('.image-results').masonry({
                    itemSelector: '.image-option-wrapper',
                    columnWidth: 225,
                    gutter: 10,
                    horizontalOrder: true
                });

                $(".image-option").click(function (e) {

                    quill.insertEmbed(quill.getSelection(2), 'image', e.currentTarget.src);
                    $(".image-wrapper").hide();

                })
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