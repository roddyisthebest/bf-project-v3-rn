import React from 'react';
import styled from 'styled-components/native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {Platform} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../../navigation/Root';

const Container = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  border-radius: 80px;
  position: absolute;
  right: 20px;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: black;
`;

function UploadButton() {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();

  return (
    <Container
      onPress={() => {
        navigation.navigate('Stack', {screen: 'Uploading'});
      }}
      style={{
        elevation: 8,
        shadowColor: Platform.OS === 'android' ? '#000000' : '#00000060',
        bottom: Platform.OS === 'android' ? 90 : 120,
      }}>
      <FontAwesome5Icon name="pen" color="white" size={25} />
    </Container>
  );
}

export default UploadButton;
