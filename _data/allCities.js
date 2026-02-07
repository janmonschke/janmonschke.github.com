const cafes = require("./cafes.json");
const allCities = {};
for (const countryData of Object.values(cafes.countries)) {
  Object.assign(allCities, countryData.cities);
}
module.exports = allCities;
