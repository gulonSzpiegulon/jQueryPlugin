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
        console.log('|' + status + '|');
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
            invalidCssClass : 'invalid',
            emptyCssClass : 'empty',
            validCssClass : 'valid'
        }, options);

        var postalCodes;

        return this.each(function() {
            var postalCodeInput = $(this);
            postalCodeInput.bind('keyup keydown', function() {
                var postalCodeStatus = checkPostalCodeStatus(postalCodeInput.val());
                modifyInputOutfit(postalCodeInput, postalCodeStatus, params.invalidCssClass, params.emptyCssClass, params.validCssClass);
                emptyCityAndStreetOutfitIfPostalCodeStatusInvalidOrEmpty(postalCodeStatus);
            });
        });

        function checkPostalCodeStatus(postalCodeValue) {
            if (isEmpty(postalCodeValue)) {
                return 'empty';
            } else {
                if (!isPostalCodeFormatCorrect(postalCodeValue)) {
                    return 'invalid';
                } else {
                    if (postalCodes === undefined) {    //if nothing of correct format was typed to the input, postalCodes are yet undefined and they should be read from the server
                        postalCodes = readPostalCodesFromCsvFile();
                    }
                    var indexOfPostalCodeInDataBase = lookForPostalCodeInDataBase(postalCodeValue);
                    if (indexOfPostalCodeInDataBase == -1) {
                        setStreetAndCityInputsAsNotFound();
                        return 'invalid';
                    } else {
                        setStreetAndCityInputs(indexOfPostalCodeInDataBase);
                        return 'valid';
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

        function readPostalCodesFromCsvFile() {
            var postalCodesFile = getPostalCodesFileFromServer();
            return splitIntoRecords(postalCodesFile);
        }

        function getPostalCodesFileFromServer() {
            var request;
            if (window.XMLHttpRequest) {        //all modern browsers hava a built-in XMLHttpRequest object so we check if it exists
                request = new XMLHttpRequest(); //if yes, it is created and assigned to request variable
            } else {    //if no, that only happens to older browsers such as IE6 and IE5
                request = new ActiveXObject("Microsoft.XMLHTTP");   //there's created an ActiveXObject which an equivalent
            }
            var postalCodesFile;   //variable which is made for storing text data from a server
            request.onreadystatechange = function (){   //function
                if(request.readyState === 4){
                    if(request.status === 200 || request.status === 0){
                        postalCodesFile = request.responseText;
                    }
                }
            };
            request.open("GET", params.postalCodesCsvFileName, false);  //open function specifies type of request
            //here it is GET type of request, second parameter is the location of file on the server and third means that that transfer should be synchronous
            request.send(); //it sends our request to the server
            return postalCodesFile;
        }

        function splitIntoRecords(textFile) {
            var records = [];   //array records will be filled with data from textFile
            records = textFile.split(/\r\n|\n/);    //textFile is being split into lines so each record of records array is now one of the lines of the textFile
            return records;
        }

        function lookForPostalCodeInDataBase(postalCodeValue) {
            for (var i = 1; i < postalCodes.length; i++) {
                if (postalCodes[i].indexOf(postalCodeValue) !== -1) {
                    return i;
                }
            }
            return -1;
        }

        function setStreetAndCityInputsAsNotFound() {
            document.getElementById(params.cityInputId).value = "Not found!";
            document.getElementById(params.streetInputId).value = "Not found!";
        }

        function setStreetAndCityInputs(indexOfPostalCodeInDataBase) {
            var recordOfGivenIndex = [];
            recordOfGivenIndex = postalCodes[indexOfPostalCodeInDataBase].split(/;/);
            var cityInputValue = recordOfGivenIndex[2];
            var streetInputValue = getStreetNameOnlyOutOf(recordOfGivenIndex[1]);    //tu trzeba jeszcze wyciagnąc z całęj długiej nazwy tylko nazwe ulicy po ul prezz jakimkoweik numerem ani od
            document.getElementById(params.cityInputId).value = cityInputValue;
            document.getElementById(params.streetInputId).value = streetInputValue;
        }

        function getStreetNameOnlyOutOf(streetFullName) {
            var onlyStreetName;
            var startIndex = streetFullName.indexOf('ul. ');
            if (startIndex == -1) {
                startIndex = streetFullName.indexOf('Pl. ');
            }
            if (startIndex == -1) {
                startIndex = streetFullName.indexOf('Al. ');
            }
            if (startIndex == -1) { //in case of an error in database or just if I forgot about sth - maybe there are other prefixes before street name that ul. Al. and Pl.
                return streetFullName;
            }
            startIndex += 4;
            var halfProcessedStreetName = streetFullName.substring(startIndex);
            var endIndex = halfProcessedStreetName.indexOf(' od ');
            if (endIndex == -1) {
                for (var i = 1; i < 10; i++) {
                    endIndex = halfProcessedStreetName.indexOf(' ' + i);
                    if (endIndex != -1) {
                        break;
                    }
                }
            }
            if (endIndex != -1) {
                onlyStreetName = halfProcessedStreetName.substring(0, endIndex);
            } else {
                onlyStreetName = halfProcessedStreetName;
            }
            return onlyStreetName;
        }

        function emptyCityAndStreetOutfitIfPostalCodeStatusInvalidOrEmpty(postalCodeStatus) {
            if (postalCodeStatus == 'empty' || postalCodeStatus == 'invalid') {
                document.getElementById(params.cityInputId).value = "";
                document.getElementById(params.streetInputId).value = "";
            }
        }

    };

})(jQuery);