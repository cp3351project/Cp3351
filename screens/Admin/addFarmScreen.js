import React, { useState,  useContext } from "react";
import { StyleSheet, Text, Modal , Pressable , TextInput } from "react-native";
import { View } from "../../components/Themed";
import {  Button } from "react-native-elements";
import ActionPicker from "../pickers/ActionCategory";
import UserPicker from "../pickers/LoginPicker";
import UserContext from "../../UserContext";
import db from "./../../db";


export default function addFarmScreen({set,admin,dismissModal,subId}) {
  const { user } = useContext(UserContext);

  const [FarmName, setFarmName] = useState("");
  const [Uid, setUid] = useState("");
  const [Location, setLocation] = useState(null);
  const [Supplier, SetSupplier] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { id,name } = user;


  

  const Locations = [
    {
      Action: "Doha",
    },
    {
      Action: "Wakra",
    },
    {
      Action: "Um-Saaed",
    },
    {
      Action: "Al-Shammal",
    },
  ];

  const Sensors = [
    {
      Action: "Weather",
    },
    {
      Action: "Water",
    },
    {
      Action: "Food",
    },
    {
      Action: "Energy",
    },
  ];

  const Suppliers = [
    {
      Action: "Ali Bin Ali",
    },
    {
      Action: "Mannai",
    },
    {
      Action: "QPIC",
    },
    {
      Action: "Al-Sullati brothers",
    },
  ];

  const Submit = async () => {
    try {
      if(admin) {
        await db.Farms.createFarm(Uid, Location, name, Supplier);
        setModalVisible(true)     
      }
      else {
        await db.Payments.CreatePayment(subId, id,name,Uid,FarmName,Location,Supplier)
        setModalVisible(true)
        alert("Purchase request complete!")  
      }
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
                setModalVisible(!modalVisible)
               if(dismissModal)
                dismissModal(false) 
                set('Select Option')
              }
              }
            >
              <Text style={styles.textStyle}>Dismiss</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <TextInput
        style={styles.input}
        onChangeText={setFarmName}
        value={FarmName}
        placeholder="Farm Name"
      />
      <View style={{ flexDirection: "row" }}>
      <Text  style={{ marginTop: 15 }}>Location: </Text>  
      <ActionPicker set={setLocation} action={Location} actions={Locations} />
      </View>
      

      <View style={{ flexDirection: "row" }}>
      <Text  style={{ marginTop: 15 }}>Supplier: </Text>  
      <ActionPicker set={SetSupplier} action={Supplier} actions={Suppliers} />
      </View>

      {
     admin && <UserPicker setUid={setUid} />   
      }      
      
      <Button
        buttonStyle={{
          backgroundColor: "green",
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
 centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  input: {
    height: 40,
    margin: 7,
    borderWidth: 1,
  }
}
);
