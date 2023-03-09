import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screen/tabs/Home';
import Pray from '../screen/tabs/Pray';
import Penalty from '../screen/tabs/Penalty';
import {colors} from '../styles/color';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const TabsNav = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarLabelStyle: {
        fontSize: 10,
        fontWeight: '600',
        marginBottom: 7,
      },
      headerStyle: {
        borderBottomColor: colors.borderTopBottomColor,
        borderBottomWidth: 0.5,
      },
      headerTitleStyle: {
        fontWeight: '700',
      },
      headerTitleAlign: 'center',
      headerShadowVisible: true,
      tabBarIconStyle: {
        marginTop: 5,
      },
      tabBarActiveTintColor: colors.tabBarActiveTintColor,
      tabBarInactiveTintColor: colors.tabBarInactiveTintColor,
      tabBarStyle: {
        borderTopColor: colors.borderTopBottomColor,
        borderTopWidth: 0.5,
      },
      headerLeftContainerStyle: {
        paddingLeft: 30,
      },
      headerRightContainerStyle: {
        paddingRight: 30,
      },
    }}>
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarIcon: ({focused}) => (
          <Icon
            name={focused ? 'home' : 'home-outline'}
            color={
              focused
                ? colors.tabBarActiveTintColor
                : colors.tabBarInactiveTintColor
            }
            size={20}
          />
        ),
        title: 'Home',
      }}
    />
    <Tab.Screen
      name="Pray"
      component={Pray}
      options={{
        tabBarIcon: ({focused}) => (
          <Icon
            name={focused ? 'heart' : 'heart-outline'}
            color={
              focused
                ? colors.tabBarActiveTintColor
                : colors.tabBarInactiveTintColor
            }
            size={20}
          />
        ),
        title: 'Pray',
      }}
    />
    <Tab.Screen
      name="Penalty"
      component={Penalty}
      options={{
        tabBarIcon: ({focused}) => (
          <Icon
            name={focused ? 'cash' : 'cash-outline'}
            color={
              focused
                ? colors.tabBarActiveTintColor
                : colors.tabBarInactiveTintColor
            }
            size={20}
          />
        ),
        title: 'Penalty',
      }}
    />
  </Tab.Navigator>
);

export default TabsNav;
