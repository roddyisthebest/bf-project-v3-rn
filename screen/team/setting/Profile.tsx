import React, {useCallback, useEffect, useState} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../../navigation/Root';
import Layout from '../../../components/layout';
import {GapRowView} from '../../../components/basic/View';
import styled from 'styled-components/native';
import {colors} from '../../../styles/color';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import {Input, Label} from '../../../components/basic/Input';
import dimension from '../../../styles/dimension';
import {KeyboardAvoidingView, Platform, Pressable, View} from 'react-native';
import {ButtonText} from '../../../components/basic/Button';
import {launchImageLibrary} from 'react-native-image-picker';
import FileType from '../../../types/FileType';
import {addTeam} from '../../../api/team';

const UploadButton = styled.TouchableOpacity<{borderColor: string}>`
  width: 120px;
  height: 120px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  position: relative;
  border-color: ${props => props.borderColor};
  border-width: 1px;
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

function Profile() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const [file, setFile] = useState<FileType | null>(null);
  const [name, setName] = useState<string>('');
  const [introducing, setIntroducing] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);

  const uploadUsingAlbum = useCallback(async () => {
    try {
      const data: any = await launchImageLibrary({
        quality: 1,
        mediaType: 'photo',
      });

      if (data) {
        setFile(data.assets[0]);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const onUpload = useCallback(async () => {
    try {
      await addTeam({
        file: {
          name: file?.fileName as string,
          type: 'multipart/form-data',
          uri: file?.uri as string,
        },
        name,
        introducing,
      });
      setAddTeamFlag(true);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  }, [file, name, introducing, navigation, setAddTeamFlag]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        disabled ? null : (
          <Pressable onPress={onUpload}>
            <ButtonText color="#3478F6" fontSize={15} fontWeight={500}>
              생성
            </ButtonText>
          </Pressable>
        ),
    });
  }, [navigation, onUpload, disabled]);

  useEffect(() => {
    setDisabled(introducing.length < 5 || name.length < 3 || file === null);
  }, [introducing, name, file]);

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
              onPress={uploadUsingAlbum}
              borderColor={colors.background}>
              <UploadButtonIconWrapper>
                <Icon name="camera" color="white" size={20} />
              </UploadButtonIconWrapper>
              <UploadImage
                bkg={colors.background}
                source={{
                  uri: file ? file.uri : '',
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
              placeholder="팀 이름을 입력해주세요. (3글자 이상)"
              placeholderTextColor={colors.inputPlaceHolderColor}
              borderColor={colors.inputLineColor}
              onChangeText={text => setName(text)}
            />
          </GapRowView>
          <GapRowView
            gap={10}
            marginTop={0}
            marginBottom={0}
            paddingHorizontal={dimension.paddingHorizontal}
            paddingVertical={0}
            style={{width: '100%'}}>
            <Label color={colors.inputLabelColor}>팀 소갯말</Label>
            <Input
              placeholder="팀 소갯말을 입력해주세요. (5글자 이상)"
              placeholderTextColor={colors.inputPlaceHolderColor}
              borderColor={colors.inputLineColor}
              onChangeText={text => setIntroducing(text)}
            />
          </GapRowView>
        </GapRowView>
      </KeyboardAvoidingView>
    </Layout>
  );
}

export default Profile;
