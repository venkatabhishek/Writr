$(document).ready(function () {

    // setup

    var save = $(".save");
    var created = false;
    var id = -1;

    const Parchment = Quill.import('parchment');
    const Embed = Quill.import('blots/block/embed');

    class Figure extends Embed {
        static create(value){
            let node = super.create(value);

            let image = document.createElement('img')
            image.setAttribute('src', value.src);
            image.classList.add('image-blot');

            let caption = document.createElement('a')
            caption.innerText = value.caption;
            caption.classList.add('caption-blot')

            node.appendChild(image);
            node.appendChild(caption)
            node.setAttribute('contenteditable', false);

            return node;
        }
    } 

    Figure.blotName = 'figure';
    Figure.className = 'figure'
    Figure.tagName = 'div'

    Quill.register(Figure);

    var quill = new Quill('#editor', {
        modules: {
            toolbar: '#toolbar'
        },
        placeholder: 'Compose an epic...',
        scrollingContainer: '.scroll-wrapper'
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
                            save.html("Saved")
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

                        window.history.pushState({}, '', `/articles/${id}/edit`);

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
                var actual = img.urls.full ? img.urls.full : img.url.regular
                var item = $(`
                    <div class="image-option">
                        <img src="${size}" data-url="${actual}" data-author="${img.user.name}" alt="">
                    </div>
                `)

                $(".image-results").append(item);
            })


        }).fail(function (err) {
            console.log(err)
        }).always(function () {
            var macy = Macy({
                container: '.image-results',
                trueOrder: false,
                waitForImages: true,
                margin: 10,
                columns: 4
            });

            $(".image-option").click(function (e) {

                var img = $(e.currentTarget.children[0])

                quill.insertEmbed(quill.getSelection(), 'figure', {
                    caption: `Photo by ${img.data('author')} on Unsplash`,
                    src: img.data('url')
                });
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