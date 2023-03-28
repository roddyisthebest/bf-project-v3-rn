import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Platform} from 'react-native';
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
import UserType from '../../types/UserType';
import PrayType from '../../types/PrayType';
import {addPray, deletePray, updatePray} from '../../api/pray';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../recoil/user';
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
  font-weight: 400;
  height: 100%;
  padding-bottom: 2.5px;
`;

const ButtonColumn = styled.View`
  column-gap: 5px;
  flex-direction: row;
`;

const AddButtonColumn = styled.View`
  align-items: center;
  margin-top: 5px;
`;

function Pray({data}: {data: UserType}) {
  const {team} = useRecoilValue(rstMyInfo);

  const target = useRef<any[]>([]);

  const [editable, setEditable] = useState<boolean>(false);
  const [prays, setPrays] = useState<PrayType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect((): (() => void) => {
    const unSubscribe = () =>
      data.Prays?.map(e => {
        setPrays(prev => [
          ...prev,
          {...e, edit: false, editLoading: false, deleteLoading: false},
        ]);
      });
    unSubscribe();
    return () => unSubscribe;
  }, [data]);

  const addPrayToState = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: {payload},
      } = await addPray(team?.id as number);
      setPrays(prev => [
        ...prev,
        {
          id: payload.id,
          content: payload.content,
          weekend: payload.weekend,
          edit: false,
          editLoading: false,
          deleteLoading: false,
        },
      ]);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [team]);

  const deletePrayFromState = useCallback(
    async (index: number, id: number) => {
      prays.splice(index, 1, {...prays[index], deleteLoading: true});
      setPrays([...prays]);
      try {
        await deletePray(id, team?.id as number);
        setPrays(prev => prev?.filter(pray => pray.id !== id));
      } catch (e) {
        prays.splice(index, 1, {...prays[index], deleteLoading: false});
        setPrays([...prays]);
      }
    },
    [prays, team],
  );

  const setContents = useCallback(
    (index: number, content: string) => {
      prays.splice(index, 1, {...prays[index], content});
      setPrays([...prays]);
    },
    [prays],
  );

  const setPrayToEdit = useCallback(
    (index: number) => {
      prays.splice(index, 1, {
        ...prays[index],
        edit: true,
      });
      setPrays([...prays]);
      target.current[index].focus();
    },
    [prays, setPrays],
  );

  const editPrayFromState = useCallback(
    async (index: number, id: number) => {
      prays.splice(index, 1, {...prays[index], editLoading: true});
      setPrays([...prays]);
      try {
        await updatePray(id, prays[index].content, team?.id as number);
      } catch (e) {
      } finally {
        prays.splice(index, 1, {
          ...prays[index],
          editLoading: false,
          edit: false,
        });
        setPrays([...prays]);
        target.current[index].blur();
      }
    },
    [team, prays],
  );

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
              uri: data.img,
            }}
          />
          <UserNameText color="black" fontSize={25} fontWeight={600}>
            {data.name}
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
        gap={20}>
        {prays?.map((pray, index) => (
          <TextAreaWrapper
            key={pray.id}
            borderColor={colors.inputLineColor}
            isItIos={Platform.OS === 'ios'}>
            <ModifiedTextArea
              returnKeyType="done"
              ref={el => (target.current[index] = el)}
              placeholder="새로운 기도제목입니다."
              borderColor="transparent"
              multiline={true}
              onFocus={() => setPrayToEdit(index)}
              value={pray.content}
              editable={editable}
              keyboardType="default"
              style={{textAlignVertical: 'top'}}
              onChangeText={text => setContents(index, text)}
              blurOnSubmit={true}
              onSubmitEditing={() => editPrayFromState(index, pray.id)}
            />

            {editable && (
              <ButtonColumn>
                {pray.edit ? (
                  <PrayButton
                    disabled={pray.editLoading}
                    bkg={colors.prayButtonSaveBkgColor}
                    onPress={() => editPrayFromState(index, pray.id)}>
                    {pray.editLoading ? (
                      <ActivityIndicator
                        color={colors.prayButtonEditTextColor}
                        size={10}
                      />
                    ) : (
                      <AwesomeIcon
                        name="save"
                        color={colors.prayButtonSaveTextColor}
                        size={10}
                      />
                    )}
                  </PrayButton>
                ) : (
                  <PrayButton
                    bkg={colors.prayButtonEditBkgColor}
                    onPress={() => setPrayToEdit(index)}>
                    <AwesomeIcon
                      name="pen"
                      color={colors.prayButtonEditTextColor}
                      size={8}
                    />
                  </PrayButton>
                )}

                <PrayButton
                  bkg={colors.prayButtonDeleteBkgColor}
                  disabled={pray.deleteLoading}
                  onPress={() => deletePrayFromState(index, pray.id)}>
                  {pray.deleteLoading ? (
                    <ActivityIndicator
                      color={colors.prayButtonDeleteTextColor}
                      size={10}
                    />
                  ) : (
                    <Icon
                      name="trash"
                      color={colors.prayButtonDeleteTextColor}
                      size={10}
                    />
                  )}
                </PrayButton>
              </ButtonColumn>
            )}
          </TextAreaWrapper>
        ))}
        {editable && (
          <AddButtonColumn>
            <SmButton bkg="black" radius={15} onPress={addPrayToState}>
              {loading ? (
                <ActivityIndicator color="white" size={12} />
              ) : (
                <>
                  <Icon name="add-circle-outline" color="white" size={17} />
                  <ButtonText color="white" fontSize={15} fontWeight={500}>
                    추가하기
                  </ButtonText>
                </>
              )}
            </SmButton>
          </AddButtonColumn>
        )}
      </Contents>
    </Container>
  );
}

export default React.memo(Pray);
