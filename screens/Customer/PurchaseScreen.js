import React, { useState, useContext } from "react";
import { StyleSheet, ScrollView, Modal, Text } from "react-native";
import { View } from "../../components/Themed";
import { Button, PricingCard } from "react-native-elements";
import UserContext from "../../UserContext";
import AddFarm from './../Admin/addFarmScreen'

export default function PurchaseScreen({ set }) {
  const { user } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [Action, setAction] = useState(null)
  const [SubId, setSubId] = useState()
  const { id, name } = user;


  const purchasePackage = async (subScriptionId) => {
    try {
      setModalVisible(!modalVisible);
      setSubId(subScriptionId)
    } catch (error) {
      alert(error);
    }
  };

  const Submit = async () => {
    set(true);
  };

  const farmPackages = [
    {
      color: "#4f9deb",
      title: "Starter Farm",
      price: "$9999",
      info: [
        "1 Farm",
        "Starter IOT Devices",
        "Farm animals including a cow a goat and chicken",
      ],
    },
    {
      color: "orange",
      title: "Basic Farm",
      price: "$29999",
      info: [
        "1 Farm",
        "Basic IOT Devices",
        "Farm animals including a cow,goat,turkey and chicken",
      ],
    },
    {
      color: "red",
      title: "Premium Farm",
      price: "$70000",
      info: [
        "1 Farm",
        "Premium IOT Devices",
        "Farm animals including a cow,goat,turkey,horse and chicken",
      ],
    },
  ];

  return (
    <View>
      <ScrollView style={styles.container}>
        {farmPackages.map(  (dev, key) => (
          <PricingCard
            key={key}
            color={dev.color}
            title={dev.title}
            price={dev.price}
            info={dev.info}
            onButtonPress={ async () => await purchasePackage(key)}
            button={{ title: " Purchase", icon: "check" }}
          />
        ))}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
               <Text style={styles.modalText}>Farm details</Text> 
            <AddFarm set={setAction} admin={false} dismissModal={setModalVisible} subId={SubId} />

            </View>
          </View>
        </Modal>

        <Button
          buttonStyle={{
            backgroundColor: "green",
            margin: 40,
          }}
          onPress={Submit}
          icon={{
            name: "arrow-left",
            size: 15,
            color: "white",
          }}
          title="Return to main menu"
        />
      </ScrollView>
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
