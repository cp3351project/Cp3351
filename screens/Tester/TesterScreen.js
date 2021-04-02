import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
} from "react-native";
import { View } from "../../components/Themed";
import {  Text, Card, Icon } from "react-native-elements";
import UserContext from "../../UserContext";
import SensorComponent from "../../components/SensorComponent";
import ActionPicker from "../pickers/ActionCategory";
import db from "../../db";

export default function TesterScreen() {
  const [device, setDevices] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState("");
  const [farm, setFarms] = useState([]); // all the farms with their props
  const [farms, setDropDownFarms] = useState([]); // dropdown values
  const { user } = useContext(UserContext);
  const { id } = user;

  useEffect(() => {
    try {
      db.Farms.listenFarms(setFarms, setDropDownFarms, id);
     
    } catch (error) {
      alert(error);
    }

    return () => {
      setDevices([])
      setSelectedFarm("")
      setFarms([])
      setDropDownFarms([])
    };
  }, []);

  useEffect(() => {
    try {
    if(selectedFarm != "" ){
      fetchDevices();
    }
    
    } catch (error) {
      alert(error);
    }

    return () => {
      setDevices([])
      setSelectedFarm("")
      setFarms([])
      setDropDownFarms([])
    };
  }, [selectedFarm]);

  const fetchDevices = () => {
    const id =  farm.find((item) => item.farmName === selectedFarm).id;
    db.Devices.listenDevicesByFarm(setDevices, id);
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


        {device &&
          device.map((dev, key) => (
            <Card  key={key}>
              <Card.Title key={key}>Device Name: {dev.name} </Card.Title>
              <Card.Divider />
              <Text style={{ marginBottom: 10 }}>
                <Icon key={key} size={16} name="star" />
                Status: {dev.isOn == true ? "on" : "off"}
              </Text>
              <SensorComponent deviceId={dev.id} isTester={true}></SensorComponent>
            </Card>
          ))}

        {selectedFarm === "" && (
          <Text h3 style={{ textAlign: "center" }}>
            No Selection made{" "}
          </Text>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
