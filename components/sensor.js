import React, { useEffect, useContext , useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import db from "../db";
import { Icon, Button } from "react-native-elements";
import UserContext from "../UserContext";

export default function Sensor({ sensor, isTester }) {
  const rand = Math.floor(Math.random() * (16000 - 10500 + 1) + 10500);
  const { user } = useContext(UserContext);
  const [isTypeTwo, setIsTypeTwo] = useState(false);

  const { id } = user;

  useEffect(() => {
    if (!isTester) {
      handleStartSimulator();
    }
  }, []);

  
function checkAvailability(arr, val) {
  return arr.some(function(arrVal) {
    return val === arrVal;
  });
}

  const handleStartSimulator = async () => {
    const SensorSetOne = ['Water Sensor','Food Sensor','Electricity Sensor'];
    const SensorSetTwo = ['Weather Sensor', 'BP Sensor'];
   

    setInterval(async () => {
      let SensorItem = await db.Sensors.findOne(sensor.id);
      if(checkAvailability(SensorSetOne, SensorItem.name)){
        await db.Sensors.UpdateSensors(SensorItem, id);
      }  
      else if(checkAvailability(SensorSetTwo, SensorItem.name)){
        await db.Sensors.UpdateSensorTypeTwo(SensorItem, id);
        setIsTypeTwo(true)
      }  
    }, rand);
  };

  const increment = async (type) => {
    let SensorItem = await db.Sensors.findOne(sensor.id);
    db.Sensors.IncDecSensor(SensorItem, type);
  };

  const requestSupplement = async () => {
    await db.notifications.createNotification("Request Supplment", sensor, id);
    const deviceDetails = await db.Devices.findOne(sensor.DeviceID);
    const farmDetails = await db.Farms.findOne(deviceDetails.FarmUID);
    await db.supplement.createSupplementRequest(
      sensor.id,
      id,
      farmDetails.supplier
    );
    await db.Sensors.updateSupplementNeed(sensor.id);
  };

  return (
    <>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ marginBottom: 10 }}>
          <Icon size={16} name="star" />
          current: {sensor.current} : {sensor.Unit}
        </Text>
        {isTester && (
          <Icon
            name="add"
            onPress={async ()  => await increment("increment")}
            type="ionicon"
            color="green"
          />
        )}
        {isTester && (
          <Icon
            name="remove"
            onPress={async () => await increment("decrement")}
            type="ionicon"
            color="green"
          />
        )}
      </View>

      <Text style={{ marginBottom: 10 }}>
        <Icon size={16} name="star" />
        min: {sensor.Min} : {sensor.Unit}
      </Text>

      <Text style={{ marginBottom: 10 }}>
        <Icon size={16} name="star" />
        max: {sensor.Max} : {sensor.Unit}
      </Text>

      <Text style={{ marginBottom: 10 }}>
        <Icon size={16} name="star" />
        Status: {(sensor.current > sensor.Max) || (sensor.current < sensor.Min) ? "on" : "off"}
      </Text>
      {(sensor.current >= sensor.Max) || (sensor.current <= sensor.Min) && (
        <View>
          <Icon reverse name="warning" type="ionicon" color="red" />

          {!sensor.supplementRequest && !isTypeTwo && (
            <Button
              buttonStyle={{
                backgroundColor: "green",
              }}
              onPress={async () => {
                await requestSupplement();
              }}
              title="Request Supplement"
            />
          )}

          {sensor.supplementRequest && (
            <Text style={{ marginBottom: 10, color: "orange" }}>
              Supplement pending supplier!
            </Text>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({});
