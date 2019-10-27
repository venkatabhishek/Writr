// nodes + placeholders

var save = $(".save");
var id = -1;
var queryPage = 1;
var content;
var timeoutId;

// quill customization

var Embed = Quill.import('blots/block/embed')

class Figure extends Embed {
    static create(value) {
        const node = super.create();

        // image
        const imgElement = document.createElement('img');
        imgElement.src = value.src;

        // caption
        const captionElement = document.createElement('figcaption');
        captionElement.innerText = value.caption;

        node.appendChild(imgElement);
        node.appendChild(captionElement);

        node.setAttribute('align', 'center');

        return node;
    }
}

Figure.blotName = 'figure';
Figure.tagName = 'figure';

Quill.register(Figure);

var quill = new Quill('#editor', {
    modules: {
        toolbar: '#toolbar'
    },
    placeholder: 'Compose an epic...',
    scrollingContainer: '.scroll-wrapper'
});

content = quill.getContents();

// saving/updating

function initAutoSave(cb) {
    quill.on('text-change', function () {
        save.html("saving...")
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
            var newContent = quill.getContents()
            var diff = content.diff(newContent)

            if (diff.ops.length > 0) {
                content = newContent;

                cb(newContent)

            } else {
                save.html("")
            }

        }, 1000);

    });
}



// content

function updateArticle(id, content) {
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
}

// image search and insert

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
