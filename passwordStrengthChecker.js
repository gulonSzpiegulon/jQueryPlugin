/**
 * Created by Janek on 2016-04-19.
 */

(function($) {  //konstrukcja (function($) { ... } )(jQuery) zapobiega kolidowania z innymi bibliotekami również
                // wykorzystującymi znak $

    function passwordContainsCharacters(password, lowerBound, upperBound) {
        for (i = 0; i < password.length; i++) {
            if (password.charAt(i) >= lowerBound && password.charAt(i) <= upperBound) {
                console.log("password contains character beetween " + lowerBound + " and " + upperBound);
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
                console.log("special");
                return true;
            }
        }
    }

    function calculateEntropyOfThePassword(passwordValue) {
        var numberOfPossibleCharacters = 0;
        if (passwordContainsCharacters(passwordValue, "a", "z")) {
            numberOfPossibleCharacters += 26;
        }
        if (passwordContainsCharacters(passwordValue, "A", "Z")) {
            numberOfPossibleCharacters += 26;
        }
        if (passwordContainsCharacters(passwordValue, "0", "9")) {
            numberOfPossibleCharacters += 10;
        }
        if (areSpecialCharactersInPassword(passwordValue)) {
            numberOfPossibleCharacters += 33;
        }
        console.log("number of possible chars: " + numberOfPossibleCharacters);
        var entropyOfPassword;
        if (numberOfPossibleCharacters === 0) {
            entropyOfPassword = 0;
        } else {
            entropyOfPassword = Math.log2(numberOfPossibleCharacters)*passwordValue.length;
        }
        return entropyOfPassword;
    }

    function calculateStrengthOfThePassword(passwordEntropy, entropyOfSolidPassword) {
        var passwordStrength;
        if (entropyOfSolidPassword != 0) {
            passwordStrength = passwordEntropy / entropyOfSolidPassword;
        } else {
            passwordStrength = 1;
        }
        return passwordStrength;
    }

    function displayTheBar(passwordStrengthDivId, passwordStrength) {
        if (passwordStrength = 0) {
            $(weakPasswordDiv).text("Weak");
            $(mediumPasswordDiv).text("Medium");
            $(strongPasswordDiv).text("Strong");
            $(weakPasswordDiv).css("background-color", "white");
            $(mediumPasswordDiv).css("background-color", "white");
            $(strongPasswordDiv).css("background-color", "white");
        } else if (passwordStrength > 0 && passwordStrength <= 1/3) {
            $(weakPasswordDiv).text("Weak");
            $(mediumPasswordDiv).text("Medium");
            $(strongPasswordDiv).text("Strong");
            $(weakPasswordDiv).css("background-color", "red");
            $(mediumPasswordDiv).css("background-color", "white");
            $(strongPasswordDiv).css("background-color", "white");
        } else if (passwordStrength > 1/3 && passwordStrength <= 2/3) {
            $(weakPasswordDiv).text("");
            $(mediumPasswordDiv).text("Medium");
            $(strongPasswordDiv).text("Strong");
            $(weakPasswordDiv).css("background-color", "yellow");
            $(mediumPasswordDiv).css("background-color", "yellow");
            $(strongPasswordDiv).css("background-color", "white");
        } else {
            $(weakPasswordDiv).text("");
            $(mediumPasswordDiv).text("");
            $(strongPasswordDiv).text("Strong");
            $(weakPasswordDiv).css("background-color", "green");
            $(mediumPasswordDiv).css("background-color", "green");
            $(strongPasswordDiv).css("background-color", "green");
        }
    }

    function initializePasswordStrengthDisplay(passwordStrengthDivId) {
        var weakPasswordDiv = document.createElement("div");
        var mediumPasswordDiv = document.createElement("div");
        var strongPasswordDiv = document.createElement("div");
        $(weakPasswordDiv).attr("id", "weakPasswordDiv");
        $(mediumPasswordDiv).attr("id", "mediumPasswordDiv");
        $(strongPasswordDiv).attr("id", "strongPasswordDiv");
        $(passwordStrengthDivId).append(weakPasswordDiv);
        $(passwordStrengthDivId).append(mediumPasswordDiv);
        $(passwordStrengthDivId).append(strongPasswordDiv);
        $("#weakPasswordDiv").width(100);
        $("#weakPasswordDiv").height(30);
        $("#weakPasswordDiv").text("Weak");
        $("#weakPasswordDiv").css("display", "inline-block");
        $("#mediumPasswordDiv").width(100);
        $("#mediumPasswordDiv").height(30);
        $("#mediumPasswordDiv").text("Medium");
        $("#mediumPasswordDiv").css("display", "inline-block");
        $("#strongPasswordDiv").width(100);
        $("#strongPasswordDiv").height(30);
        $("#strongPasswordDiv").text("Strong");
        $("#strongPasswordDiv").css("display", "inline-block");
    }

    function displayThePasswordStrengthBar(passwordEntropy, entropyOfSolidPassword) {
        var passwordStrength = calculateStrengthOfThePassword(passwordEntropy, entropyOfSolidPassword);
        displayTheBar(passwordStrength);
    }

    $.fn.addPasswordStrengthChecker = function(options) {   //to jest nasza funkcja główna w niej wszystko się dzieje
        //parametry naszego pluginu
        var parameters = $.extend({
            passwordStrengthDivId : "#passwordStrengthBar",
            entropyValueOfSolidPassword : "47.5"   //odpowiednik entropi dla małych, dużych liter oraz cyfr 8 znaków
        }, options);

        //serce naszego pluginu
        return this.each(function() {   //dzięki return zapewniamy łańcuchowosć przez each przechodzimy po wszystkich
                                        //elementach, które został przekazane do pluginu i dla każdego się on wywołuje
            initializePasswordStrengthDisplay(parameters.passwordStrengthDivId);
            $(this).bind("keyup", function() {
                var passwordFieldValue = $(this).val();   //podstawienie aktualnego obiektu pod zmienna p[asswordField
                console.log(passwordFieldValue);
                var entropyOfPassword = calculateEntropyOfThePassword(passwordFieldValue);
                console.log("entropy of password: " + entropyOfPassword);
                displayThePasswordStrengthBar(entropyOfPassword, parameters.entropyValueOfSolidPassword);
            });

        });
    }
})(jQuery);