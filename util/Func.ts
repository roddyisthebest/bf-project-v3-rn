import EncryptedStorage from 'react-native-encrypted-storage';
import {EncryptedStorageKeyList} from '../navigation/Root';
import axios from 'axios';
import {setTokenToAxios} from '../api';
import Config from 'react-native-config';

const getTokenByRefresh = async () => {
  try {
    const refreshToken = await EncryptedStorage.getItem(
      EncryptedStorageKeyList.REFRESHTOKEN,
    );
    if (refreshToken) {
      try {
        const {data}: {data: {payload: {accessToken: string}}} =
          await axios.post(`${Config.API_URL}/token/refresh`, {
            refreshToken,
          });
        await EncryptedStorage.setItem(
          EncryptedStorageKeyList.ACCESSTOKEN,
          data.payload.accessToken,
        );
        await setTokenToAxios();
        return true;
      } catch (axiosError) {
        return false;
      }
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};

export {getTokenByRefresh};
