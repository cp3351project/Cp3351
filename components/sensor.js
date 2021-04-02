import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import db from "../db";
import { Icon } from "react-native-elements";
export default function Sensor({ sensor , isTester }) {


  const rand = Math.floor(Math.random() * (12000 - 2500 + 1) + 2500);
  const Interval = null;

  useEffect(() => {
    if (!isTester) {
      handleStartSimulator();
    }

    // return () => {
    //   clearInterval(Interval)
    // };
  }, []);

  const handleStartSimulator = async () => {
    setInterval(async () => {
      let SensorItem = await db.Sensors.findOne(sensor.id);
      db.Sensors.UpdateSensors(SensorItem);
    }, rand);
  };

  
  const increment = async (type) => {
    let SensorItem = await db.Sensors.findOne(sensor.id);
    db.Sensors.IncDecSensor(SensorItem,type);
  };

  return (
    <>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ marginBottom: 10 }}>
          <Icon size={16} name="star" />
          current: {sensor.current}
        </Text>
        {
        isTester &&
        <Icon name="add"  onPress={() => increment("increment")} type="ionicon" color="green" />
        }
        {
        isTester &&
        <Icon name="remove"  onPress={() => increment("decrement")} type="ionicon" color="green" />
        }
      </View>

      <Text style={{ marginBottom: 10 }}>
        <Icon size={16} name="star" />
        min: {sensor.Min}
      </Text> 

      <Text style={{ marginBottom: 10 }}>
        <Icon size={16} name="star" />
        max: {sensor.Max}
      </Text>

      <Text style={{ marginBottom: 10 }}>
        <Icon size={16} name="star" />
        Status: {sensor.isOn == true ? "on" : "off"}
      </Text>
      {sensor.isOn == true && (
        <Icon reverse name="warning" type="ionicon" color="orange" />
      )} 
    </>
  );
}

const styles = StyleSheet.create({});
