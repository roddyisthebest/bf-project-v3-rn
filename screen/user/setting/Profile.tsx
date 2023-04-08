import React, {useCallback, useEffect, useState} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  EncryptedStorageKeyList,
  LoggedInParamList,
} from '../../../navigation/Root';
import Layout from '../../../components/layout';
import {GapRowView} from '../../../components/basic/View';
import styled from 'styled-components/native';
import {colors} from '../../../styles/color';

import {Input, Label} from '../../../components/basic/Input';
import dimension from '../../../styles/dimension';
import {KeyboardAvoidingView, Platform, Pressable, View} from 'react-native';

import {rstMyInfo, rstMyInfoType} from '../../../recoil/user';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {ButtonText} from '../../../components/basic/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import md5 from 'md5';
import {updateInfo} from '../../../api/user';
import UserType from '../../../types/UserType';
import EncryptedStorage from 'react-native-encrypted-storage';

const UploadButton = styled.TouchableOpacity<{borderColor: string}>`
  width: 120px;
  height: 120px;
  border-radius: 120px;
  align-items: center;
  justify-content: center;
  position: relative;
  border-color: ${props => props.borderColor};
  border-width: 1px;
`;

const UploadImage = styled(FastImage)<{bkg: string}>`
  width: 100%;
  height: 100%;
  border-radius: 120px;
  position: absolute;
  background-color: ${props => props.bkg};
`;

const UploadButtonIconWrapper = styled.View`
  width: 40px;
  height: 40px;
  background-color: black;
  opacity: 0.7;
  border-radius: 40px;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

function Profile() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const {user} = useRecoilValue(rstMyInfo);
  const setUserInfo = useSetRecoilState(rstMyInfo);

  const [name, setName] = useState<string>('');
  const [uri, setUri] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);
  const rand = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const shuffleUri = useCallback(async () => {
    setUri(
      `https://s.gravatar.com/avatar/${md5(rand(0, 1000000))}?s=32&d=retro`,
    );
  }, [rand]);

  const onUpload = useCallback(async () => {
    try {
      await updateInfo({
        img: uri,
        name,
      });

      setUserInfo(prev => ({
        ...prev,
        user: {...(prev.user as UserType), name, img: uri},
      }));

      const dataString = await EncryptedStorage.getItem(
        EncryptedStorageKeyList.USERINFO,
      );
      const parsedData: rstMyInfoType = JSON.parse(dataString as string);

      parsedData.user = {
        ...(user as UserType),
        name,
        img: uri,
      };
      await EncryptedStorage.setItem(
        EncryptedStorageKeyList.USERINFO,
        JSON.stringify(parsedData),
      );
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  }, [uri, name, navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        disabled ? null : (
          <Pressable onPress={onUpload}>
            <ButtonText color="#3478F6" fontSize={15} fontWeight={500}>
              변경
            </ButtonText>
          </Pressable>
        ),
    });
  }, [navigation, disabled, onUpload]);

  useEffect(() => {
    setDisabled(name.length < 2 || (user?.name === name && user?.img === uri));
  }, [name, user, uri]);

  useEffect(() => {
    setName(user?.name as string);
    setUri(user?.img as string);
  }, [user]);

  return (
    <Layout scrollable={false} isItWhite={true}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={125}
        behavior={Platform.select({ios: 'position', android: 'position'})}>
        <GapRowView
          gap={30}
          marginTop={0}
          marginBottom={0}
          paddingHorizontal={0}
          paddingVertical={35}
          style={{alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: 'white',
              width: '100%',
              alignItems: 'center',
            }}>
            <UploadButton
              borderColor={colors.buttonBorderColor}
              onPress={shuffleUri}>
              <UploadButtonIconWrapper>
                <Icon name="shuffle-outline" color="white" size={20} />
              </UploadButtonIconWrapper>
              <UploadImage
                bkg={colors.background}
                source={{
                  uri,
                }}
              />
            </UploadButton>
          </View>

          <GapRowView
            gap={10}
            marginTop={0}
            marginBottom={0}
            paddingHorizontal={dimension.paddingHorizontal}
            paddingVertical={0}
            style={{width: '100%'}}>
            <Label color={colors.inputLabelColor}>팀 이름</Label>
            <Input
              autoFocus
              placeholder="팀 이름을 입력해주세요. (3글자 이상)"
              placeholderTextColor={colors.inputPlaceHolderColor}
              borderColor={colors.inputLineColor}
              onChangeText={text => setName(text)}
              value={name}
            />
          </GapRowView>
          <GapRowView
            gap={10}
            marginTop={0}
            marginBottom={0}
            paddingHorizontal={dimension.paddingHorizontal}
            paddingVertical={0}
            style={{width: '100%'}}>
            <Label color={colors.inputLabelColor}>가입경로</Label>
            <Input
              style={{color: colors.buttonDisabledColor}}
              placeholder="팀 소갯말을 입력해주세요. (5글자 이상)"
              placeholderTextColor={colors.inputPlaceHolderColor}
              borderColor={colors.inputLineColor}
              value={user?.oauth}
              editable={false}
            />
          </GapRowView>
        </GapRowView>
      </KeyboardAvoidingView>
    </Layout>
  );
}

export default Profile;
