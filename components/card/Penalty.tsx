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
import {ActivityIndicator, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../recoil/user';
import {updatePaper} from '../../api/penalty';

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

const ButtonColumn = styled.View`
  align-items: center;
  column-gap: 5px;
  flex-direction: row;
`;

const PaperButton = styled.TouchableOpacity<{bkg: string}>`
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background-color: ${props => props.bkg};
  align-items: center;
  justify-content: center;
`;

function Penalty({data}: {data: UserType}) {
  const {team} = useRecoilValue(rstMyInfo);
  const {user} = useRecoilValue(rstMyInfo);

  const [payed, setPayed] = useState<boolean>(false);
  const [paper, setPaper] = useState<number>(0);

  const [loading, setLoading] = useState<{paper: boolean; payed: boolean}>({
    paper: false,
    payed: false,
  });

  const updateStPayed = useCallback(async () => {
    try {
      setLoading(prev => ({...prev, payed: true}));
      await updatePayed(data.Penalties[0].id, !payed, team?.id as number);
      setPayed(prev => !prev);
    } catch (e) {
    } finally {
      setLoading(prev => ({...prev, payed: false}));
    }
  }, [team, data, payed]);

  const updateStPaper = useCallback(
    async (isThisSubtraction: boolean) => {
      try {
        if (paper - 1000 === -1000 && isThisSubtraction) {
          return;
        }

        setLoading(prev => ({...prev, paper: true}));
        await updatePaper({
          id: data.Penalties[0].id,
          teamId: team?.id as number,
          paper: isThisSubtraction ? paper - 1000 : paper + 1000,
        });
        setPaper(isThisSubtraction ? paper - 1000 : paper + 1000);
      } catch (e) {
      } finally {
        setLoading(prev => ({...prev, paper: false}));
      }
    },
    [team, data, paper],
  );

  useEffect(() => {
    setPayed(data?.Penalties[0]?.payed);
    setPaper(data?.Penalties[0]?.paper);
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
          <View
            style={{
              flexDirection: 'row',
              columnGap: 12.5,
              alignItems: 'center',
            }}>
            <ContentTitleText color="black" fontWeight={600} fontSize={20}>
              금액
            </ContentTitleText>
            {team?.bossId === user?.id && (
              <ButtonColumn>
                <PaperButton
                  bkg={colors.prayButtonDeleteBkgColor}
                  onPress={() => updateStPaper(true)}
                  disabled={loading.paper}>
                  {loading.paper ? (
                    <ActivityIndicator
                      color={colors.prayButtonDeleteTextColor}
                      size={15}
                    />
                  ) : (
                    <Icon
                      name="remove-outline"
                      size={15}
                      color={colors.prayButtonDeleteTextColor}
                    />
                  )}
                </PaperButton>
                <PaperButton
                  bkg={colors.prayButtonEditBkgColor}
                  onPress={() => updateStPaper(false)}
                  disabled={loading.paper}>
                  {loading.paper ? (
                    <ActivityIndicator
                      color={colors.prayButtonEditTextColor}
                      size={15}
                    />
                  ) : (
                    <Icon
                      name="add-outline"
                      size={15}
                      color={colors.prayButtonEditTextColor}
                    />
                  )}
                </PaperButton>
              </ButtonColumn>
            )}
          </View>
          <>
            <ContentSubTitleText
              color={colors.subTitleColor}
              fontWeight={600}
              fontSize={20}>
              {paper}
            </ContentSubTitleText>
          </>
        </ContentColumn>
        <ContentColumn>
          <ContentTitleText color="black" fontWeight={600} fontSize={20}>
            payed
          </ContentTitleText>
          <Button
            onPress={updateStPayed}
            disabled={loading.payed}
            bkg={
              payed
                ? colors.prayButtonSaveBkgColor
                : colors.prayButtonDeleteBkgColor
            }>
            {loading.payed ? (
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
