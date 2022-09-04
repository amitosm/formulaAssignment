const router = require("express").Router();
const {
    validateString,
} = require('../services/api.validateFormula');
const {
    deconstructFormula,
    calculateFormula
} = require('../services/api.calculateString');


router.get("/:string", async (req, res) => {
    const inputString = req.params.string;
    const arrOfChars = [...inputString];
    try {
        validateString(inputString, arrOfChars);
        const deconstructedFormula = deconstructFormula(arrOfChars).currFormula;
        const result = calculateFormula(deconstructedFormula);
        res.status(200).json(result);
    } catch (err) {
        if (err.code) {
            res.status(err.code).json(err.msg);
        } else {
            console.log(err);
            res.status(500).json("Something went wrong");
        }
    }
})

module.exports = router;