$(function() {
    let commentForm;
    function refreshPage(){
        window.location.reload();
    } 

    //add form
    $('#new, #reply').on('click', function () {
        if(commentForm) {
            commentForm.remove();
        }

        commentForm =$('form.comment').clone(true, true);

        if($(this).attr('id') === 'new') {
            commentForm.appendTo('.comment-list')
        }

        commentForm.css({display: 'flex'});
    });

    //cancel
    $('form.comment .cancel').on('click', function (e) {
        e.preventDefault();
        commentForm.remove();
    });

    //publish
    $('form.comment .send').on('click', function (e) {
        e.preventDefault();
        //removeErrors();

        var data = {
            post: $(".comments").attr('id'),
            body: commentForm.find('textarea').val(),
            parent: null
        };
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/comment/add'
        }).done(function (data) {
            console.log(data);
            if(!data.ok) {
                $('.post-form h2').after('<p class="error">' + data.error + '</p>');
                if(data.fields) {
                    data.fields.forEach(function(item) {
                        $('#post-' + item).addClass('error');
                    });
                }
            } else {
                //$('.register h2').after('<p class="success">Отлично!</p>');
                $(location).attr('href', '/');
            }
        });
        refreshPage();
    });
});