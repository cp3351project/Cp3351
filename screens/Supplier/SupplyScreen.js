import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Pressable, ScrollView } from "react-native";
import { View } from "../../components/Themed";
import { ListItem, Icon } from "react-native-elements";
import UserContext from "../../UserContext";
import db from "../../db";
export default function SupplyScreen() {
  const [payments, setPayments] = useState([]);
  const [userCompany, setUserCompany] = useState();

  const { user } = useContext(UserContext);
  const { id } = user;

  useEffect(() => {
    async function fetchUser() {
      const response = await db.Users.findOne(id);
      setUserCompany(response.company);
      
      console.log("user company ", userCompany);
    }
    try {
      fetchUser();
    } catch (error) {
      alert(error);
    }
  }, []);

  const makeDecison = async (index, payment, Decison) => {
    try {
      const FilteredPayment = payments.filter((payment, i) => i !== index);
      await db.Payments.update({
        id: payment.id,
        Descion: true,
        Approved: Decison,
        BuyersName: payment.BuyersName,
        total: payment.total,
        dateAndTime: payment.dateAndTime,
        userId: payment.userId,
        farmId: payment.farmId,
        subScriptionId: payment.subScriptionId,
      });
      let UpdatedFarmDetails = await db.Farms.UpdateFarm(payment.farmId);
      setPayments(FilteredPayment);
      if (Decison) alert("payment approved successfully");
      else alert("payment rejected successfully");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View>
      <ScrollView>
        {payments.map(
          (paymentItem, i) =>
            paymentItem.Descion === false && (
              <Pressable key={i}>
                {
                  <ListItem
                    style={{ borderWidth: 0.3, borderColor: "green" }}
                    key={i}
                    bottomDivider
                  >
                    <ListItem.Content>
                      <ListItem.Title style={{ fontSize: 20 }}>
                        Buyer: {paymentItem.BuyersName}
                      </ListItem.Title>
                      <ListItem.Subtitle>
                        Payment total: {paymentItem.total}
                      </ListItem.Subtitle>
                      <View style={{ flexDirection: "row" }}>
                        <Icon
                          raised
                          name="check"
                          type="font-awesome"
                          color="green"
                          onPress={() => makeDecison(i, paymentItem, true)}
                        />
                        <Icon
                          raised
                          name="close"
                          type="font-awesome"
                          color="red"
                          onPress={() => makeDecison(i, paymentItem, false)}
                        />
                      </View>
                    </ListItem.Content>
                  </ListItem>
                }
              </Pressable>
            )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
