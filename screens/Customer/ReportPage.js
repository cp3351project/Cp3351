import React, { useState, useContext } from "react";
import { StyleSheet, Modal, Pressable, TextInput } from "react-native";
import { View } from "../../components/Themed";
import { Button, Text } from "react-native-elements";
import ActionPicker from "../pickers/ActionCategory";
import UserContext from "../../UserContext";
import db from "./../../db";

export default function ReportPage() {
  const [complain, setComplain] = useState("");
  const [Uid, setUid] = useState("");
  const [userInput, setuserInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const { user } = useContext(UserContext);
  const { id } = user;

  const typeOfComplain = [
    {
      Action: "Report a bug",
    },
    {
      Action: "Ask a question",
    },
  ];

  const Submit = async () => {
    try {
      setModalVisible(true);
      await db.Reports.createReport(complain, userInput, id);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Submit succesfully!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                // set('Select Option')
              }}
            >
              <Text style={styles.textStyle}>Dismiss</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View>
        <View>
          <Text h5 style={{ margin: 10 }}>
            Type of Query
          </Text>
          <ActionPicker
            set={setComplain}
            action={complain}
            actions={typeOfComplain}
          />
        </View>

        <Text h4 style={{ margin: 10 }}>
          Describe your issue
        </Text>
        <TextInput
          style={styles.multiLineOfText}
          multiline={true}
          onChangeText={(text) => setuserInput(text)}
          numberOfLines={4}
        />
      </View>

      <Button
        buttonStyle={{
          backgroundColor: "green",
          margin: 20,
        }}
        onPress={Submit}
        icon={{
          name: "lock-open",
          size: 20,
          color: "white",
        }}
        title="Submit"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textAreaContainer: {
    // borderColor: COLORS.grey20,
    borderWidth: 1,
    padding: 5,
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  multiLineOfText: {
    justifyContent: "flex-start",
    borderColor: "#42435b",
    borderWidth: 3,
    fontSize: 14,
    padding: 10,
    height: 150,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
