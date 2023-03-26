import {Dimensions} from 'react-native';

const dimension = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  paddingVertical: 20,
  paddingHorizontal: 30,
  tweetRightSectionWidth: Dimensions.get('window').width - (60 + 50 + 20),
};

export default dimension;
