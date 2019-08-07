$(document).ready(function(){

    // options menu animations

    $(".more").mousedown(function(e){
        $(e.currentTarget).addClass('down')

        var id = $(e.currentTarget).data('id');

        $(".options[data-id="+id+"]").toggle();

    }).mouseup(function(e){
        $(e.currentTarget).removeClass('down')
    })


    // options menu

    // delete article

    $(".delete").click(function(e){
        var id = $(e.currentTarget).data("id")

        $.ajax({
            method: "DELETE",
            url: "/articles/"+id
        }).done(function(){
            window.location.reload()
        }).fail(function(e){
            console.log(e)
        })
    })


})