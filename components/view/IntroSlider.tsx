import React, {useRef, useState} from 'react';
import styled from 'styled-components/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Image from 'react-native-fast-image';
import dimension from '../../styles/dimension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncStorageKeyList} from '../../navigation/Root';
import {ButtonText} from '../basic/Button';

const Container = styled.View<{bkg: string; width: number; height: number}>`
  flex: 1;
  background-color: ${props => props.bkg};
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
`;

const Button = styled.TouchableOpacity`
  height: 50px;
  width: 50px;
  align-items: center;
  justify-content: center;
`;

function IntroSlider({
  visibility,
  setVisibility,
}: {
  visibility: boolean;
  setVisibility: Function;
}) {
  const target = useRef<AppIntroSlider>(null);
  const [page, setPage] = useState<number>(0);
  const slides: any = [
    {
      key: 'one',

      image: require('../../assets/img/IntroOne.png'),
      resizeMode: 'contain',
    },
    {
      key: 'two',
      image: require('../../assets/img/IntroTwo.png'),
      resizeMode: 'contain',
    },
    {
      key: 'three',
      image: require('../../assets/img/IntroThree.png'),
      resizeMode: 'contain',
    },
    {
      key: 'four',
      image: require('../../assets/img/IntroFour.png'),
      resizeMode: 'contain',
    },
    {
      key: 'five',
      image: require('../../assets/img/IntroFive.png'),
      resizeMode: 'contain',
    },
    {
      key: 'six',
      image: require('../../assets/img/IntroSix.png'),
      resizeMode: 'contain',
    },
    {
      key: 'seven',
      image: require('../../assets/img/IntroSeven.png'),
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
  const onNext = () => {
    target?.current?.goToSlide(page + 1);
    setPage(prev => prev + 1);
  };
  const onPrev = () => {
    target?.current?.goToSlide(page - 1);
    setPage(prev => prev - 1);
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
      <Image
        source={item.image}
        style={{width: '100%', height: '78%'}}
        resizeMode={item.resizeMode}
      />
    </Container>
  );

  return visibility ? (
    <AppIntroSlider
      ref={target}
      activeDotStyle={{backgroundColor: 'black'}}
      renderItem={renderItem}
      data={slides}
      showSkipButton={true}
      showPrevButton={true}
      renderSkipButton={() => (
        <Button onPress={onDone}>
          <ButtonText color="#1D6AFF" fontSize={18} fontWeight={500}>
            SKIP
          </ButtonText>
        </Button>
      )}
      renderPrevButton={() => (
        <Button onPress={onPrev}>
          <ButtonText color="#1D6AFF" fontSize={18} fontWeight={500}>
            PREV
          </ButtonText>
        </Button>
      )}
      renderNextButton={() => (
        <Button onPress={onNext}>
          <ButtonText color="#1D6AFF" fontSize={18} fontWeight={500}>
            NEXT
          </ButtonText>
        </Button>
      )}
      renderDoneButton={() => (
        <Button onPress={onDone}>
          <ButtonText color="#1D6AFF" fontSize={18} fontWeight={500}>
            DONE
          </ButtonText>
        </Button>
      )}
      onSlideChange={index => {
        setPage(index);
      }}
      // bottomButton
    />
  ) : null;
}

export default IntroSlider;
