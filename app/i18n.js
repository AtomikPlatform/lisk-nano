const path = require('path');
const fs = require('fs');
const storage = require('electron-json-storage'); // eslint-disable-line import/no-extraneous-dependencies
const osLocale = require('os-locale'); // eslint-disable-line import/no-extraneous-dependencies

let loadedLanguage;

function Localization() {
  return this;
}

Localization.prototype.init = function (locale) {
  if (fs.existsSync(path.join(__dirname, `locales/${locale.substr(0, 2)}/common.json`))) {
    loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, `locales/${locale.substr(0, 2)}/common.json`), 'utf8'));
  } else {
    loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, 'locales/en/common.json'), 'utf8'));
  }
};

Localization.prototype.getLng = function (callback) {
  storage.get('lisk-nano-lng', (error, storedLng) => {
    if (storedLng !== undefined && storedLng.lng !== undefined && storedLng.lng.length === 2) {
      callback(storedLng.lng);
    } else {
      let lng = osLocale.sync();
      lng = (lng !== undefined) ? lng.substr(0, 2) : 'en';
      this.setLng(lng);
      callback(storedLng);
    }
  });
};

Localization.prototype.setLng = function (lng) {
  storage.set('lisk-nano-lng', { lng });
};

Localization.prototype.t = function (phrase) {
  return loadedLanguage[phrase] ? loadedLanguage[phrase] : phrase;
};

module.exports = Localization;
