/**
 * Created by Janek on 2016-04-19.
 */
$(document).ready(function() {
    $('#email').addEmailValidator();
    $('#password').addPasswordValidator();
    $('#password2').addPasswordEntropyValidator();
    $('#postal-code').addPostalCodeValidatorWithCityAndStreetFiller();
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('#submit').addEventListener('click', function() {
            //here should be a check if all elements with validators have class valid
            //if yes, form data can be send to server :)
        });
    });
});

