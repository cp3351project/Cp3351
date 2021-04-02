import React, { useState, useContext, useEffect } from "react";
import { StyleSheet } from "react-native";
import { View } from "../../components/Themed";
import { Button, Text, Card, Icon } from "react-native-elements";
import UserContext from "../../UserContext";
import db from "../../db";

export default function FarmStatusScreen({set}) {
  const [farms, setFarms] = useState([]);

  const { user } = useContext(UserContext);
  const { id } = user;

  async function FetchFarms() {
    set(false)
    await db.Farms.listenByUser(setFarms, id);
  }

  useEffect(() => {
    try {
      FetchFarms();   
    } catch (error) {
      alert(error)
    }
   
    return () => {
      setFarms([])
    };
  }, []);

  const Submit = () => {
    set(true)
  };

  return (
    <View>
      

      {farms.map((farm, key) => (
      
<Card key={key}>
<Card.Title key={key}>farm Name: {farm.farmName}</Card.Title>
<Card.Divider  /> 
<Text  style={{marginBottom: 10}}>
<Icon key={key} size={16} name='star' />
location: {farm.location}
</Text>

<Text style={{marginBottom: 10}}>
<Icon key={key} size={16} name='star' />
subscription Status: {farm.subScriptionStatus}
</Text>

<Text style={{marginBottom: 10}}>
<Icon key={key} size={16} name='star' />
supplier: {farm.supplier}
</Text>

</Card>

      ))}


<Button
        buttonStyle={{
          backgroundColor: "green",
          margin:20
        }}
        onPress={Submit}
        icon={{
          name: "arrow-left",
          size: 15,
          color: "white",
        }}
        title="Return to main menu"
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
});
