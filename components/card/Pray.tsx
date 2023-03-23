import React, {useState} from 'react';
import {Platform} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../../styles/color';
import dimension from '../../styles/dimension';
import {ButtonText, PrayButton} from '../basic/Button';
import {TextArea} from '../basic/Input';
import {GapRowView} from '../basic/View';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';
import {Image} from '../../components/basic/Image';
import {SmButton} from '../basic/Button';
const Container = styled(GapRowView)<{borderColor: string}>`
  border-bottom-color: ${props => props.borderColor};
  border-bottom-width: 1px;
  background-color: white;
`;

const TitleColumn = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const UserColumn = styled.View`
  column-gap: 10px;
  align-items: center;
  flex-direction: row;
`;
const UserNameText = styled(ButtonText)``;
const Contents = styled(GapRowView)``;

const TextAreaWrapper = styled.View<{borderColor: string; isItIos: boolean}>`
  border-color: ${props => props.borderColor};
  border-bottom-width: 1px;
  padding: ${props => (props.isItIos ? '0 0 5px 0' : 0)};
  flex-direction: row;
`;

const ModifiedTextArea = styled(TextArea)`
  padding: 0;
  font-size: 15px;
  flex: 1;
  height: 100%;
`;

const ButtonColumn = styled.View`
  column-gap: 5px;
  flex-direction: row;
`;

function Pray() {
  const [editable, setEditable] = useState<boolean>(false);
  return (
    <Container
      paddingHorizontal={dimension.paddingHorizontal}
      paddingVertical={25}
      marginTop={0}
      marginBottom={0}
      borderColor={colors.cardBorderBottomColor}
      gap={10}>
      <TitleColumn>
        <UserColumn>
          <Image
            width={35}
            height={35}
            borderColor={colors.buttonBorderColor}
            borderRad={40}
            source={{
              uri: 'https://cdn.mhns.co.kr/news/photo/202208/532975_645654_1918.jpg',
            }}
          />
          <UserNameText color="black" fontSize={25} fontWeight={600}>
            카리나
          </UserNameText>
        </UserColumn>
        <SmButton
          bkg="transparent"
          radius={0}
          style={{paddingRight: 0}}
          onPress={() => setEditable(prev => !prev)}>
          <Icon
            name="chevron-down-outline"
            color={colors.inputLabelColor}
            size={12}
          />

          <ButtonText
            color={colors.inputLabelColor}
            fontSize={12.5}
            fontWeight={500}>
            {editable ? '편집 모드' : '읽기 모드'}
          </ButtonText>
        </SmButton>
      </TitleColumn>
      <Contents
        paddingHorizontal={0}
        paddingVertical={0}
        marginTop={15}
        marginBottom={0}
        gap={30}>
        <TextAreaWrapper
          borderColor={colors.inputLineColor}
          isItIos={Platform.OS === 'ios'}>
          <ModifiedTextArea
            placeholder="사진 또는 글을 올려주세요."
            borderColor="transparent"
            multiline
            autoFocus
            editable={editable}
            style={{textAlignVertical: 'top'}}
          />
          {editable && (
            <ButtonColumn>
              <PrayButton bkg={colors.prayButtonEditBkgColor}>
                <AwesomeIcon
                  name="pen"
                  color={colors.prayButtonEditTextColor}
                  size={8}
                />
              </PrayButton>
              <PrayButton bkg={colors.prayButtonDeleteBkgColor}>
                <Icon
                  name="trash"
                  color={colors.prayButtonDeleteTextColor}
                  size={10}
                />
              </PrayButton>
            </ButtonColumn>
          )}
        </TextAreaWrapper>
      </Contents>
    </Container>
  );
}

export default React.memo(Pray);
