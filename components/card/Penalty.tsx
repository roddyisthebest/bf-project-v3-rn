import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {colors} from '../../styles/color';
import dimension from '../../styles/dimension';
import {ButtonText} from '../basic/Button';
import {Image} from '../basic/Image';
import {GapRowView} from '../basic/View';
import Icon from 'react-native-vector-icons/Ionicons';
import PenaltyType from '../../types/PenaltyType';

const Container = styled(GapRowView)<{borderColor: string}>`
  border-bottom-color: ${props => props.borderColor};
  border-bottom-width: 1px;
  background-color: white;
`;

const TitleSection = styled.View`
  flex-direction: row;
  align-items: center;
  column-gap: 10px;
`;

const UserImage = styled(Image)``;

const UserNameText = styled(ButtonText)``;

const ContentSection = styled(GapRowView)``;

const ContentColumn = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ContentTitleText = styled(ButtonText)``;

const ContentSubTitleText = styled(ButtonText)``;

const Button = styled.TouchableOpacity<{bkg: string}>`
  width: 30px;
  height: 30px;
  border-radius: 20px;
  background-color: ${props => props.bkg};
  align-items: center;
  justify-content: center;
`;

function Penalty({data}: {data: PenaltyType}) {
  const [check, setCheck] = useState<boolean>(false);

  useEffect(() => {
    setCheck(data.payed);
  }, [data]);
  return (
    <Container
      paddingHorizontal={dimension.paddingHorizontal}
      paddingVertical={25}
      marginTop={0}
      marginBottom={0}
      borderColor={colors.cardBorderBottomColor}
      gap={10}>
      <TitleSection>
        <UserImage
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
      </TitleSection>
      <ContentSection
        paddingHorizontal={0}
        paddingVertical={0}
        marginTop={15}
        marginBottom={0}
        gap={12.5}>
        <ContentColumn>
          <ContentTitleText color="black" fontWeight={600} fontSize={20}>
            금액
          </ContentTitleText>
          <ContentSubTitleText
            color={colors.subTitleColor}
            fontWeight={600}
            fontSize={20}>
            0
          </ContentSubTitleText>
        </ContentColumn>
        <ContentColumn>
          <ContentTitleText color="black" fontWeight={600} fontSize={20}>
            payed
          </ContentTitleText>
          <Button
            onPress={() => {
              setCheck(prev => !prev);
            }}
            bkg={
              check
                ? colors.prayButtonEditBkgColor
                : colors.prayButtonDeleteBkgColor
            }>
            <Icon
              name={check ? 'checkmark-outline' : 'close-outline'}
              color={
                check
                  ? colors.prayButtonEditTextColor
                  : colors.prayButtonDeleteTextColor
              }
              size={18}
            />
          </Button>
        </ContentColumn>
      </ContentSection>
    </Container>
  );
}

export default React.memo(Penalty);
