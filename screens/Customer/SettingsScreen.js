import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {  View } from "../../components/Themed";
import { Button } from "react-native-elements";
import UserContext from "../../UserContext";
import fb from "../../fb";

export default function SettingsScreen() {
  const { user } = useContext(UserContext);

  const logout = async () => {
    await fb.auth().signOut();
  };

  return (
    <View>
      <View style={styles.getStartedContainer}>
        {/* <TouchableOpacity onPress={logout} style={styles.title}>
          <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
            Logout
          </Text> */}
          <Button buttonStyle={styles.logoutBtn} onPress={logout} title="Logout" />
        {/* </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    padding:10,
    margin:20,
    width: 200,
    backgroundColor: "green",
  }
});
