/**
 * Created by Janek on 2016-04-19.
 */

(function($) {

    function isEmpty(text) {
        if (text.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    function isLengthBetween(text, lowerLimit, upperLimit) {
        if (text.length < lowerLimit || text.length > upperLimit) {
            return false;
        } else {
            return true;
        }
    }

    function containsCharsBetween(text, lowerLimit, upperLimit) {
        for(var i = 0; i < text.length; i++) {
            if (text.charAt(i) >= lowerLimit && text.charAt(i) <= upperLimit) {
                return true;
            }
        }
        return false;
    }

    function modifyInputOutfit(input, status, invalidCssClassName, emptyCssClassName, validCssClassName) {
        switch(status) {
            case 'valid' :
                input.removeClass(invalidCssClassName).removeClass(emptyCssClassName).addClass(validCssClassName);
                break;
            case 'empty' :
                input.removeClass(invalidCssClassName).removeClass(validCssClassName).addClass(emptyCssClassName);
                break;
            case 'invalid' :
                input.removeClass(validCssClassName).removeClass(emptyCssClassName).addClass(invalidCssClassName);
                break;
        }
    }

    $.fn.addEmailValidator = function(options) {
        var params = $.extend({
            regex : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            invalidCssClassName : 'invalid',
            emptyCssClassName : 'empty',
            validCssClassName : 'valid'
        }, options);

        function checkEmailStatus(emailValue) {
            if (params.regex.test(emailValue)) {
                return 'valid';
            } else if (emailValue.length === 0) {
                return 'empty';
            } else {
                return 'invalid';
            }
        }

        return this.each(function() {
            $(this).bind('blur', function() {
                var emailInput = $(this);
                var emailValue = $(this).val();
                var emailStatus = checkEmailStatus(emailValue);
                modifyInputOutfit(emailInput, emailStatus, params.invalidCssClassName, params.emptyCssClassName, params.validCssClassName);
            });
        });
    };

    $.fn.addPasswordValidator = function(options) {
        var params = $.extend({
            minNumbOfChars : 8,
            maxNumOfChars : 20,
            smallLetters : true,
            capitalLetters : true,
            digits : true,
            specialChars : true,
            invalidCssClassName : 'invalid',
            emptyCssClassName : 'empty',
            validCssClassName : 'valid'
        }, options);

        function checkPasswordStatus(passwordValue) {
            if (isEmpty(passwordValue)) {
                return 'empty';
            } else {
                if (!isLengthBetween(passwordValue, params.minNumbOfChars, params.maxNumOfChars)) {
                    return 'invalid';
                } else {
                    if (params.smallLetters === true && !containsCharsBetween(passwordValue, 'a', 'z')) {
                        return 'invalid';
                    }
                    if (params.capitalLetters === true && !containsCharsBetween(passwordValue, 'A', 'Z')) {
                        return 'invalid';
                    }
                    if (params.digits === true && !containsCharsBetween(passwordValue, '0', '9')) {
                        return 'invalid';
                    }
                    if (params.specialChars === true &&
                        !containsCharsBetween(passwordValue, ' ', '/') &&
                        !containsCharsBetween(passwordValue, ':', '@') &&
                        !containsCharsBetween(passwordValue, '[', '`') &&
                        !containsCharsBetween(passwordValue, '{', '~')) {
                        return 'invalid';
                    }
                }
            }
            return 'valid';
        }

        return this.each(function() {
            $(this).bind('blur', function() {
                var passwordInput = $(this);
                var passwordValue = $(this).val();
                var passwordStatus = checkPasswordStatus(passwordValue);
                modifyInputOutfit(passwordInput, passwordStatus, params.invalidCssClassName, params.emptyCssClassName, params.validCssClassName);
            });
        });
    };

    $.fn.addPasswordEntropyValidator = function(options) {
        var params = $.extend({
            entropyOfStrongPassword : '47.5',   //odpowiednik entropi dla małych, dużych liter oraz cyfr 8 znaków
            invalidCssClassName : 'invalid',
            emptyCssClassName : 'empty',
            validCssClassName : 'valid'
        }, options);

        function checkPasswordStatus(passwordValue) {
            var numberOfPossibleCharacters = 0;
            if (containsCharsBetween(passwordValue, 'a', 'z')) {
                numberOfPossibleCharacters += 26;
            }
            if (containsCharsBetween(passwordValue, 'A', 'Z')) {
                numberOfPossibleCharacters += 26;
            }
            if (containsCharsBetween(passwordValue, '0', '9')) {
                numberOfPossibleCharacters += 10;
            }
            if (containsCharsBetween(passwordValue, ' ', '/') ||
                containsCharsBetween(passwordValue, ':', '@') ||
                containsCharsBetween(passwordValue, '[', '`') ||
                containsCharsBetween(passwordValue, '{', '~')) {
                numberOfPossibleCharacters += 33;
            }
            var passwordEntropy;
            if (numberOfPossibleCharacters === 0) {
                passwordEntropy = 0;
            } else {
                passwordEntropy = Math.log2(numberOfPossibleCharacters) * passwordValue.length;
            }

            if (passwordEntropy === 0) {
                return 'empty';
            } else if (passwordEntropy < params.entropyOfStrongPassword){
                return 'invalid';
            } else {
                return 'valid';
            }
        }

        return this.each(function() {
            $(this).bind('blur', function() {
                var passwordInput = $(this);
                var passwordValue = $(this).val();
                var passwordStatus = checkPasswordStatus(passwordValue);
                modifyInputOutfit(passwordInput, passwordStatus, params.invalidCssClassName, params.emptyCssClassName, params.validCssClassName);
            });
        });
    };

})(jQuery);