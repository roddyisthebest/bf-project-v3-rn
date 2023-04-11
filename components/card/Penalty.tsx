import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {colors} from '../../styles/color';
import dimension from '../../styles/dimension';
import {ButtonText} from '../basic/Button';
import {Image} from '../basic/Image';
import {GapRowView} from '../basic/View';
import Icon from 'react-native-vector-icons/Ionicons';
import UserType from '../../types/UserType';
import {updatePayed} from '../../api/user';
import {ActivityIndicator} from 'react-native';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../recoil/user';

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

function Penalty({data}: {data: UserType}) {
  const {team} = useRecoilValue(rstMyInfo);
  const [payed, setpayed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onPress = useCallback(
    async (id: number, stPayed: boolean) => {
      try {
        setLoading(true);
        await updatePayed(id, !stPayed, team?.id as number);
        setpayed(prev => !prev);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    },
    [team],
  );

  useEffect(() => {
    setpayed(data.Penalties[0].payed);
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
            uri: data.img,
          }}
        />
        <UserNameText color="black" fontSize={25} fontWeight={600}>
          {data.name}
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
            {data?.Penalties[0]?.paper}
          </ContentSubTitleText>
        </ContentColumn>
        <ContentColumn>
          <ContentTitleText color="black" fontWeight={600} fontSize={20}>
            payed
          </ContentTitleText>
          <Button
            onPress={() => onPress(data?.Penalties[0]?.id, payed)}
            disabled={loading}
            bkg={
              payed
                ? colors.prayButtonSaveBkgColor
                : colors.prayButtonDeleteBkgColor
            }>
            {loading ? (
              <ActivityIndicator
                color={
                  payed
                    ? colors.prayButtonSaveBkgColor
                    : colors.prayButtonDeleteBkgColor
                }
                size={15}
              />
            ) : (
              <Icon
                name={payed ? 'checkmark-outline' : 'close-outline'}
                color={
                  payed
                    ? colors.prayButtonSaveTextColor
                    : colors.prayButtonDeleteTextColor
                }
                size={18}
              />
            )}
          </Button>
        </ContentColumn>
      </ContentSection>
    </Container>
  );
}

export default React.memo(Penalty);
