import FastImage from 'react-native-fast-image';
import React, {useCallback} from 'react';
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
import {isLoggedIn, tokens} from '../../recoil/auth';
import {getProfile, login} from '@react-native-seoul/kakao-login';
import {snsLogin} from '../../api/user';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import NaverLogin, {
  NaverLoginResponse,
  GetProfileResponse,
} from '@react-native-seoul/naver-login';

const HeaderText = styled.Text`
  color: black;
  font-size: 25px;
  font-weight: 700;
`;

function Login() {
  const setLoggedIn = useSetRecoilState(isLoggedIn);
  const setToken = useSetRecoilState(tokens);

  const setAtom = useCallback(
    ({
      refreshToken,
      accessToken,
    }: {
      refreshToken: string;
      accessToken: string;
    }) => {
      setToken({
        refreshToken,
        accessToken,
      });
      setLoggedIn(true);
    },
    [setLoggedIn, setToken],
  );

  const kakaoLogin = useCallback(async () => {
    try {
      await login();
      const res = await getProfile();
      console.log(res);

      const {data} = await snsLogin({
        uid: res.id,
        img: res.thumbnailImageUrl,
        name: res.nickname,
        oauth: 'kakao',
      });
      setAtom({
        refreshToken: data.payload.token.refreshToken,
        accessToken: data.payload.token.accessToken,
      });

      console.log(data);
    } catch (e) {
      console.log(e);
    }
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

      try {
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
        });
      } catch (e) {
        console.log(e);
      }
    }
    // 에러처리
  }, [setAtom]);

  const naverLogin = useCallback(async () => {
    const config = {
      consumerKey: '2mDUg8wHDYBX0BbXTMMs',
      consumerSecret: 'VqKNMX5v0Z',
      appName: 'stubb',
      serviceUrlScheme: Platform.OS === 'ios' ? 'naverLogin' : undefined,
    };
    const {successResponse} = await NaverLogin.login(config);
    if (successResponse) {
      const {response} = await NaverLogin.getProfile(
        successResponse.accessToken,
      );
      console.log(response);
      try {
        const {data} = await snsLogin({
          uid: response.id,
          img: response.profile_image,
          name: response.name,
          oauth: 'naver',
        });
        console.log(data);
        setAtom({
          refreshToken: data.payload.token.refreshToken,
          accessToken: data.payload.token.accessToken,
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, [setAtom]);

  return (
    <Layout scrollable={false}>
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
              <ButtonText color={colors.snsButtonTextColor}>
                Kakao 계정으로 로그인
              </ButtonText>
            </Button>
            <Button bkg={colors.buttonColor} radius={25} onPress={naverLogin}>
              <FastImage
                source={require('../../assets/img/NaverLogo512h.png')}
                style={{width: 19, height: 17}}
              />
              <ButtonText color={colors.snsButtonTextColor}>
                Naver 계정으로 로그인
              </ButtonText>
            </Button>
            {Platform.OS === 'ios' ? (
              <Button bkg={colors.buttonColor} radius={25} onPress={appleLogin}>
                <FastImage
                  source={require('../../assets/img/AppleLogo512h.png')}
                  style={{width: 16, height: 19}}
                />
                <ButtonText color={colors.snsButtonTextColor}>
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
              />
            </GapRowView>
            <Button
              bkg={colors.buttonColor}
              radius={10}
              onPress={() => {
                setLoggedIn(true);
              }}>
              <ButtonText color={colors.snsButtonTextColor}>로그인</ButtonText>
            </Button>
          </GapRowView>
        </GapRowView>
      </KeyboardAvoidingView>
    </Layout>
  );
}

export default Login;
