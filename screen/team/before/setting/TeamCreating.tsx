import React, {useCallback, useEffect, useState} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../../../navigation/Root';
import Layout from '../../../../components/layout';
import {GapRowView} from '../../../../components/basic/View';
import styled from 'styled-components/native';
import {colors} from '../../../../styles/color';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import {Input, Label} from '../../../../components/basic/Input';
import dimension from '../../../../styles/dimension';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from 'react-native';
import {ButtonText} from '../../../../components/basic/Button';
import {launchImageLibrary} from 'react-native-image-picker';
import {rstTeamFlag} from '../../../../recoil/flag';
import FileType from '../../../../types/FileType';
import {useResetRecoilState, useSetRecoilState} from 'recoil';
import {addTeam} from '../../../../api/team';
import {rstMyInfo} from '../../../../recoil/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import {getTokenByRefresh} from '../../../../util/Func';
import {rstAuth} from '../../../../recoil/auth';

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

function TeamCreating() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  const setFlag = useSetRecoilState(rstTeamFlag);
  const resetRstMyInfo = useResetRecoilState(rstMyInfo);
  const resetRstAuth = useResetRecoilState(rstAuth);

  const [file, setFile] = useState<FileType | null>(null);
  const [name, setName] = useState<string>('');
  const [introducing, setIntroducing] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const logout = useCallback(async () => {
    resetRstAuth();
    resetRstMyInfo();
    await EncryptedStorage.clear();
  }, []);

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
      console.log('launchImageLibrary 모듈 에러입니다.');
    }
  }, []);

  const onUpload = useCallback(async () => {
    try {
      let errorMessage = '';

      if (file === null) {
        errorMessage += '· 파일 업로드\n';
      }

      if (name.length < 3 || name.length > 6) {
        errorMessage += '· 팀 이름 3글자 이상 6글자 이하\n';
      }

      if (introducing.length < 5) {
        errorMessage += '· 팀 소갯말 5글자 이상';
      }
      if (disabled) {
        Alert.alert('조건을 충족시켜주세요!', errorMessage);
      }

      setLoading(true);
      const res: any = await addTeam({
        file: {
          name: file?.fileName as string,
          type: 'multipart/form-data',
          uri: file?.uri as string,
        },
        name,
        introducing,
      });

      if ((res.status as number) === 500) {
        logout();

        Alert.alert('서버 오류 입니다. 관리자에게 문의주세요. 010-5152-9445');
      } else if ((res.status as number) === 403) {
        Alert.alert('팀 최대 생성 횟수를 초과했습니다.');
      } else if ((res.status as number) === 400) {
        logout();
        Alert.alert('400 : 다시 로그인 해주세요.');
      } else if ((res.status as number) === 401) {
        //토큰 갱신
        const response = await getTokenByRefresh();
        if (response) {
          Alert.alert('토큰을 갱신했습니다. 다시한번 요청해주세요!');
        } else {
          logout();
          Alert.alert('다시 로그인 해주세요.');
        }
      } else if ((res.status as number) === 201) {
        setFlag(prev => ({
          home: {
            update: {
              myteam: true,
              invitation: prev.home.update.invitation,
              application: prev.home.update.application,
            },
          },
        }));
        Alert.alert('팀이 생성되었습니다.');
        navigation.goBack();
      } else if ((res.status as number) === 413) {
        Alert.alert('사진 크기가 너무 큽니다. 다른 사진을 업로드해주세요.');
      }
    } catch (e: any) {
      if (e.column && Platform.OS === 'android') {
        console.log(e);
      }
    } finally {
      setLoading(false);
    }
  }, [file, name, introducing, navigation, setFlag, disabled]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        loading ? (
          <ActivityIndicator color="#3478F6" />
        ) : (
          <Pressable onPress={onUpload} disabled={loading}>
            <ButtonText color="#3478F6" fontSize={15} fontWeight={500}>
              생성
            </ButtonText>
          </Pressable>
        ),
    });
  }, [navigation, onUpload, disabled, loading]);

  useEffect(() => {
    setDisabled(
      introducing.length < 5 ||
        (name.length < 3 && name.length > 6) ||
        file === null,
    );
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
              placeholder="팀 이름을 입력해주세요. (3글자 이상 6글자 이하)"
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

export default TeamCreating;
