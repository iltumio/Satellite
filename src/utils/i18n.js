import VueI18n from 'vue-i18n';
/* eslint-disable */
import en_US from '../lang/en_US.json';
import en_UK from '../lang/en_UK.json';
import fr from '../lang/fr.json';
import it from '../lang/it.json';

export default (locale, fallbackLocale) =>
  new VueI18n({
    locale,
    messages: {
      en_US,
      en_UK,
      fr,
      it
    },
    fallbackLocale: fallbackLocale || locale
  });
/* eslint-enable */
