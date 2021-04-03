import React, { useState, useEffect } from 'react';
import { StyleSheet   } from 'react-native';
import { Card } from "react-native-elements";
import Sensors from "./sensor";
import db from "../db";


export default function SensorComponent({ deviceId , isTester  }) {
  const [SensorItem, setSensor] = useState([]);

  useEffect(() => {
    db.Sensors.FetchSensors(deviceId,setSensor);
    return () => {
    };
  }, []);


  return (
    <>
    {    
      (SensorItem.length > 0) && SensorItem.map((sensor, key) => (
           <Card key={key} containerStyle={{ borderColor:'white',elevation:0,   flexDirection: 'row',alignItems: 'flex-start'}}>
            <Card.Title key={key}>sensor Name: {sensor.name} </Card.Title>
            <Sensors sensor={sensor} isTester={isTester}  />
           </Card>    
        ))
      }   
   </>
  )
}

const styles = StyleSheet.create({

});
