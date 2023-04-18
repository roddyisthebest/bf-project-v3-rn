import React, {forwardRef, useEffect, useCallback, useState} from 'react';
import {Platform, Switch, View, ActivityIndicator} from 'react-native';
import dimension from '../../styles/dimension';
import {Button, ButtonText} from '../basic/Button';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import DeviceInfo from 'react-native-device-info';
import {GapRowView} from '../basic/View';
import Header from '../container/Header';
import Setting from '../container/Setting';
import {getService} from '../../api/user';
import {useRecoilValue} from 'recoil';
import {rstMyInfo} from '../../recoil/user';
import {updateService} from '../../api/team';

interface Props {}

const ServiceModal = forwardRef(
  (props: Props, ref: React.ForwardedRef<ActionSheetRef>) => {
    const {team} = useRecoilValue(rstMyInfo);

    const [data, setData] = useState<{
      tweet: boolean;
      pray: boolean;
      penalty: boolean;
    }>({
      tweet: false,
      pray: false,
      penalty: false,
    });
    const [padding, setPadding] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const onPress = useCallback(async () => {
      try {
        setLoading(true);

        const {
          data: {payload},
        } = await getService({teamId: team?.id as number});

        await updateService({
          tweet: data.tweet,
          penalty: data.penalty,
          pray: data.pray,
          id: payload?.id,
          teamId: team?.id as number,
        });
        (ref as React.ForwardedRef<ActionSheetRef>)?.current.hide({
          animation: true,
        });
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }, [data, team, ref]);

    const getData = useCallback(() => {
      const model = DeviceInfo.getModel();
      if (Platform.OS === 'ios') {
        if (model.includes('14')) {
          setPadding(55);
        } else if (
          model.includes('13') ||
          model.includes('12') ||
          model.includes('11')
        ) {
          setPadding(50);
        } else {
          setPadding(20);
        }
      }
    }, [DeviceInfo, Platform]);
    useEffect(() => {
      getData();
    }, []);

    return (
      <ActionSheet
        ref={ref}
        gestureEnabled={false}
        keyboardHandlerEnabled={false}>
        <View
          style={{
            paddingTop: padding,
            height: dimension.height,
          }}>
          <GapRowView
            gap={0}
            marginBottom={0}
            marginTop={0}
            paddingHorizontal={0}
            paddingVertical={0}>
            <Header
              title="기능 사용 설정"
              contents="This app provides private content.
Please enter a 6-digit code to prove yourself."
            />
            <Setting
              title="매일성경"
              contents="매일성경(큐티) 업로드를 사용할 수 있습니다. ">
              <Switch
                value={data.tweet}
                onValueChange={value =>
                  setData(prev => ({...prev, tweet: value}))
                }
              />
            </Setting>
            <Setting
              title="기도제목"
              contents="기도제목을 업로드하고 수정 및 삭제 할 수 있습니다.">
              <Switch
                value={data.pray}
                onValueChange={value =>
                  setData(prev => ({...prev, pray: value}))
                }
              />
            </Setting>
            <Setting
              title="벌금"
              contents="매일 성경(큐티) 벌금 로직에 참여할 수 있습니다.">
              <Switch
                value={data.penalty}
                onValueChange={value =>
                  setData(prev => ({...prev, penalty: value}))
                }
              />
            </Setting>
            <View style={{paddingHorizontal: 18, paddingTop: 22.5}}>
              <Button
                bkg="black"
                radius={10}
                disabled={loading}
                onPress={onPress}>
                {loading ? (
                  <ActivityIndicator color="white" size={15} />
                ) : (
                  <ButtonText color="white" fontSize={15} fontWeight={600}>
                    확인
                  </ButtonText>
                )}
              </Button>
            </View>
          </GapRowView>
        </View>
      </ActionSheet>
    );
  },
);

export default ServiceModal;
