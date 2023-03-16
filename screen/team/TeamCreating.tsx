import React, {useEffect} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../navigation/Root';
import Layout from '../../components/layout';
import {GapRowView} from '../../components/basic/View';
import styled from 'styled-components/native';
import {colors} from '../../styles/color';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import {Input, Label} from '../../components/basic/Input';
import dimension from '../../styles/dimension';
import {KeyboardAvoidingView, Platform, Pressable} from 'react-native';
import {ButtonText} from '../../components/basic/Button';

const UploadButton = styled.TouchableOpacity`
  width: 120px;
  height: 120px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const UploadImage = styled(FastImage)<{bkg: string}>`
  width: 100%;
  height: 100%;
  border-radius: 15px;
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

function TeamCreating() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable>
          <ButtonText color="#3478F6" fontSize={15}>
            생성
          </ButtonText>
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <Layout scrollable={false} isItWhite={true}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={125}
        behavior={Platform.select({ios: 'position', android: 'position'})}>
        <GapRowView
          gap={30}
          marginTop={0}
          marginBottom={0}
          paddingHorizontal={dimension.paddingHorizontal}
          paddingVertical={35}
          style={{alignItems: 'center'}}>
          <UploadButton>
            <UploadButtonIconWrapper>
              <Icon name="camera" color="white" size={20} />
            </UploadButtonIconWrapper>
            <UploadImage
              bkg={colors.background}
              source={{
                uri: 'https://koreaboo-cdn.storage.googleapis.com/2017/08/Satomi-Ishihara.jpeg',
              }}
            />
          </UploadButton>

          <GapRowView
            gap={10}
            marginTop={0}
            marginBottom={0}
            paddingHorizontal={0}
            paddingVertical={0}
            style={{width: '100%'}}>
            <Label color={colors.inputLabelColor}>팀 이름</Label>
            <Input
              placeholder="팀 이름을 입력해주세요."
              placeholderTextColor={colors.inputPlaceHolderColor}
              borderColor={colors.inputLineColor}
            />
          </GapRowView>
          <GapRowView
            gap={10}
            marginTop={0}
            marginBottom={0}
            paddingHorizontal={0}
            paddingVertical={0}
            style={{width: '100%'}}>
            <Label color={colors.inputLabelColor}>팀 소갯말</Label>
            <Input
              placeholder="팀 소갯말을 입력해주세요."
              placeholderTextColor={colors.inputPlaceHolderColor}
              borderColor={colors.inputLineColor}
            />
          </GapRowView>
        </GapRowView>
      </KeyboardAvoidingView>
    </Layout>
  );
}

export default TeamCreating;
