// string validation

const validateString = (str, arrOfChars) => {
    isCharsValid(str);
    isBracketsOrderValid(str);
    searchForMissingOperators(arrOfChars);
}

/**
 * Ensure valid brackets in a given formula, raise erorr if not.
 * @param  str the formula which we test against  
 * @returns void
 */
const isBracketsOrderValid = (str) => {
    const errorHandling = (msg) => {
        throw {
            msg,
            code: 400
        }
    }
    const stack = [];
    for (char of str) {
        if (char === 'A') {
            stack.push(char);
        } else if (char === "Z" && stack.length) {
            stack.pop();
        } else if (char === "Z" && !stack.length) {
            // logic will work without the !stack.length but i believe it's more readable this way
            errorHandling("The brackets are not open");
        }
    }
    if (stack.length > 0) {
        errorHandling("The brackets are not closed");
    }

}

/**
 * Ensure valid chars & order in a given formula
 * @param str the formula which we test against  
 * @returns 
 */
const isCharsValid = (str) => {
    const regex = createRegexByLen(str);
    if (!regex.test(str)) {
        // string has invalid chars.
        throw {
            msg: "The formula is not valid.",
            code: 400
        }
    }
}

/**
 * fit the regex to the length of the str
 * @param  str the formula which we test against  
 * @returns regex object
 */
const createRegexByLen = (str) => {
    if (str.length == 1) {
        return new RegExp("^[0-9]")
    } else if (str.length == 2) {
        return new RegExp("^[0-9 -][0-9 ]$")
    } else {
        return new RegExp("^[0-9A -][0-9AZ+*\/ \-]+[0-9Z ]$")
    }
}

const searchForMissingOperators = (arr) => {
    const operators = ['*', '/', '+', '-'];
    arr.filter((char, index, arr) => {
        if (char === ' ') {
            arr.splice(index, 1);
            index--;
        }
        if (char === 'A' && index !== 0 && !operators.includes(arr[index - 1])) {
            throw {
                msg: "Invalid operations",
                code: 400
            }
        }
    })
}

module.exports = {
    validateString,
    searchForMissingOperators,
}