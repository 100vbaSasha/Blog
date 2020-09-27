
$(function() {
    //remove errors
    function removeErrors() {
        $('form.login p.error, form.register p.error').remove();
        $('form.login input, form.register input').removeClass('error');
    }
    // toggle
    var flag = true;
    $('.switch-button').on('click', function(e) {
        e.preventDefault();

        $('input').val('');
        removeErrors();

        if(flag) {
            flag = false;
            $('.register').show('slow');
            $('.login').hide();
        } else {
            flag = true;
            $('.login').show('slow');
            $('.register').hide();
        }
    });

    //clear
    $('input').on('focus', function() {
        removeErrors();
    })

    //register
    $('.register-button').on('click', function (e) {
        e.preventDefault();
        removeErrors();

        let data = {
            login: $('#register-login').val(),
            name: $('#register-name').val(),
            surname: $('#register-surname').val(),
            password: $('#register-password').val(),
            passwordConfirm: $('#register-password-confirm').val()
        };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/api/auth/register'
        }).done(function (data) {
            if(!data.ok) {
                $('.register h2').after('<p class="error">' + data.error + '</p>');
                if(data.fields) {
                    data.fields.forEach(function(item) {
                        $('input[name=' + item + ']').addClass('error');
                    });
                }
            } else {
                $('.register h2').after('<p class="success">Отлично!</p>');
                
            }
        });
    });

    //login
    $('.login-button').on('click', function (e) {
        e.preventDefault();
        removeErrors();

        let data = {
            login: $('#login-login').val(),
            password: $('#login-password').val()
        };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/api/auth/login'
        }).done(function (data) {
            if(!data.ok) {
                $('.login h2').after('<p class="error">' + data.error + '</p>');
                if(data.fields) {
                    data.fields.forEach(function(item) {
                        $('input[name=' + item + ']').addClass('error');
                    });
                }
            } else {
                $('.login h2').after('<p class="success">Отлично!</p>');
                $(location).attr('href', '/');
            }
        });
    });
});
$(function() {
    function removeErrors() {
        $('.post-form p.error').remove();
        $('.post-form input, #post-body').removeClass('error');
    }

    //clear
    $('.post-form input, #post-body').on('focus', function() {
        removeErrors()
    });

    //publish
    $('.publish-button').on('click', function (e) {
        e.preventDefault();
        removeErrors();

        var data = {
            title: $('#post-title').val(),
            body: $('#post-body').val()
        };
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/post/add'
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
    });

    //upload
    $('#fileinfo').on('submit', function (e) {
        e.preventDefault();

        let formData = new FormData(this);
        $.ajax({
            type: 'POST',
            url: '/upload/image',
            data: formData,
            processData: false,
            contentType: false,
            success: function(r) {
                console.log(r);
            },
            error: function(e) {
                console.log(e);
            }
        });
    });
});
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