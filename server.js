const express = require("express");
const app = express();
const nodeCron = require("node-cron");
const axios = require("axios");
const { resolve } = require('path');
const fireStoreService = require(resolve('firestore'));

// To start  our server
app.listen(8000, async () => {
    console.log(`Server started on port 8000`);

    nodeCron.schedule("0 0 * * *", () => {
        populateCountryRateData();
    });
    // populateCountryRateData();
});

function populateCountryRateData() {
    console.log("populateCountryRateData");
    const countryList = [];
    const currencyList = [];
    let exchangeRates = {};
    Promise.all([
        axios.get('https://www.apicountries.com/countries'),
        axios.get('https://v6.exchangerate-api.com/v6/cd83643bf9e568a8ca075390/codes'),
        axios.get('https://v6.exchangerate-api.com/v6/cd83643bf9e568a8ca075390/latest/USD')
    ]).then(([countryListResp, currencyListResp, exchangeRateResp]) => {
        currencyList.push(...currencyListResp.data.supported_codes.map((item) => item[0]));
        exchangeRates = { ...exchangeRateResp.data.conversion_rates };

        countryList.push(...countryListResp.data.filter((item) => item.currencies && item.currencies.length > 0 && currencyList.includes(item.currencies[0].code)).map(async (item) => {
            const countryItem = {
                name: item.name,
                code: item.alpha2Code,
                continent: item.region,
                flag: item.flag,
                currencyCode: item.currencies[0].code,
                currencyName: item.currencies[0].name,
                currencySymbol: item.currencies[0].symbol,
                exchangeRate: exchangeRates[item.currencies[0].code]
            }
            const countryData = await fireStoreService.fireStoreGetDataById('countries', countryItem.code);
            if (countryData) {
                await fireStoreService.fireStoreUpdateDataWithId('countries', countryItem.code, countryItem);
            } else {
                await fireStoreService.fireStoreSetDataWithId('countries', countryItem.code, countryItem)
            }
            return countryItem;
        }));
        console.log(`successfully added/updated ${countryList.length} countries' data`)
    })
}