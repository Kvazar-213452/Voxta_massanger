// main.js

$(document).ready(function () {
    load_chat();

    // const $textarea = $('.input_message textarea');

    // $textarea.on('input', function () {
    //     $(this).height('auto');

    //     const scrollHeight = this.scrollHeight;
    //     const maxHeight = $(window).height() - 400;

    //     if (scrollHeight < maxHeight) {
    //         $(this).css({
    //             'overflow-y': 'hidden',
    //             'height': scrollHeight + 'px'
    //         });
    //     } else {
    //         $(this).css({
    //             'overflow-y': 'auto',
    //             'height': maxHeight + 'px'
    //         });
    //     }
    // });
});

function load_chat() {
    $.ajax({
        url: "/get_chats_post",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(null),
        success: function (response) {
            console.log(response)
        }
    });
}
