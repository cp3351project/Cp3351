import React, { useState } from "react";
import fb from "./fb";
import db from "./db";
import { StyleSheet, TextInput, Image } from "react-native";
import { View } from "./components/Themed";
import LoginPicker from "./screens/pickers/LoginPicker";
import { Button } from "react-native-elements";

export default function RegisterLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    await fb.auth().signInWithEmailAndPassword(email, password);
  };

  const register = async () => {
    try {
      await fb.auth().createUserWithEmailAndPassword(email, password);
      await db.Users.update({
        id: fb.auth().currentUser.uid,
        role: "Customer",
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const valid = () => email !== "" && password !== "";

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri:
            "https://lh3.googleusercontent.com/proxy/-rNZVTLFRbkAxKBn-8kOVrGalE4npdzzA_YdySUdYSS7E-e_QzzJ15bt7jDadk1tp7cF6lNsRuF49I2Xmj7tsw",
        }}
        style={{ resizeMode: "center", width: "100%", height: "20%" }}
      />
      <LoginPicker setEmail={setEmail} setPassword={setPassword} setUid={setEmail} />
      <TextInput
        style={{ height: 40, width: 200, borderColor: "gray", borderWidth: 1 }}
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={{ height: 40, width: 200, borderColor: "gray", borderWidth: 1 }}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />

      {/* <Button
        onPress={login}
        icon={{
          name: "arrow-right",
          size: 15,
          color: "white",
        }}
        title="Login"
      />

      <Button
        onPress={register}
        icon={{
          name: "arrow-right",
          size: 15,
          color: "white",
        }}
        title="Register"
      /> */}

      <View style={styles.ButtonGroupContainer}>
        <View style={styles.ButtonContainer}>
          <Button
            buttonStyle={{
              backgroundColor: "green",
            }}
            onPress={login}
            icon={{
              name: "lock-open",
              size: 15,
              color: "white",
            }}
            title="Login"
          />
        </View>
        <View style={styles.ButtonContainer}>
          <Button
            buttonStyle={{
              backgroundColor: "green",
            }}
            onPress={register}
            icon={{
              name: "pencil",
              size: 15,
              color: "white",
            }}
            title="register"
          />
        </View>
      </View>
      {/* <TouchableOpacity disabled={!valid()} onPress={login} style={styles.title}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>Login</Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity disabled={!valid()} onPress={register} style={styles.title}>
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>Register</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: 150,
    height: 150,
  },
  ButtonContainer: {
    margin: 20,
  },
  ButtonGroupContainer: {
    flexDirection: "row",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  developmentModeText: {
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)",
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
