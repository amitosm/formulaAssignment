import "./calculator.css";
import { useState } from "react";

function Calculator() {
  const [inputValue, setInputValue] = useState("");
  const [formulaResult, setFormulaResult] = useState({ result: "", err: "" });

  const handleSubmitForm = (e, inputValue) => {
    e.preventDefault();
    if (inputValue.length > 0) {
      calculateFormula(inputValue);
    } else {
      setFormulaResult({ result: "", err: "The formula is empty" });
    }
  };

  const calculateFormula = async (inputValue) => {
    const encoded = encodeURIComponent(inputValue);
    fetch(`http://localhost:5000/api/${encoded}`)
      .then(async (res) => {
        const status = res.status;
        const data = await res.json();
        return { status, data };
      })
      .then((res) => {
        const result =
          res.status === 200
            ? setFormulaResult({ result: Number(res.data), err: "" })
            : setFormulaResult({ result: "", err: res.data });
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className="calculator--container">
      <div className="calculator--content">
        <form className="form--content" width={100}>
          <label htmlFor="formula">Please enter your formula</label>
          <br />
          <input
            id="formula"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <br />
          <button
            className="submit-btn"
            onClick={(e) => handleSubmitForm(e, inputValue)}
          >
            Calculate
          </button>
        </form>
        <div className="results--content">
          Output:
          <br />
          {formulaResult.result}
          {formulaResult.err.length > 0 && formulaResult.err}
        </div>
      </div>
    </section>
  );
}

export default Calculator;
