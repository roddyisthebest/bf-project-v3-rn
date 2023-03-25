import React, {forwardRef, useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import dimension from '../../styles/dimension';
import {colors} from '../../styles/color';
import {Alert, Platform, Pressable, TouchableOpacity} from 'react-native';
import {SmButton, ButtonText} from '../basic/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import {GapColumnView, GapRowView} from '../basic/View';
import FastImage from 'react-native-fast-image';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../recoil/user';
import {TextArea} from '../basic/Input';
import FileType from '../../types/FileType';
import Preview from '../parts/tabs/Preview';

import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {addTweet} from '../../api/tweet';

const Container = styled.View<{minHeight: number}>`
  min-height: ${props => `${props.minHeight}px`};
  background-color: white;
`;
const Split = styled.View<{bkg: string}>`
  background-color: ${props => props.bkg};
  height: 1px;
`;

const Header = styled.View<{
  paddingVertical: number;
}>`
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: ${props =>
    ` 5px ${props.paddingVertical}px  10px ${props.paddingVertical}px`};
`;

const HeaderTitleText = styled(ButtonText)``;

const Contents = styled(GapColumnView)`
  flex: 1;
`;

const UserImg = styled(FastImage)<{borderColor: string}>`
  width: 50px;
  height: 50px;
  border-radius: 50px;
  border-color: ${props => props.borderColor};
  border-width: 1px;
`;
const RightSection = styled(GapRowView)`
  flex: 1;
`;

const ColumnSection = styled(GapColumnView)`
  justify-content: space-between;
  align-items: center;
`;

const BtnsWrapper = styled(ColumnSection)`
  justify-content: flex-start;
`;

const UploadModal = forwardRef((_, ref: React.ForwardedRef<ActionSheetRef>) => {
  const myInfo = useRecoilValue(rstMyInfo);
  const [file, setFile] = useState<FileType | null>(null);
  const [content, setContent] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    setDisabled(file === null && content.length === 0);
  }, [file, content]);

  const uploadUsingCamera = useCallback(async () => {
    try {
      const data: any = await launchCamera({
        quality: 0.2,
        mediaType: 'photo',
      });
      setFile(data.assets[0] as FileType);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const uploadUsingAlbum = useCallback(async () => {
    try {
      const data: any = await launchImageLibrary({
        quality: 0.2,
        mediaType: 'photo',
      });
      console.log(data);
      setFile(data.assets[0] as FileType);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const onPress = useCallback(async () => {
    try {
      const res: any = await addTweet({
        file: file ? file : null,
        content: content.length === 0 ? null : content,
      });

      if ((res.status as number) === 500) {
        Alert.alert('서버 오류 입니다.');
        return;
      } else if ((res.status as number) === 403) {
        Alert.alert('게시글을 업로드하는 서비스를 이용하지 않으셨습니다.⚠️');
        return;
      } else if ((res.status as number) === 406) {
        Alert.alert('오늘 업로드 된 게시물이 존재합니다. ⚠️');
        return;
      } else if ((res.status as number) === 401) {
        //토큰 갱신
      } else if ((res.status as number) === 200) {
        //ok
        console.log('ok');
      }
    } catch (e) {
      console.log(e);
    }
  }, [content, file]);
  return (
    <ActionSheet ref={ref} gestureEnabled={true} keyboardHandlerEnabled={false}>
      <Container
        minHeight={
          Platform.OS === 'ios' ? dimension.height * 0.87 : dimension.height * 1
        }>
        <Header paddingVertical={dimension.paddingVertical}>
          <HeaderTitleText color="black" fontSize={20} fontWeight={600}>
            게시글 업로드
          </HeaderTitleText>
          <Pressable
            onPress={() =>
              (ref as React.RefObject<ActionSheetRef>).current?.hide()
            }>
            <Icon name="close-outline" color="black" size={25} />
          </Pressable>
        </Header>
        <Split bkg={colors.bottomSheetItemBorderColor} />
        <Contents
          gap={15}
          marginTop={0}
          marginBottom={0}
          paddingHorizontal={dimension.paddingHorizontal}
          paddingVertical={dimension.paddingVertical}>
          <UserImg
            source={{uri: myInfo?.user?.img}}
            borderColor={colors.buttonBorderColor}
          />
          <RightSection
            gap={10}
            marginTop={0}
            marginBottom={0}
            paddingHorizontal={0}
            paddingVertical={0}>
            <TextArea
              placeholder="사진 또는 글을 올려주세요."
              borderColor={colors.inputLineColor}
              multiline
              numberOfLines={10}
              style={{textAlignVertical: 'top'}}
              value={content}
              onChangeText={text => setContent(text)}
            />
            <ColumnSection
              gap={0}
              marginTop={0}
              marginBottom={0}
              paddingHorizontal={0}
              paddingVertical={0}>
              <BtnsWrapper
                gap={10}
                marginTop={0}
                marginBottom={0}
                paddingHorizontal={0}
                paddingVertical={0}>
                <TouchableOpacity onPress={uploadUsingAlbum}>
                  <Icon name="image" size={30} color={colors.buttonColor} />
                </TouchableOpacity>
                <TouchableOpacity onPress={uploadUsingCamera}>
                  <Icon name="camera" size={33} color={colors.buttonColor} />
                </TouchableOpacity>
              </BtnsWrapper>
              <SmButton
                bkg={disabled ? colors.buttonDisabledColor : colors.buttonColor}
                radius={20}
                disabled={disabled}
                onPress={onPress}>
                <ButtonText color="white" fontSize={12} fontWeight={500}>
                  올리기
                </ButtonText>
              </SmButton>
            </ColumnSection>

            {file ? (
              <Preview
                reset={() => {
                  setFile(null);
                }}
                editable={true}
                uri={file.uri}
              />
            ) : null}
          </RightSection>
        </Contents>
      </Container>
    </ActionSheet>
  );
});

export default UploadModal;
