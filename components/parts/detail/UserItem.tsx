import React, {useEffect} from 'react';
import UserPropType from '../../../types/UserPropType';
import styled from 'styled-components/native';
import dimension from '../../../styles/dimension';
import {Image} from '../../basic/Image';
import {colors} from '../../../styles/color';
import {ButtonText, SmButton} from '../../basic/Button';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../../recoil/user';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ActivityIndicator} from 'react-native';
const Container = styled.View<{paddingHorizontal: number}>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${props => `15px ${props.paddingHorizontal}px`};
  background-color: white;
`;

const Column = styled.View`
  flex-direction: row;
  column-gap: 15px;
  align-items: center;
`;
const Text = styled(ButtonText)``;

function UserItem({
  data,
  onPress,
  index,
}: {
  data: UserPropType;
  onPress: (id: number, index: number) => void;
  index: number;
}) {
  const userInfo = useRecoilValue(rstMyInfo);

  return (
    <Container paddingHorizontal={dimension.paddingHorizontal}>
      <Column>
        <Image
          width={30}
          height={30}
          borderRad={30}
          source={{uri: `${data.img}`}}
          borderColor={colors.buttonBorderColor}
        />
        <Text color="black" fontWeight={600} fontSize={20}>
          {data.name}
        </Text>
        {userInfo?.team?.bossId === data.id && (
          <Icon name="crown-circle" color="#FFE600" size={25} />
        )}
      </Column>
      {userInfo?.team?.bossId !== data.id &&
        userInfo?.team?.bossId === userInfo?.user?.id && (
          <SmButton
            bkg={colors.prayButtonDeleteBkgColor}
            radius={8}
            disabled={data.loading}
            onPress={() => onPress(data.id, index)}>
            {data.loading ? (
              <ActivityIndicator color={colors.prayButtonDeleteTextColor} />
            ) : (
              <ButtonText
                color={colors.prayButtonDeleteTextColor}
                fontSize={13}
                fontWeight={400}>
                강퇴하기
              </ButtonText>
            )}
          </SmButton>
        )}
    </Container>
  );
}

export default UserItem;
