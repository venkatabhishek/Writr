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
        imgElement.classList.add("unsplash-img")

        // caption
        const captionElement = document.createElement('figcaption');
        captionElement.innerText = value.caption;
        
        node.appendChild(imgElement);
        node.appendChild(captionElement);

        node.setAttribute('align', 'center');
        node.dataset.caption = value.caption;
        node.dataset.src = value.src;

        return node;
    }

    static value(node) {
        return { src: node.dataset.src, caption: node.dataset.caption };
    }

}

Figure.blotName = 'figure';
Figure.tagName = 'figure';
Figure.className = 'figure';

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

var macy = Macy({
    container: '.image-results',
    margin: 5,
    columns: 5,
    breakAt: {
        1200: 5,
        940: 3,
        520: 2,
        400: 1
    }
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
        url: "/articles/search",
        data: {
            q: query,
            page: page
        }
    }).done(function (data) {
        data.results.forEach(img => {
            var sizeOrder = ['small', 'thumb']
            var actualOrder = ['large','regular', 'medium']
            
            var size = sizeOrder.filter(item => item in img.urls)[0] || ""
            var actual = actualOrder.filter(item => item in img.urls)[0] || ""
            var name = img.user.name || img.user.username;

            var item = new Image()
            item.setAttribute('class', 'image-option')
            item.setAttribute('src', img.urls[size]);
            item.setAttribute('alt', 'image')
            item.dataset.url = img.urls[actual]
            item.dataset.author = name;
            item.style.width = "300px"


            $('.image-results').append(item);

            item.onload = function(){
                macy.recalculate();
            }
        })


    }).fail(function (err) {
        console.log(err)
    }).always(function(){
        $(".image-option").click(function (e) {

            var img = $(e.currentTarget)
        
            quill.insertEmbed(quill.getSelection(), 'figure', {
                caption: `Photo by ${img.data('author')} on Unsplash`,
                src: img.data('url')
            });
            $(".image-wrapper").hide();
        
        })

        macy.runOnImageLoad(function () {
            macy.recalculate(true);
          }, true);
        
    })
}

$("form#unsplash-search").submit(function (e) {
    e.preventDefault();

    var query = $(".image-search-input").val();
    $(".image-results").empty()

    getImages(query, 1);

})

