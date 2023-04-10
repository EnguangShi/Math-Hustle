// Calculation
function calculateResult() {
  let cells = document.getElementsByClassName("cell");
  let formula = "";
  for (let cell of cells) {
    if (cell.childNodes.length > 0) {
      formula += cell.textContent;
    }
  }

  formula = formula.replace(/‑/g, "-"); // Replace non-breaking hyphen with hyphen-minus

  // Add "0" before the first minus sign if it's the first non-empty cell
  if (formula.startsWith("-")) {
    formula = "0" + formula;
  }

  let resultElement = document.getElementById("result");

  try {
    let cleanedFormula = cleanFormula(formula);
    if (isValidFormula(cleanedFormula)) {
      let noSpacesFormula = cleanedFormula.replace(/\s+/g, "");
      let result = eval(noSpacesFormula);
      resultElement.textContent = result;
      document.getElementById("dollarSign").style.display = "";
      document.getElementById("perSecond").style.display = "";
    } else {
      resultElement.textContent = "invalid";
      document.getElementById("dollarSign").style.display = "none";
      document.getElementById("perSecond").style.display = "none";
    }
  } catch (e) {
    resultElement.textContent = "invalid";
  }
}

function cleanFormula(formula) {
  // Remove trailing operators
  formula = formula.replace(/[-+]+$/, "");
  // Remove leading operators
  formula = formula.replace(/^[-+]+/, "");
  return formula;
}

function isValidFormula(formula) {
  const validFormulaRegex = /^[-+]?(\d(\s*[-+]\s*|$))+$/;
  return validFormulaRegex.test(formula);
}

let totalMoney = 0;

function updateMoney() {
  let resultElement = document.getElementById("result");
  let currentValue = parseFloat(resultElement.textContent);
  if (!isNaN(currentValue)) {
    totalMoney += currentValue;
    if (totalMoney < 0) {
      totalMoney = 0;
    }
  }
  document.getElementById("totalMoney").innerHTML = `$${totalMoney}`;
  setTimeout(updateMoney, 1000);
}

updateMoney();

// Initialize the game
calculateResult();
