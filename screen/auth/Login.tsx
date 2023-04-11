import FastImage from 'react-native-fast-image';
import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import Layout from '../../components/layout';
import dimension from '../../styles/dimension';
import {colors} from '../../styles/color';
import {Button, ButtonText} from '../../components/basic/Button';
import {GapRowView} from '../../components/basic/View';
import Division from '../../components/basic/Division';
import {Label, Input} from '../../components/basic/Input';
import {KeyboardAvoidingView, Platform} from 'react-native';
import {useSetRecoilState} from 'recoil';
import {rstAuth} from '../../recoil/auth';
import {
  getProfile as getProfileWithKakao,
  login,
} from '@react-native-seoul/kakao-login';
import {adminLogin, snsLogin} from '../../api/user';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {
  NaverLogin,
  getProfile as getProfileWithNaver,
} from '@react-native-seoul/naver-login';
import EncryptedStorage from 'react-native-encrypted-storage';
import {setTokenToAxios} from '../../api';
import {rstMyInfo} from '../../recoil/user';
import UserType from '../../types/UserType';
import {EncryptedStorageKeyList} from '../../navigation/Root';

const HeaderText = styled.Text`
  color: black;
  font-size: 25px;
  font-weight: 700;
`;

function Login() {
  const setRstAuth = useSetRecoilState(rstAuth);
  const setMyInfo = useSetRecoilState(rstMyInfo);

  const [uid, setUid] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    setDisabled(uid.length === 0 && password.length === 0);
  }, [uid, password]);

  const setAtom = useCallback(
    async ({
      refreshToken,
      accessToken,
      userInfo,
    }: {
      refreshToken: string;
      accessToken: string;
      userInfo: UserType;
    }) => {
      await EncryptedStorage.setItem(
        EncryptedStorageKeyList.ACCESSTOKEN,
        accessToken,
      );
      await EncryptedStorage.setItem(
        EncryptedStorageKeyList.REFRESHTOKEN,
        refreshToken,
      );

      const obj = {
        user: userInfo,
        team: null,
      };
      await EncryptedStorage.setItem(
        EncryptedStorageKeyList.USERINFO,
        JSON.stringify(obj),
      );
      await setTokenToAxios();

      setMyInfo(info => ({
        user: obj.user,
        team: info.team,
      }));

      setRstAuth(true);
    },
    [setRstAuth, setMyInfo],
  );

  const kakaoLogin = useCallback(async () => {
    await login();
    const res = await getProfileWithKakao();

    const {data} = await snsLogin({
      uid: res.id,
      img: res.thumbnailImageUrl,
      name: res.nickname,
      oauth: 'kakao',
    });

    setAtom({
      refreshToken: data.payload.token.refreshToken,
      accessToken: data.payload.token.accessToken,
      userInfo: data.payload.userInfo,
    });
  }, [setAtom]);

  const appleLogin = useCallback(async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    if (credentialState === appleAuth.State.AUTHORIZED) {
      // return

      const {data} = await snsLogin({
        uid: appleAuthRequestResponse.user,
        img: null,
        name: appleAuthRequestResponse.fullName?.givenName
          ? appleAuthRequestResponse.fullName.givenName
          : '아무개 회원',
        oauth: 'apple',
      });

      setAtom({
        refreshToken: data.payload.token.refreshToken,
        accessToken: data.payload.token.accessToken,
        userInfo: data.payload.userInfo,
      });
    }
    // 에러처리
  }, [setAtom]);

  const naverLogin = useCallback(async () => {
    const config = {
      kConsumerKey: '2mDUg8wHDYBX0BbXTMMs',
      kConsumerSecret: 'VqKNMX5v0Z',
      kServiceAppName: 'stubb',
      kServiceAppUrlScheme: Platform.OS === 'ios' ? 'naverLogin' : undefined,
    };
    NaverLogin.login(config, (err, token) => {
      if (err) {
        return console.log(err);
      } else {
        getProfileWithNaver(token?.accessToken as string).then(async result => {
          console.log(result);
          if (result.resultcode === '024') {
            console.log('에러');
            return null;
          } else {
            const {data} = await snsLogin({
              uid: result.response.id,
              img: result.response.profile_image,
              name: result.response.name,
              oauth: 'naver',
            });
            console.log(data);

            setAtom({
              accessToken: data.payload.token.accessToken as string,
              refreshToken: data.payload.token.refreshToken as string,
              userInfo: data.payload.userInfo,
            });
          }
        });
      }
    });
  }, [setAtom]);

  const localLogin = useCallback(async () => {
    const {data} = await adminLogin({uid, password});
    setAtom({
      refreshToken: data.payload.token.refreshToken,
      accessToken: data.payload.token.accessToken,
      userInfo: data.payload.userInfo,
    });
  }, [password, setAtom, uid]);

  return (
    <Layout scrollable={false} isItWhite={true}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={125}
        behavior={Platform.select({ios: 'position', android: 'position'})}>
        <GapRowView
          paddingHorizontal={dimension.paddingHorizontal}
          paddingVertical={dimension.paddingVertical}
          gap={15}
          marginTop={0}
          marginBottom={0}>
          <HeaderText>STUBB에 로그인하기</HeaderText>
          <GapRowView
            gap={10}
            marginTop={10}
            marginBottom={0}
            paddingHorizontal={0}
            paddingVertical={0}>
            <Button bkg={colors.buttonColor} radius={25} onPress={kakaoLogin}>
              <FastImage
                source={require('../../assets/img/KakaoLogo512h.png')}
                style={{width: 19, height: 17}}
              />
              <ButtonText
                color={colors.snsButtonTextColor}
                fontSize={15}
                fontWeight={500}>
                Kakao 계정으로 로그인
              </ButtonText>
            </Button>

            <Button bkg={colors.buttonColor} radius={25} onPress={naverLogin}>
              <FastImage
                source={require('../../assets/img/NaverLogo512h.png')}
                style={{width: 19, height: 17}}
              />
              <ButtonText
                color={colors.snsButtonTextColor}
                fontSize={15}
                fontWeight={500}>
                Naver 계정으로 로그인
              </ButtonText>
            </Button>
            {Platform.OS === 'ios' ? (
              <Button bkg={colors.buttonColor} radius={25} onPress={appleLogin}>
                <FastImage
                  source={require('../../assets/img/AppleLogo512h.png')}
                  style={{width: 16, height: 19}}
                />
                <ButtonText
                  color={colors.snsButtonTextColor}
                  fontSize={15}
                  fontWeight={500}>
                  Apple 계정으로 로그인
                </ButtonText>
              </Button>
            ) : null}
          </GapRowView>
          <Division text="또는" />
          <GapRowView
            gap={20}
            marginTop={5}
            marginBottom={0}
            paddingHorizontal={0}
            paddingVertical={0}>
            <GapRowView
              gap={10}
              marginTop={0}
              marginBottom={0}
              paddingHorizontal={0}
              paddingVertical={0}>
              <Label color={colors.inputLabelColor}>아이디</Label>
              <Input
                placeholder="아이디를 입력해주세요."
                placeholderTextColor={colors.inputPlaceHolderColor}
                borderColor={colors.inputLineColor}
                value={uid}
                onChangeText={text => setUid(text)}
              />
            </GapRowView>
            <GapRowView
              gap={10}
              marginTop={5}
              marginBottom={0}
              paddingHorizontal={0}
              paddingVertical={0}>
              <Label color={colors.inputLabelColor}>비밀번호</Label>
              <Input
                placeholder="비밀번호를 입력해주세요."
                placeholderTextColor={colors.inputPlaceHolderColor}
                borderColor={colors.inputLineColor}
                secureTextEntry={true}
                value={password}
                onChangeText={text => setPassword(text)}
              />
            </GapRowView>
            <Button
              bkg={colors.buttonColor}
              disabled={disabled}
              radius={10}
              onPress={localLogin}>
              <ButtonText
                color={colors.snsButtonTextColor}
                fontSize={15}
                fontWeight={500}>
                로그인
              </ButtonText>
            </Button>
          </GapRowView>
        </GapRowView>
      </KeyboardAvoidingView>
    </Layout>
  );
}

export default Login;
