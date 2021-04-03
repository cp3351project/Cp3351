import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
} from "react-native";
import { View } from "../../components/Themed";
import { Button, Text, Card, ListItem, Icon } from "react-native-elements";
import UserContext from "../../UserContext";
import SensorComponent from "../../components/SensorComponent";
import ActionPicker from "../pickers/ActionCategory";

import db from "../../db";

export default function DeviceStatusScreen({ set }) {
  const [device, setDevices] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState("");
  const [farm, setFarms] = useState([]); // all the farms with their props
  const [farms, setDropDownFarms] = useState([]); // dropdown values
  const { user } = useContext(UserContext);
  const { id } = user;

  useEffect(() => {
    try {
      set(false);
      db.Farms.listenUser(setFarms, setDropDownFarms, id);
    } catch (error) {
      alert(error);
    }


  }, []);

  useEffect(() => {
    try {
      SimulateDevices();
    } catch (error) {
      alert(error);
    }

    // return () => {
    //   setDevices([])
    //   setSelectedFarm(null)
    //   setFarms([])
    //   setDropDownFarms([])
    // };
  }, [selectedFarm]);

  const SimulateDevices = async () => {
    const id = await farm.find((item) => item.farmName === selectedFarm).id;
    db.Devices.listenDevicesByFarm(setDevices, id);
  };

  const Submit = async () => {
    set(true);
  };

  return (
    <View>
      <ScrollView style={styles.container}>
        {farms?.length > 0 && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActionPicker
              set={setSelectedFarm}
              action={selectedFarm}
              actions={farms}
            />
          </View>
        )}

        {/* {device &&
        device.map((dev, key) => (
       <SensorComponent key={key} deviceId={dev.id}></SensorComponent>
        ))} */}

        {device &&
          device.map((dev, key) => (
            <Card  key={key}>
              <Card.Title key={key}>Device Name: {dev.name} </Card.Title>
              <Card.Divider />
         
              <Text style={{ marginBottom: 10 }}>
                <Icon key={key} size={16} name="star" />
                Status: {dev.isOn == true ? "on" : "off"}
              </Text>
              <SensorComponent deviceId={dev.id} ></SensorComponent>
            </Card>
          ))}

        {selectedFarm === "" && (
          <Text h3 style={{ textAlign: "center" }}>
            No Selection made{" "}
          </Text>
        )}

        <Button
          buttonStyle={{
            backgroundColor: "green",
            margin: 20,
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

const styles = StyleSheet.create({});
