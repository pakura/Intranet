$('.groups-title').click(function(){
    $(this).toggleClass('active');
    $(this).closest('.groups').find('.menu-list_block').slideToggle('100');
});

$('.show-comments').click(function(){
    $(this).closest('.news-feed_item').find('.comments').slideToggle('100');
});

$('.show-prev').click(function(){
    $(this).closest('.comments').find('.prev-comments').fadeIn('100');


});

$('.like-btn').click(function(){
    if ( $(this).hasClass( "active" ) ) {
        $(this).text( "მომწონს");
    } else {
        $(this).text( "მოწონებული");
    }

    $(this).toggleClass("active");
});

$('.going').click(function(){
    $(this).toggleClass('active');
});

$('.reply').click(function(){
    $(this).closest('.news-feed_item').find('.comment-txt').focus();
});

$('.click').click(function(event){
    event.preventDefault();
    $('.click-input').click();
    $('.upload-img').removeClass('click');
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('.added').attr('src', e.target.result);
            $('.image-title').html(input.files[0].name);
        };

        reader.readAsDataURL(input.files[0]);
        $('.bg').hide();
        $('.upload-img').addClass('add-trash');
    }
}

$('.new-answer').click(function(){
    $('.add-poll-block').append('<div class="answer">\n' +
        '                                                    <input type="text" placeholder="პასუხი">\n' +
        '                                                </div>');
});

$(function(){
    $('#datepicker').datepicker();
});

$('.calendar').click(function(event){
    event.preventDefault();
    $('.input-txt').click();
});

$('.paperclip-icon').click(function(event){
    event.preventDefault();
    $('.file-upload').click();
});

$('.camera-icon').click(function(event){
    event.preventDefault();
    $('.attach').click();
});

$(function () {
    $('#date-val').change(function () {
        $('.date-event').val($(this).val());
    });
});
