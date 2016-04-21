/**
 * Created by Janek on 2016-04-19.
 */

(function($) {  //konstrukcja (function($) { ... } )(jQuery) zapobiega kolidowania z innymi bibliotekami również
                // wykorzystującymi znak $

    function createPasswordStrengthMeter(passwordField, passwordStrengthMeterId) {
        var passwordStrengthMeter = document.createElement('meter');  //tworzymy html'owy obiekt <meter>
        passwordStrengthMeter.setAttribute('id', passwordStrengthMeterId);  //ustawiamy atrybut id = password-strength-meter
        var parent = passwordField.parent();    //wyciągamy rodzica passwordFielda dla któego odpalilismy nasz plugin
        parent.append(passwordStrengthMeter);   //zeby dodac do niego nowo stworzony obiekt <meter>
    }

    function modifyPasswordStrengthMeter(passwordValue, entropyOfTheStrongPassword, passwordStrengthMeterId) {
        var entropyOfThePassword = calculateEntropyOfThePassword(passwordValue);
        var strengthOfThePassword = caluculateStrengthOfThePassword(entropyOfThePassword, entropyOfTheStrongPassword);
        displayTheBar(strengthOfThePassword, passwordStrengthMeterId);
    }

    function calculateEntropyOfThePassword(passwordValue) {
        var numberOfPossibleCharacters = 0;
        if (passwordContainsCharacters(passwordValue, 'a', 'z')) {
            numberOfPossibleCharacters += 26;
        }
        if (passwordContainsCharacters(passwordValue, 'A', 'Z')) {
            numberOfPossibleCharacters += 26;
        }
        if (passwordContainsCharacters(passwordValue, '0', '9')) {
            numberOfPossibleCharacters += 10;
        }
        if (areSpecialCharactersInPassword(passwordValue)) {
            numberOfPossibleCharacters += 33;
        }
        //console.log('number of possible chars: ' + numberOfPossibleCharacters);   //sprawdzacz
        var entropyOfThePassword;
        if (numberOfPossibleCharacters === 0) {
            entropyOfThePassword = 0;
        } else {
            entropyOfThePassword = Math.log2(numberOfPossibleCharacters)*passwordValue.length;
        }
        //console.log('entropyOfThePassword: ' + entropyOfThePassword); //sprawdzacz
        return entropyOfThePassword;
    }

    function passwordContainsCharacters(passwordValue, lowerBound, upperBound) {
        for (i = 0; i < passwordValue.length; i++) {
            if (passwordValue.charAt(i) >= lowerBound && passwordValue.charAt(i) <= upperBound) {
               // console.log('password contains character beetween ' + lowerBound + ' and ' + upperBound); //sprawdzacz
                return true;
            }
        }
    }

    function areSpecialCharactersInPassword(passwordValue) {
        for (i = 0; i < passwordValue.length; i++) {
            if ( (passwordValue.charAt(i) >= " " && passwordValue.charAt(i) <= "/") ||
                 (passwordValue.charAt(i) >= ":" && passwordValue.charAt(i) <= "@") ||
                 (passwordValue.charAt(i) >= "[" && passwordValue.charAt(i) <= "`") ||
                 (passwordValue.charAt(i) >= "{" && passwordValue.charAt(i) <= "~") ) {
                //console.log('special');   //sprawdzacz
                return true;
            }
        }
    }

    function caluculateStrengthOfThePassword(passwordEntropy, entropyOfStrongPassword) {
        var passwordStrength;
        if (entropyOfStrongPassword != 0) {
            passwordStrength = passwordEntropy / entropyOfStrongPassword;
        } else {
            if (passwordEntropy != 0) {
                passwordStrength = 1;
            } else {
                passwordStrength = 0;
            }
        }
        //console.log('entropyOfStrongPassword: ' + entropyOfStrongPassword);   //sprawdzacz
        //console.log('passwordStrength: ' + passwordStrength);   //sprawdzacz
        return passwordStrength;
    }

    function displayTheBar(passwordStrength, passwordStrengthMeterId) {
        document.getElementById(passwordStrengthMeterId).value = passwordStrength;
    }

    $.fn.addPasswordStrengthChecker = function(options) {   //to jest nasza funkcja główna w niej wszystko się dzieje
        //parametry naszego pluginu
        var parameters = $.extend({
            passwordStrengthMeterId : "#password-strength-meter",
            entropyValueOfStrongPassword : "47.5"   //odpowiednik entropi dla małych, dużych liter oraz cyfr 8 znaków
        }, options);

        //serce naszego pluginu
        return this.each(function() {   //dzięki return zapewniamy łańcuchowosć przez each przechodzimy po wszystkich
                                        //elementach, które został przekazane do pluginu i dla każdego się on wywołuje
            createPasswordStrengthMeter($(this), parameters.passwordStrengthMeterId);
            $(this).bind('keyup', function() {
                modifyPasswordStrengthMeter($(this).val(), parameters.entropyValueOfStrongPassword, parameters.passwordStrengthMeterId);
            });
        });
    }

})(jQuery);