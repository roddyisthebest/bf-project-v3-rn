import React from 'react';
import FastImage from 'react-native-fast-image';
import {ActivityIndicator, Platform} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../../styles/color';
import dimension from '../../styles/dimension';
import TweetPropType from '../../types/TweetPropType';
import {ButtonText, SmButton} from '../basic/Button';
import {TextArea} from '../basic/Input';
import {GapColumnView, GapRowView} from '../basic/View';
import Preview from '../parts/tabs/Preview';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../recoil/user';
import {tweetTime} from '../../util/Date';

const Container = styled(GapColumnView)<{
  borderColor: string;
}>`
  border-bottom-color: ${props => props.borderColor};
  border-bottom-width: 1px;
  background-color: white;
`;

const LeftSection = styled.View`
  width: 50px;
`;

const UserImg = styled(FastImage)<{borderColor: string}>`
  width: 50px;
  height: 50px;
  border-radius: 50px;
  border-color: ${props => props.borderColor};
  border-width: 1px;
`;

const RightSection = styled(GapRowView)<{width: number}>`
  width: ${props => props.width}px;
`;

const NameSection = styled(GapColumnView)`
  align-items: center;
`;

const NameTitleText = styled(ButtonText)``;

const NameSubTitleText = styled(ButtonText)``;

const ButtonSection = styled(GapColumnView)`
  align-items: center;
  justify-content: flex-end;
`;

function Tweet({
  data,
  deleteFuc,
  index,
}: {
  data: TweetPropType;
  deleteFuc: Function;
  index: number;
}) {
  const rstUserInfo = useRecoilValue(rstMyInfo);

  return (
    <Container
      paddingHorizontal={dimension.paddingHorizontal}
      paddingVertical={25}
      marginTop={0}
      marginBottom={0}
      borderColor={colors.cardBorderBottomColor}
      gap={20}>
      <LeftSection>
        <UserImg
          source={{uri: data?.User?.img}}
          borderColor={colors.buttonBorderColor}
        />
      </LeftSection>

      <RightSection
        width={dimension.tweetRightSectionWidth}
        gap={15}
        marginTop={0}
        marginBottom={0}
        paddingHorizontal={0}
        paddingVertical={0}>
        <NameSection
          paddingHorizontal={0}
          paddingVertical={Platform.OS === 'ios' ? 5 : 0}
          marginTop={0}
          marginBottom={0}
          gap={7.5}>
          <NameTitleText color="black" fontSize={25} fontWeight={600}>
            {data?.User?.name}
          </NameTitleText>
          <NameSubTitleText
            color={colors.subTitleColor}
            fontSize={14}
            fontWeight={400}>
            @{data?.User?.oauth} · {tweetTime(data?.createdAt as Date)}
          </NameSubTitleText>
        </NameSection>
        {data.content.length === 0 ? null : (
          <TextArea
            placeholder="사진 또는 글을 올려주세요."
            borderColor={colors.inputLineColor}
            multiline
            isDisplay={true}
            editable={false}
            style={{textAlignVertical: 'top'}}
            value={data.content}
          />
        )}
        {data.img.length !== 0 && (
          <Preview reset={() => {}} uri={data.img} editable={false} />
        )}
        {rstUserInfo?.user?.id === data?.User?.id && (
          <ButtonSection
            paddingHorizontal={0}
            paddingVertical={Platform.OS === 'ios' ? 5 : 0}
            marginTop={0}
            marginBottom={0}
            gap={5}>
            <SmButton
              bkg={colors.negativeColor}
              radius={13}
              disabled={data.loading}
              onPress={() => deleteFuc(data.id, index)}>
              {data.loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Icon name="trash-outline" color="white" size={13} />

                  <ButtonText color="white" fontSize={12} fontWeight={500}>
                    삭제하기
                  </ButtonText>
                </>
              )}
            </SmButton>
          </ButtonSection>
        )}
      </RightSection>
    </Container>
  );
}
export default React.memo(Tweet);
