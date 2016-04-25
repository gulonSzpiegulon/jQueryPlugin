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

    function modifyInputOutfit(input, status, invalidCssClass, emptyCssClass, validCssClass) {
        switch(status) {
            case 'valid' :
                input.removeClass(invalidCssClass).removeClass(emptyCssClass).addClass(validCssClass);
                break;
            case 'empty' :
                input.removeClass(invalidCssClass).removeClass(validCssClass).addClass(emptyCssClass);
                break;
            case 'invalid' :
                input.removeClass(validCssClass).removeClass(emptyCssClass).addClass(invalidCssClass);
                break;
        }
    }

    $.fn.addEmailValidator = function(options) {
        var params = $.extend({
            regex : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            invalidCssClass : 'invalid',
            emptyCssClass : 'empty',
            validCssClass : 'valid'
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
            var emailInput = $(this);
            emailInput.bind('blur', function() {
                var emailStatus = checkEmailStatus($(this).val());
                modifyInputOutfit(emailInput, emailStatus, params.invalidCssClass, params.emptyCssClass, params.validCssClass);
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
            invalidCssClass : 'invalid',
            emptyCssClass : 'empty',
            validCssClass : 'valid'
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
            var passwordInput = $(this);
            passwordInput.bind('blur', function() {
                var passwordStatus = checkPasswordStatus(passwordInput.val());
                modifyInputOutfit(passwordInput, passwordStatus, params.invalidCssClass, params.emptyCssClass, params.validCssClass);
            });
        });
    };

    $.fn.addPasswordEntropyValidator = function(options) {
        var params = $.extend({
            entropyOfStrongPassword : '47.5',   //odpowiednik entropi dla małych, dużych liter oraz cyfr 8 znaków
            invalidCssClass : 'invalid',
            emptyCssClass : 'empty',
            validCssClass : 'valid'
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
            var passwordInput = $(this);
            passwordInput.bind('blur', function() {
                var passwordStatus = checkPasswordStatus(passwordInput.val());
                modifyInputOutfit(passwordInput, passwordStatus, params.invalidCssClass, params.emptyCssClass, params.validCssClass);
            });
        });
    };

    $.fn.addPostalCodeValidatorWithCityAndStreetFiller = function(options) {
        var params = $.extend({
            postalCodesCsvFileName : 'postalCodes.csv',
            cityInputId : 'city',
            streetInputId : 'street',
            invalidCssClassName : 'invalid',
            emptyCssClassName : 'empty',
            validCssClassName : 'valid'
        }, options);

        function readFromCsvFile() {
            var lines;
            $.ajax({
                type: "GET",
                url: params.postalCodesCsvFileName,
                dataType: "text",
                success: function(data, lines) {
                    lines = processData(data);
                }
            });

            function processData(csvFile) {
                var allTextLines = csvFile.split(/\r\n|\n/);
                var headers = allTextLines[0].split(',');
                var lines = new Array(allTextLines.length);
                for (var i = 1; i < allTextLines.length; i++) {
                    var data = allTextLines[i].split(',');
                    if (data.length == headers.length) {
                        lines[i] = new Array(headers.length);
                        for (var j = 0; j < headers.length; j++) {
                            lines[i].push(data[j]);
                        }
                    }
                }
                return lines;
            }

            console.log('lines'+lines);
            return lines;
        }



        function checkPostalCodeStatus(postalCodeValue, linesCsv) {
            if (isEmpty(postalCodeValue)) {
                return 'empty';
            } else {
                if (!isPostalCodeFormatCorrect(postalCodeValue)) {
                    return 'invalid';
                } else {
                    if (doesPostalCodeExist(postalCodeValue, linesCsv)) {
                        return 'valid';
                    } else {
                        return 'invalid';
                    }
                }
            }
        }

        function isPostalCodeFormatCorrect(postalCodeValue) {
            if (!(postalCodeValue.length === 6)) {
                return false;
            } else {
                for (var i = 0; i < postalCodeValue.length; i++) {
                    var char = postalCodeValue.charAt(i);
                    if (i === 2) {
                        if (char !== '-') {
                            return false;
                        }
                        continue;
                    }
                    if (!isDigit(char)) {
                        return false;
                    }
                }
            }
            return true;
        }

        function isDigit(char) {
            if (char >= '0' && char <= '9') {
                return true;
            } else {
                return false;
            }
        }

        function doesPostalCodeExist(postalCodeValue, csvLines) {
            console.log('csvLines' + csvLines);
            for (var i = 0; i < csvLines.length; i++) {
                if (postalCodeValue === csvLines[i][0]) {
                    return true;
                }
            }
            return false;
        }

        return this.each(function() {
            var postalCodeInput = $(this);
            var csvLines = readFromCsvFile();
            postalCodeInput.bind('keyup keydown', function() {
                var postalCodeStatus = checkPostalCodeStatus(postalCodeInput.val(), csvLines);
            });
        });
    };

})(jQuery);