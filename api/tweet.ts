import {AxiosResponse} from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {EncryptedStorageKeyList} from '../navigation/Root';
import {rstMyInfoType} from '../recoil/user';
import FileType from '../types/FileType';
import {api, response} from './index';

const addTweet = async ({
  file,
  content,
  teamId,
}: {
  file: FileType | null;
  content: string | null;
  teamId: number;
}): Promise<any> => {
  const formData = new FormData();

  const val = {name: file?.fileName, type: file?.type, uri: file?.uri};

  file && formData.append('img', val);
  content && formData.append('content', content);
  const accessToken = await EncryptedStorage.getItem(
    EncryptedStorageKeyList.ACCESSTOKEN,
  );
  const userInfoString = await EncryptedStorage.getItem(
    EncryptedStorageKeyList.USERINFO,
  );
  if (userInfoString) {
    const userInfo: rstMyInfoType = JSON.parse(userInfoString);
    formData.append('teamId', userInfo?.team?.id);
    return fetch(`http://192.168.123.104:3000/tweet/team/${teamId}`, {
      method: 'POST',
      headers: {
        Authorization: accessToken as string,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }
};

const getTweets = (
  lastId = -1,
  teamId: number,
): Promise<AxiosResponse<response>> =>
  api.get(`/tweet/${lastId}/team/${teamId}`);

const deleteTweet = (id: number): Promise<AxiosResponse<response>> =>
  api.delete(`/tweet/${id}`);

export {addTweet, getTweets, deleteTweet};
