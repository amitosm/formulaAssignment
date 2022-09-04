// string calculation

/**connect digits to numbers and transform - operations to +
 * EXAMPLE: input-> ['-','2','2','+','1'] output ->['-22','+','1']
 * @param  arr formula string as array 
 * @returns formula string as array where 2+ digits numbers are connected and there are no - operations.
 */
const connectNeededChars = (arr) => {
    const resultArr = [];
    let resultArrPointer = -1;
    for (let i = 0; i < arr.length; i++) {
        const isLastResultElementNumber = !isNaN(Number(resultArr[resultArrPointer]));
        if (arr[i] === '-') {
            if (!i == 0 && isLastResultElementNumber) {
                // not arr[0] and resultArr[pointer] is a number
                resultArr.push('+');
                resultArrPointer += 2;
            }
            resultArr.push(`-${arr[i+1]}`);
            resultArrPointer = resultArrPointer >= 0 ? resultArrPointer : 0;
            i++

        } else if (!isNaN(Number(arr[i])) && isLastResultElementNumber) {
            // arr[i] is a number and resultArr[pointer] is a number.
            resultArr[resultArrPointer] = (resultArr[resultArrPointer] + arr[i]);
        } else {
            // single digit || operator 
            resultArr.push(arr[i]);
            resultArrPointer++;
        }
    }
    return resultArr
}

/**
 * 
 * @param arr formula string as array 
 * @returns formula solution (Number)
 */
const calculateFormula = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] == "object") {
            // if element is array -> calculate the brackets
            const bracketsSum = calculateFormula(arr[i]);
            arr[i] = bracketsSum;

        }
    }
    arr = connectNeededChars(arr);
    const result = calculatByOperationsOrder(arr)[0];
    if (isNaN(Number(result))) {
        throw {
            msg: "Invalid operations",
            code: 400
        }
    }
    return result;

}

/**
 * calculate given formula by operations order.
 * @param  arr formula string as array without nested arrays.
 * @returns array that holds result number.
 */
const calculatByOperationsOrder = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == '*' || arr[i] == '/') {
            if (arr[i + 1] == '0' && arr[i] == '/') {
                throw {
                    msg: "Can't divide by 0",
                    code: 422
                }
            }
            result = calculator(arr[i - 1], arr[i + 1], arr[i]);
            // remove calculated elements and insert the result
            arr.splice(i - 1, 3, result);
            i -= 1;
        }
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == '+') {
            result = calculator(arr[i - 1], arr[i + 1], arr[i]);
            arr.splice(i - 1, 3, result);
            i -= 1;
        }
    }
    return arr;
}

/**
 * deconstruct the formula into nested arrays for brackets & trim spaces.
 * @param splittedStr the formula string as array.
 * @returns array where the elements are strings for digitis/operators and nested arrays for brackets. 
 */
const deconstructFormula = (splittedStr) => {
    const currResults = {
        "elementsToSkip": 0,
        "currFormula": [],
    };

    let index = 0;
    while (index < splittedStr.length) {
        if (splittedStr[index] == ' ') {
            // ignore space chars
            index += 1;
        } else if (splittedStr[index] === 'A') {
            // opening brackets
            const deconstructBrackets = deconstructFormula(splittedStr.slice(index + 1));
            currResults.currFormula.push([...deconstructBrackets.currFormula])
            index += deconstructBrackets.elementsToSkip;

        } else if (splittedStr[index] == "Z") {
            // closing brackets
            currResults.elementsToSkip += (index + 2);
            return currResults;
        } else {
            // digit || operator
            currResults.currFormula.push(splittedStr[index])
            index += 1
        }
    }
    return currResults;
}

/**
 * 
 * @param  a number
 * @param  b number
 * @param operator  
 * @returns  result of a operator b
 */
const calculator = (a, b, operator) => {
    const actions = {
        "*": (a, b) => +a * +b,
        "/": (a, b) => +a / +b,
        "+": (a, b) => +a + +b,
    }
    return actions[operator](a, b);
}

module.exports = {
    deconstructFormula,
    calculateFormula
}