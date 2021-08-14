/* eslint-disable no-unused-vars */
import fr from './fr';

  
const data = { fr};

const locales = {fr : 'fr'};

//locale = 'ar';

const localization = (lang = 'ar') => {

  if(locales[lang]){
    return data[lang];
  }else{
    return data['ar'];
  }
  
};


export {localization, locales};

