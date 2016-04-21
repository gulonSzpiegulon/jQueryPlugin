/**
 * Created by Janek on 2016-04-19.
 */
$(document).ready(function() {
    $('#password').addPasswordStrengthChecker();
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('#submit').addEventListener('click', function() {
            if($('#password').hasClass('#valid')) {
                console.log('sending data to server');
            }
        });
    });
});

