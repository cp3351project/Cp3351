import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import {  View } from '../../components/Themed';
import UserContext from '../../UserContext'
import { Button } from "react-native-elements";

import fb from '../../fb'

export default function SettingsScreen() {

  const { user } = useContext(UserContext)

  const logout = async () => {
    await fb.auth().signOut()
  }


  return (
    <View>
      <View style={{}}>
    

      <Button buttonStyle={styles.logoutBtn} onPress={logout} title="Logout" />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    padding:10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:100,
    margin:20,
    width: 200,
    backgroundColor: "green",
  }
});
