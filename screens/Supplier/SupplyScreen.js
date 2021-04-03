import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Pressable, ScrollView } from "react-native";
import { View } from "../../components/Themed";
import SupplementDetails from "../../components/supplementDetails";
import { ListItem, Icon, Text, Button } from "react-native-elements";
import UserContext from "../../UserContext";
import db from "../../db";
export default function SupplyScreen() {
  const [payments, setPayments] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [supplement, setSupplement] = useState([]);

  const [userCompany, setUserCompany] = useState();

  const { user } = useContext(UserContext);
  const { id } = user;

  useEffect(() => {
    async function fetchUser() {
      const response = await db.Users.findOne(id);
      setUserCompany(response.company);
      db.Farms.listenBySupplier(setSupplier, response.company);
      db.supplement.listenByStatus(
        setSupplement,
        "unfulfilled",
        response.company
      );
      console.log("supplement:!  ", supplement);
    }
    try {
      fetchUser();
    } catch (error) {
      alert(error);
    }
  }, []);

  const Supply = async (supplementId,sensorId) => {
    try {
      console.log(supplementId)
      await db.supplement.updateSupplementRequest(supplementId);
      await db.Sensors.updateSensor(sensorId,10000);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View>
      <ScrollView>
        <Text style={{ textAlign: "center" }} h2>
          Company: {userCompany}
        </Text>

        {supplement.map((supplementItem, i) => (
          <Pressable key={i}>
            {
              <ListItem
                style={{ borderWidth: 0.3, borderColor: "green" }}
                key={i}
                bottomDivider
              >
                <ListItem.Content>
                <SupplementDetails sensorid={supplementItem.sensorId} userid={supplementItem.userId} />
                  <ListItem.Subtitle>
                    status: {supplementItem.status}
                  </ListItem.Subtitle>
                  <ListItem.Subtitle>
                  </ListItem.Subtitle>
                  <View style={{ flexDirection: "row" }}>
                    <Button
                      buttonStyle={{
                        backgroundColor: "red",
                      }}
                      onPress={() => {
                        Supply(supplementItem.id,supplementItem.sensorId);
                      }}
                      title="Supply"
                    />
                  </View>
                </ListItem.Content>
              </ListItem>
            }
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
