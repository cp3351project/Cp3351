import React, { useState, useEffect } from 'react';
import { StyleSheet   } from 'react-native';
import {  Text } from "react-native-elements";
import db from "../db";


export default function supplementDetails({ sensorid , userid  }) {
  const [SensorItem, setSensor] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    db.Users.listenOne(setSensor,userid);
    db.Farms.listenOne(setUser,sensorid);
  }, []);


  return (
    <>
     <Text>user name: {user.name}</Text>
     <Text>Sensor name: {SensorItem.name}</Text>  
   </>
  )
}

const styles = StyleSheet.create({

});
