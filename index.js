const core = require("@actions/core");
const github = require("@actions/github");
const fetch = require("node-fetch");

const baseCurrency = core.getInput('base-currency');
const targetCurrency = core.getInput('target-currency');

const getExchangeRate = async () => {
  const response = await fetch(
    `https://api.exchangeratesapi.io/latest?base=${baseCurrency}&symbols=${targetCurrency}`
  );
  const data = await response.json();
  return data;
};

const setResultsToGithubOutput = (response) => {
  const exchangeRate = parseFloat(response.rates[targetCurrency]);
  console.log(response);
  core.setOutput("exchange-rate", exchangeRate.toFixed(2));
};

try {
  getExchangeRate().then((response) => setResultsToGithubOutput(response));
} catch (error) {
  core.setFailed(error.message);
}
