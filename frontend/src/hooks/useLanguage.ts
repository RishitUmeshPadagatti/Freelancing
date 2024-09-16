import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import i18n from '../i18n';
import { languageAtom } from '../recoil/atoms';

export const useLanguage = () => {
  const [language, setLanguage] = useRecoilState(languageAtom);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  useEffect(() => {
    const currentLanguage = i18n.language || 'en';
    setLanguage(currentLanguage);
  }, [setLanguage]);

  return { language, changeLanguage };
};
