import VueI18n from 'vue-i18n';
/* eslint-disable */
import en_US from '../lang/en_US.json';
import en_UK from  '../lang/en_UK.json';
import fr from  '../lang/fr.json';
import ru from  '../lang/ru.json';
import it from  '../lang/it.json';
import hy from  '../lang/hy.json';

import { ipfs, languages, defaultLanguage } from '../config/config';

/**
 * @description This function will check if translations related to the given language code
 * has been already cached in local storage, otherwise it will fetch them and store them
 * for further usage
 * @param {string} langCode Language code to retrieve from localStorage or to fetch from IPFS
 */
export async function getLang(langCode) {
  // Check if the given language code is the default one
  // and returns the bundled messages
  if(langCode === defaultLanguage){
    return en_US;
  }

  // Check if the given language is available
  if (!languages[langCode]) {
    return null;
  }

  const storagePath = `v74.languages.${langCode}`;

  // Check if the current lang has already been cached
  const cachedLang = localStorage.getItem(storagePath);

  if (cachedLang) {
    return JSON.parse(cachedLang);
  }

  // Fetch the lang from IPFS
  const fetchedLang = await fetch(`${ipfs.browser}${languages[langCode]}`)
    .then(response => {
      if (response.status !== 200) throw new Error('Failed to fetch lang');
      return response.json();
    })
    .catch(error => console.error(error));

  if (fetchedLang) {
    localStorage.setItem(storagePath, JSON.stringify(fetchedLang));
    return fetchedLang;
  } else {
    return null;
  }
}

export default (locale, fallbackLocale) =>
  new VueI18n({
    locale,
    messages: {
      en_US,
      en_UK,
      fr,
      it,
      ru,
      hy
    },
    fallbackLocale: fallbackLocale || locale,
  });
/* eslint-enable */
