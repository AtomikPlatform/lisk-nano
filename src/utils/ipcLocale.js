export default {
  init: (i18n) => {
    const { ipc } = window;

    if (ipc) {
      ipc.on('detectedLocale', (action, locale) => {
        i18n.changeLanguage(locale);
      });

      i18n.on('languageChanged', (locale) => {
        ipc.send('set-locale', locale);
      });
    }
  },
};
