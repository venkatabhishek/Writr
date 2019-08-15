$(document).ready(function () {

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
        placeholder: 'Compost an epic...',

    });

    var content = quill.getContents();
    var timeoutId;

    quill.on('text-change', function () {
        save.html("saving...")
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
            var newContent = quill.getContents()
            var diff = content.diff(newContent)

            if (diff.ops.length > 0) {
                content = newContent;


                // send save request
                if (created) {

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
                            save.html("four foot neck")
                        } else {
                            save.html("error")
                        }




                    }).fail(function (err) {

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

                    }).done(function (data) {

                        save.html("saved")

                        id = data.id
                        created = true;

                        window.history.pushState({}, 'Bathroom', `/articles/${id}/edit`);

                    }).fail(function (err) {
                        console.log(err)
                    })
                }



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
                page: page
            }
        }).done(function (data) {
            data.results.forEach(img => {
                var size = img.urls.thumb ? img.urls.thumb : img.urls.small;

                var item = $(`
                    <div class="image-option">
                        <img src="${size}" alt="">
                    </div>
                `)

                $(".image-results").append(item);
            })


        }).fail(function (err) {
            console.log(err)
        }).always(function () {
            $('.image-results').masonry({
                itemSelector: '.image-option',
                columnWidth: 200,
                horizontalOrder: true
            });

            $(".image-option").click(function (e) {

                quill.insertEmbed(quill.getSelection(2), 'image', e.currentTarget.children[0].src);
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


})