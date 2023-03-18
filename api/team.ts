import {AxiosResponse} from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {api, response} from './index';

const addTeam = async ({
  file,
  name,
  introducing,
}: {
  file: {name: string; type: 'multipart/form-data'; uri: string};
  name: string;
  introducing: string;
}) => {
  const formData = new FormData();
  const accessToken = await EncryptedStorage.getItem('accessToken');

  formData.append('img', file);
  formData.append('name', name);
  formData.append('introducing', introducing);

  return await fetch('http://192.168.123.107:3000/team', {
    method: 'POST',
    headers: {
      Authorization: accessToken as string,

      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
};

export {addTeam};