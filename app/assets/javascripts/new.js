
// setup

var created = false;

initAutoSave(function (newContent) {
    if (created) {

        // update existing article

        updateArticle(id, newContent);

    } else {

        // create new article

        $.ajax({
            type: 'POST',
            url: '/articles',
            data: {
                article: {
                    content: JSON.stringify(newContent)
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
})

