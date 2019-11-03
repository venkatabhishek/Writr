
// setup

var Delta = Quill.import('delta');

// parse url
id = window.location.pathname.split("/")[2];

// get initial content
$.ajax({
    method: "GET",
    url: `/articles/${id}/content`
}).done(function (data) {
    content = new Delta(JSON.parse(data.content).ops)
    quill.setContents(content)

    initAutoSave(function (newContent) {
        updateArticle(id, newContent)
    })

}).fail(function (e) {
    console.log(e)
})

