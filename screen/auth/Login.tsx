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
import {loginWithKakao} from '../../api/user';
const HeaderText = styled.Text`
  color: black;
  font-size: 25px;
  font-weight: 700;
`;

function Login() {
  const setLoggedIn = useSetRecoilState(isLoggedIn);
  const setToken = useSetRecoilState(tokens);
  const kakaoLogin = useCallback(async () => {
    try {
      await login();
      const res = await getProfile();
      console.log(res);

      const {data} = await loginWithKakao({
        id: res.id,
        img: res.profileImageUrl,
        name: res.nickname,
      });
      setToken({
        refreshToken: data.payload.token.refreshToken,
        accessToken: data.payload.token.accessToken,
      });
      setLoggedIn(true);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }, [setToken, setLoggedIn]);

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
            {Platform.OS === 'ios' ? (
              <Button bkg={colors.buttonColor} radius={25}>
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
