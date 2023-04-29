import React, {useRef} from 'react';
import styled from 'styled-components/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Image from 'react-native-fast-image';
import dimension from '../../styles/dimension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncStorageKeyList} from '../../navigation/Root';

const Container = styled.View<{bkg: string; width: number; height: number}>`
  flex: 1;
  background-color: ${props => props.bkg};
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  align-items: center;
  row-gap: -30px;
  justify-content: space-evenly;
  padding-top: 20px;
`;

const TextWrpper = styled.View`
  align-items: center;
  row-gap: 20px;
`;
const Title = styled.Text`
  font-size: 25px;
  font-weight: 700;
  text-align: center;
  color: black;
  /* padding: 0 50px; */
`;

const Content = styled.Text`
  font-size: 11px;
  font-weight: 500;
  text-align: center;
  color: black;
`;

function IntroSlider({
  visibility,
  setVisibility,
}: {
  visibility: boolean;
  setVisibility: Function;
}) {
  const target = useRef<AppIntroSlider>(null);
  const slides: any = [
    {
      key: 'one',
      title: 'Moim에서\n 같이 성경공부해요!',
      text: '',
      image: require('../../assets/img/IntroCartoon.png'),
      resizeMode: 'contain',
    },
    {
      key: 'two',
      title: '하루에 한번씩\n묵상한 말씀을 공유해보세요!',
      image: require('../../assets/img/IntroUploading.png'),
      resizeMode: 'contain',
      text: '',
    },
    {
      key: 'three',
      title: '벌금제도를 통해\n매일 말씀 묵상해요!',
      text: '업로드x, 하루에 1000원 (일요일 0시 벌금계산)\n부담스럽다면 사용기능 수정을 통해 벌금제도 기능을 비활성화 하세요.',
      image: require('../../assets/img/IntroPenalty.png'),
      resizeMode: 'contain',
    },
    {
      key: 'four',
      title: '사용기능 수정을 통해\n제공되는 서비스를\n선별하여 이용하세요',
      text: '',
      image: require('../../assets/img/IntroService.png'),
      resizeMode: 'contain',
    },
    {
      key: 'five',
      title: '일주일동안 서로를 위해\n기도해보세요!',
      text: '',
      image: require('../../assets/img/IntroPray.png'),
      resizeMode: 'contain',
    },
    {
      key: 'six',
      title: '팀 단위로\n서비스를 이용하세요!',
      text: '팀 생성, 팀 초대 및 가입신청 기능',
      image: require('../../assets/img/IntroTeam.png'),
      resizeMode: 'contain',
    },
  ];

  const onDone = async () => {
    setVisibility(false);
    try {
      await AsyncStorage.setItem(AsyncStorageKeyList.DEFAULT_INTRO_RC, 'yes');
    } catch (e) {
      // saving error
    }
  };

  const renderItem = ({
    item,
  }: {
    item: {
      title: string;
      image: {};
      text: string;
      backgroundColor: string;
      key: string;
      resizeMode: 'contain' | 'cover' | 'stretch' | 'center';
    };
  }) => (
    <Container
      bkg={item.backgroundColor}
      width={dimension.width}
      height={dimension.height}>
      <TextWrpper>
        <Title>{item.title}</Title>
        {item.text.length !== 0 && <Content>{item.text}</Content>}
      </TextWrpper>
      <Image
        source={item.image}
        style={{width: '100%', height: 500}}
        resizeMode={item.resizeMode}
      />
    </Container>
  );

  return visibility ? (
    <AppIntroSlider
      activeDotStyle={{backgroundColor: 'black'}}
      renderItem={renderItem}
      data={slides}
      onDone={onDone}
      bottomButton
    />
  ) : null;
}

export default IntroSlider;
