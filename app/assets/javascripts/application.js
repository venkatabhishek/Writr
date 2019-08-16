// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require tagify
//= require toastr.min
//= require macy
//= require rails-ujs
//= require activestorage
//= require turbolinks

$(document).ready(function() {

    var dp = $(".dropdown-content-wrapper")

    // routing helper
    $(".route").click(function(e) {
        window.location = $(e.currentTarget).data('path')
    })

    // dropdown
    $(window).click(function(){
        dp.hide();
    })

    $(".avatar").click(function(e){
        dp.toggle();
    })

    $(".dropdown").click(function(e){
        e.stopPropagation()
    })

    // logout
    $(".logout").click(function(e){
        $.ajax({
            method: "DELETE",
            url: "/logout"
        }).done(function(){
            window.location.reload()
        }).fail(function(e){
            console.log(e)
        })
    })

    // publish
    $(".publish").click(function(){
        $(".publish-wrapper").css("display", "flex");
    })

    $(".publish-close").click(function(){
        $(".publish-wrapper").hide();
    })

    $(".publish-submit").click(function(){
        var data = {
            article: {
                title: $(".publish-title").html(),
                subtitle: $(".publish-subtitle").html(),
                tags: $("input[name='tags']").val(),
                draft: false            
            }
        }

        $.ajax({
            type: 'PATCH',
            url: '/articles/' + window.location.pathname.split("/")[2],
            data: data

        }).done(function(data) {

            if (data.status == 1) {
               window.location = "/me/articles"
            } else {
                console.log("error")
            }


        }).fail(function(err) {
            console.log(err)
        })

    })

    // tagify
    var input = document.querySelector('input[name=tags]');
    var tagify = new Tagify(input) 
})