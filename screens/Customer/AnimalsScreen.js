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

export default function AnimalsScreen({ set }) {
  const [animal, setAnimals] = useState([]);
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

    return () => {
      setAnimals([])
      setSelectedFarm(null)
      setFarms([])
      setDropDownFarms([])
    };
  }, []);

  useEffect(() => {
    try {
      SimulateDevices();
    } catch (error) {
      alert(error);
    }

    return () => {
      setAnimals([])
      setSelectedFarm(null)
      setFarms([])
      setDropDownFarms([])
    };
  }, [selectedFarm]);

  const SimulateDevices = async () => {
    const id = await farm.find((item) => item.farmName === selectedFarm).id;
    db.Animals.listenAnimalsByFarm(setAnimals, id);
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

        {animal &&
          animal.map((Animal, key) => (
            <Card  key={key}>
              <Card.Title key={key}>Animal name: {Animal.name} </Card.Title>
              <Card.Divider />
              <Text style={{ marginBottom: 10 }}>
                <Icon key={key} size={16} name="star" />
                Health Status: {Animal.HealthStatus}
              </Text>
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
