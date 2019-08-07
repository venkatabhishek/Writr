$(document).ready(function(){
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