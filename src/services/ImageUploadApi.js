/* eslint-disable no-return-await */
/* eslint-disable no-console */
import axios from 'axios';
import { in200s } from '../helpers';

async function uploadProfile(data) {
  return await axios
    .post('https://api.cloudinary.com/v1_1/dzs0eyrnl/image/upload', data)
    .then((response) => {
      console.log('response ***** ', response);
      if (in200s(response.status)) {
        // console.log(response.data);
        return response.data;
      }

      return null;
    })
    .catch((error) => error.response);
}

export const postsService = {
  uploadProfile,
};
