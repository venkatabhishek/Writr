$(document).ready(function() {

    $(document).click(function(e){
        $(".options").hide();
    })

    // postion options menu
    $(".more").each(function(e) {
        var left = this.getBoundingClientRect().left - 130;
        var id = this.getAttribute('data-id')

        $(".options[data-id=" + id + "]").css("left", `${left}px`);


    })

    $(".more").click(function(e) {

        e.stopPropagation();

        var id = $(e.currentTarget).data('id');

        $(".options:not([data-id="+id+"])").hide();

        $(".options[data-id=" + id + "]").toggle();

    })

    // options menu animations

    $(".more").mousedown(function(e) {
        $(e.currentTarget).addClass('down')

    }).mouseup(function(e) {
        $(e.currentTarget).removeClass('down')
    })


    // options menu

    // delete article

    $(".delete").click(function(e) {
        var id = $(e.currentTarget).data("id")

        $.ajax({
            method: "DELETE",
            url: "/articles/" + id
        }).done(function() {
            window.location.reload()
        }).fail(function(e) {
            console.log(e)
        })
    })

    // edit article

    $(".edit").click(function(e){
        var id = $(e.currentTarget).data("id")

        window.location = `/articles/${id}/edit`

    })


})