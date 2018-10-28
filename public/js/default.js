$(document).ready(function () {
    // Bootstrap Select
    var $selectpicker = $('.selectpicker');
    $selectpicker.selectpicker();

    $('.burger-btn').click(function(){
        $('.burger-bg').fadeIn();
        $('.burger-nav').addClass('active');
        $( "body" ).css( "overflow-y", "hidden" );
    });

    $('.close-btn').click(function(){
        $('.burger-bg').fadeOut();
        $('.burger-nav').removeClass('active');
        $( "body" ).css( "overflow-y", "auto" );
    });
    $('.burger-bg').click(function () {
        $('.burger-bg').fadeOut();
        $('.burger-nav').removeClass('active');
        $( "body" ).css( "overflow-y", "auto" );
    });

});