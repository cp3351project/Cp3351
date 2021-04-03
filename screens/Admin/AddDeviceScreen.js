import React, { useState, useEffect } from "react";
import { StyleSheet, Text, Modal, Pressable } from "react-native";
import { View } from "../../components/Themed";
import { Button } from "react-native-elements";
import ActionPicker from "../pickers/ActionCategory";
import UserPicker from "../pickers/LoginPicker";
import db from "../../db";

export default function addDeviceScreen({func}) {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState();
  const [farm, setDropDownFarms] = useState([]);
  const [Uid, setUid] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    try {
      db.Farms.listenUser(setFarms, setDropDownFarms, Uid)      
    } catch (error) {
      alert(error)
    }



  },[Uid]);

  const Submit = async () => {
    try {
      await db.Devices[func](farms.find((farm) => farm.farmName === selectedFarm).id);
      setModalVisible(true);
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
              }}
            >
              <Text style={styles.textStyle}>Dismiss</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={{ flexDirection: "row", marginStart: 10 }}>
        <Text style={{ marginTop: 15 }}>Select User: </Text>

        <UserPicker setUid={setUid} />
      </View>
      <View style={{ flexDirection: "row", marginStart: 10 }}>
        <Text style={{ marginTop: 15 }}>Select Farm: </Text>
        {farm?.length > 0 && (
          <ActionPicker
            set={setSelectedFarm}
            action={selectedFarm}
            actions={farm}
          />
        )}

        {farm?.length <= 0 && (
          <Text style={{ marginTop: 15 }}>User does not have a farm </Text>
        )}
      </View>

      <Button
        buttonStyle={{
          backgroundColor: "green",
          margin: 20,
        }}
        onPress={Submit}
        icon={{
          name: "check",
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  inputWrap: {
    flex: 1,
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
