import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
// @ts-expect-error
import QaScreen from '../../screens/Customer/QaScreen';
// @ts-expect-error
import SensorsScreen from '../../screens/Customer/SensorsScreen';
// @ts-expect-error
import NotificationScreen from '../../screens/Admin/NotificationScreen';
// @ts-expect-error
import FAQScreen from '../../screens/Customer/ReportPage';


import { BottomTabParamList, TabOneParamList, TabTwoParamList, TabThreeParamList , TabFourParamList } from './types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  return (
    <BottomTab.Navigator
      initialRouteName="Menu"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Menu"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="grid-outline" color='green' />,
        }}
      />
      <BottomTab.Screen
        name="FAQ"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="help-outline" color='green' />,
        }}
      />
      <BottomTab.Screen
        name="QA"
        component={TabThreeNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color='green' />,
        }}
      />

      
      <BottomTab.Screen
        name="Notifications"
        component={TabFourNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="alert" color='green' />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  // @ts-expect-error
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="SensorsScreen"
        component={SensorsScreen}
        options={{ headerTitle: 'Menu' }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="ActionsScreen"
        component={FAQScreen}
        options={{ headerTitle: 'FAQ' }}
      />
    </TabTwoStack.Navigator>
  );
}

const TabThreeStack = createStackNavigator<TabThreeParamList>();

function TabThreeNavigator() {
  return (
    <TabThreeStack.Navigator>
      <TabThreeStack.Screen
        name="SettingsScreen"
        component={QaScreen}
        options={{ headerTitle: 'Q&A' }}
      />
    </TabThreeStack.Navigator>
  );
}

const TabFourStack = createStackNavigator<TabFourParamList>();

function TabFourNavigator() {
  return (
    <TabFourStack.Navigator>
      <TabFourStack.Screen
        name="NotificationsScreen"
        component={NotificationScreen}
        options={{ headerTitle: 'Notifications' }}
      />
    </TabFourStack.Navigator>
  );
}