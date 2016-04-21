/**
 * Created by Janek on 2016-04-19.
 */

//plugin przeznaczony jest do doczepiania do passwordFielda

//tworzy on miernik siły hasła obok passwordFielda oraz zmienia klase cssową passwordFielda na jedna z trzech o
//domyslnych nazwach invalid valid oraz empty

//wymaga posiadania w pliku css 3 klas o domyślnych nazwach invalid, valid oraz empty - jednakże dozwolone są
//dowolnie inne, wystarczy je przesłać za pomocą parametrów invalidClass, validClass i emptyClass

//parametr passwordStrengthMeterId o domyslnej wartości #password-strength-meter to id tworzonego przez ten plugin
//miernika siły hasła - wartość ta oczywiście też mozna zmienić

//ostatni parametr to minimalne entropia hasłą które przejdzie walidacje - domylsnie ustawiony na 47.5
//co jest odpowiednikiem entropi dla 8 znaków z prezdziału a - z, 0 - 9 oraz A - Z

//przed wysyłaniem na serwer za pomocą jakiegoś przycisku submit można sprawdzić klase passwordFielda do któego ten
//plugin jest doczepiony, czy jest ona równa tej którą ustaiwlismy jako wartośc parametru validClass lub
//jesli niczego nie zmienialismy czy jest równa .valid - jesli tak to można smiało wysyłać na serwer bowiem hasło
//pomyslnie przeszło walidacje

//lepiej zeby passwordField ze swoim labelem było zapakowane w diva w którym nic juz więcej nie będzie
//(procz dodawanego dynamicznie passwordMetera oczywiście)

(function($) {  //konstrukcja (function($) { ... } )(jQuery) zapobiega kolidowania z innymi bibliotekami również
                // wykorzystującymi znak $

    function createPasswordStrengthMeter(passwordField, passwordStrengthMeterId) {
        var passwordStrengthMeter = document.createElement('meter');  //tworzymy html'owy obiekt <meter>
        passwordStrengthMeter.setAttribute('id', passwordStrengthMeterId);  //ustawiamy atrybut id = password-strength-meter
        var parent = passwordField.parent();    //wyciągamy rodzica passwordFielda dla któego odpalilismy nasz plugin
        parent.append(passwordStrengthMeter);   //zeby dodac do niego nowo stworzony obiekt <meter>
    }

    function stylePasswordField(passwordField) {
        passwordField.addClass('empty');
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
        for (var i = 0; i < passwordValue.length; i++) {
            if (passwordValue.charAt(i) >= lowerBound && passwordValue.charAt(i) <= upperBound) {
               // console.log('password contains character beetween ' + lowerBound + ' and ' + upperBound); //sprawdzacz
                return true;
            }
        }
    }

    function areSpecialCharactersInPassword(passwordValue) {
        for (var i = 0; i < passwordValue.length; i++) {
            if ( (passwordValue.charAt(i) >= ' ' && passwordValue.charAt(i) <= '/') ||
                 (passwordValue.charAt(i) >= ':' && passwordValue.charAt(i) <= '@') ||
                 (passwordValue.charAt(i) >= '[' && passwordValue.charAt(i) <= '`') ||
                 (passwordValue.charAt(i) >= '{' && passwordValue.charAt(i) <= '~') ) {
                //console.log('special');   //sprawdzacz
                return true;
            }
        }
    }

    function caluculateStrengthOfThePassword(passwordEntropy, entropyOfStrongPassword) {
        var passwordStrength;
        if (entropyOfStrongPassword !== 0) {
            passwordStrength = passwordEntropy / entropyOfStrongPassword;
        } else {
            if (passwordEntropy !== 0) {
                passwordStrength = 1;
            } else {
                passwordStrength = 0;
            }
        }
        //console.log('entropyOfStrongPassword: ' + entropyOfStrongPassword);   //sprawdzacz
        //console.log('passwordStrength: ' + passwordStrength);   //sprawdzacz
        return passwordStrength;
    }

    function modifyPasswordStrengthMeter(passwordStrength, passwordStrengthMeterId) {
        document.getElementById(passwordStrengthMeterId).value = passwordStrength;
    }

    function validatePasswordField(passwordStrength, passwordField, invalidClass, emptyClass, validClass) {
        console.log(passwordStrength);
        if (passwordStrength === 0) {
            console.log('EMPTY');
            passwordField.removeClass(invalidClass).removeClass(validClass).addClass(emptyClass);
        } else if (passwordStrength > 0 && passwordStrength < 1) {
            console.log('INVALID');
            passwordField.removeClass(emptyClass).removeClass(validClass).addClass(invalidClass);
        } else {
            console.log('VALID');
            passwordField.removeClass(emptyClass).removeClass(invalidClass).addClass(validClass);
        }
    }

    $.fn.addPasswordStrengthChecker = function(options) {   //to jest nasza funkcja główna w niej wszystko się dzieje
        //parametry naszego pluginu
        var parameters = $.extend({
            invalidClass : 'invalid',
            emptyClass : 'empty',
            validClass : 'valid',
            passwordStrengthMeterId : '#password-strength-meter',
            entropyValueOfStrongPassword : '47.5'   //odpowiednik entropi dla małych, dużych liter oraz cyfr 8 znaków
        }, options);

        //serce naszego pluginu
        return this.each(function() {   //dzięki return zapewniamy łańcuchowosć przez each przechodzimy po wszystkich
                                        //elementach, które został przekazane do pluginu i dla każdego się on wywołuje
            createPasswordStrengthMeter($(this), parameters.passwordStrengthMeterId);
            stylePasswordField($(this));
            $(this).bind('keyup', function() {
                var entropyOfThePassword = calculateEntropyOfThePassword($(this).val());
                var strengthOfThePassword = caluculateStrengthOfThePassword(entropyOfThePassword, parameters.entropyValueOfStrongPassword);
                modifyPasswordStrengthMeter(strengthOfThePassword, parameters.passwordStrengthMeterId);
                validatePasswordField(strengthOfThePassword, $(this), parameters.invalidClass, parameters.emptyClass, parameters.validClass);
            });
        });
    };

})(jQuery);