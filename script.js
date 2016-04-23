/**
 * Created by Janek on 2016-04-19.
 */
$(document).ready(function() {
    $('#email').addEmailValidator();
    $('#password').addPasswordValidator();
    $('#password2').addPasswordEntropyValidator();
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('#submit').addEventListener('click', function() {
            if($('#password').hasClass('#valid')) {
                console.log('sending data to server');
            }
        });
    });
});

