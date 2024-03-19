import { in200s } from '../helpers';
import { API } from './ApiClient';

function GetCountryCodes() {
  return API.get('country')
    .then((response) => {
      if (in200s(response.status)) {
        return response.data?.result;
      }
      return null;
    })
    .catch((error) => error.response);
}
export const countryService = { GetCountryCodes };
