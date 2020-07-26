


module.exports = {

    isAlphaNumeric: function (str) {
        var code, i, len;

        for (i = 0, len = str.length; i < len; i++) {
            code = str.charCodeAt(i);
            if (!(code > 47 && code < 58) && // numeric (0-9)
                !(code > 64 && code < 91) && // upper alpha (A-Z)
                !(code > 96 && code < 123)) { // lower alpha (a-z)
                return false;
            }
        }
        return true;
    },
    isNumeric: function (str) {

        if (Number.isInteger(parseInt(str))) {
            return true;
        } else {
            return false;
        }

    },
    isChar: function (str) {
        var code, i, len;

        for (i = 0, len = str.length; i < len; i++) {
            code = str.charCodeAt(i);
            if (!(code > 64 && code < 91) && // upper alpha (A-Z)
                !(code > 96 && code < 123)) { // lower alpha (a-z)
                return false;
            }
        }
        return true;
    },
    passport: function (str) {
        var res = str.slice(0, 1);
        if (res === 'B') {
            let isNumeric = this.isNumeric(str.slice(1, 4));
            let isChar = this.isChar(str.slice(4, 6));
            let isAlphaNumeric = this.isAlphaNumeric(str.slice(6, 13));
            if (isNumeric && isAlphaNumeric && isChar) {
                return "UK";
            } else {
                return false;
            }

        } else if (res === 'A') {
            let isChar = this.isChar(str.slice(1, 3));
            let isAlphaNumeric = this.isAlphaNumeric(str.slice(3, 12));
            if (isAlphaNumeric && isChar) {
                return "GR";
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    response: function (showMessage, message, code, responseData) {
        var response =
        {
            statusCode: 200,
            body: JSON.stringify({
                "showMessage": showMessage,
                "responseCode": code,
                "responseStatus": code === 1 ? "Success" : "Error",
                "responseMessage": message,
                "response": responseData
            }),
            headers:
            {
                'Content-Type': 'application/json; charset=utf-8', // 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };

        return response;
        // context.succeed(response);
        // console.log("B. response sent!!!! " + JSON.stringify(response));
    },
};
