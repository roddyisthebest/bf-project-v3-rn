import React, {useCallback, useState} from 'react';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../../styles/color';
import dimension from '../../../styles/dimension';
import Config from 'react-native-config';

const Container = styled.Pressable<{borderColor: string; height: number}>`
  width: 100%;
  border-width: 1px;
  border-color: ${props => props.borderColor};
  border-radius: 10px;
`;

const Image = styled(FastImage)`
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;

const DeleteButton = styled.Pressable`
  width: 30px;
  height: 30px;
  border-radius: 25px;
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 100;
  background-color: white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  align-items: center;
  justify-content: center;
`;
function Preview({
  uri,
  reset,
  editable,
}: {
  uri: string;
  reset: () => void;
  editable: boolean;
}) {
  const [resizeMode, setResizeMode] = useState<'contain' | 'cover'>('cover');

  const onPress = useCallback(() => {
    if (resizeMode === 'contain') {
      setResizeMode('cover');
    } else {
      setResizeMode('contain');
    }
  }, [resizeMode]);

  return (
    <Container
      borderColor={colors.bottomSheetItemBorderColor}
      height={dimension.tweetRightSectionWidth}
      onPress={onPress}>
      {editable && (
        <DeleteButton onPress={reset}>
          <Icon name="close-outline" color="black" size={18} />
        </DeleteButton>
      )}

      <Image
        resizeMode={resizeMode}
        source={{uri: editable ? uri : `${Config.API_URL}/${uri}`}}
      />
    </Container>
  );
}

export default Preview;
