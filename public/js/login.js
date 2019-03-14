$(function () {
    $('.form_input').keyup(function () {
        if($(this).val() != ''){
            $(this).closest('.input-effect').addClass('active');
        }
    });
    $('.form_input').each(function () {
        if($(this).val() != ''){
            $(this).closest('.input-effect').addClass('active');
        }
    });
});
