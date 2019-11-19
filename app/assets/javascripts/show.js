if(typeof Figure === "undefined"){
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

}




var quill = new Quill('#content', {
    readOnly: true,
});

quill.setContents(content);

// comment controls

// reply

$('.action[data-type="reply"]').click(function (e) {

    let id = e.currentTarget.dataset.id;
    $('.reply[data-id="' + id + '"]').toggle()

})

// delete - for now simply delete comment + children

$('.action[data-type="delete"]').click(function (e) {

    let id = e.currentTarget.dataset.id;

    $.ajax({
        method: "DELETE",
        url: "/comments/" + id
    }).done(function() {
        window.location.reload()
    }).fail(function(e) {
        console.log(e)
    })

})

// edit 

$('.action[data-type="edit"]').click(function (e) {

    let curr = e.currentTarget;

    let id = curr.dataset.id;
    let content = curr.innerText;

    // hide actions

    $(e.currentTarget).parent().hide();

    // replace body with form

    $('.comment-body[data-id="'+id+'"]').attr('contenteditable', true)


    // edit form
    
    // cancel

})
