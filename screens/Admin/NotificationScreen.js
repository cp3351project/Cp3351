import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { View } from "../../components/Themed";
import { Text, Card, ListItem, Icon } from "react-native-elements";
import db from "../../db";

export default function NotificationScreen() {
  const [Notifications, setNotifications] = useState([]);
 

  useEffect(() => {
    try {
      db.Notifications.listenAll(setNotifications);
    } catch (error) {
      alert(error);
    }
  }, []);

  return (
    <View>
      <ScrollView style={styles.container}>
        {Notifications &&
          Notifications.map((question, key) => (
            <Card key={key}>
              <Card.Title key={key}>
                Type of Notification: {question.typeOfNotification}{" "}
              </Card.Title>
              <Card.Divider />
              <Text style={{ marginBottom: 10 }}>
                <Icon key={key} size={16} name="star" />
                Sensor name: {question.notificationDetails.name}
              </Text>
              <Text style={{ marginBottom: 10 }}>
                <Icon key={key} size={16} name="star" />
                Current: {question.notificationDetails.current}
              </Text>
              <Text style={{ marginBottom: 10 }}>
                <Icon key={key} size={16} name="star" />
                Status: {question.notificationDetails.isOn === true ? "On" : "Off"}
              </Text>
            </Card>
          ))}

        {Notifications.length === 0 && (
          <Text h3 style={{ textAlign: "center" }}>
            No Notifications found{" "}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
