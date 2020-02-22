$(document).ready(function(){
    AOS.init();

    $("a.scroll-btn").click(function( event ) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: $($(this).attr("href")).offset().top }, 1200);
    });

    $("#play-video").click(function( event ) {
        $(".video-block-wrapper").addClass("reveal");
        $('#video-embed').attr('src', $('#video-embed').attr('src')+"&autoplay=1");
    });
});