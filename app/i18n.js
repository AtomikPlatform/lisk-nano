const path = require('path');
const fs = require('fs');

let loadedLanguage;

function Localization(locale) {
  if (fs.existsSync(path.join(__dirname, `locales/${locale.substr(0, 2)}/common.json`))) {
    loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, `locales/${locale.substr(0, 2)}/common.json`), 'utf8'));
  } else {
    loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, 'locales/en/common.json'), 'utf8'));
  }
}

Localization.prototype.t = function (phrase) {
  return loadedLanguage[phrase] ? loadedLanguage[phrase] : phrase;
};

module.exports = Localization;
