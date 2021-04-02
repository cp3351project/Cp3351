import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { View } from "../../components/Themed";
import { Button, Text, Card, ListItem, Icon } from "react-native-elements";
import UserContext from "../../UserContext";
import db from "../../db";

export default function QaScreen() {
  const [questions, setQuestions] = useState([]);
  const { user } = useContext(UserContext);
  const { id } = user;

  useEffect(() => {
    try {
      db.Reports.listenAll(setQuestions);
    } catch (error) {
      alert(error);
    }
  }, []);

  return (
    <View>
      <ScrollView style={styles.container}>
      <Text h1 style={{ marginBottom: 10 }}>Questions</Text>
        {questions &&
          questions.filter(item => item.typeOfQuery === "Ask a question").map((question, key) => (
            <Card key={key}>
              <Card.Title key={key}>
                Type of query: {question.typeOfQuery}{" "}
              </Card.Title>
              <Card.Divider />
              <Text style={{ marginBottom: 10 }}>
                <Icon key={key} size={16} name="star" />
                Query: {question.query}
              </Text>
              <Text style={{ marginBottom: 10 }}>
                <Icon key={key} size={16} name="star" />
                Reply: {question.reply}
              </Text>
            </Card>
          ))}
      <Text h1 style={{ marginBottom: 10 }}>Bugs reported</Text>
        {questions &&
          questions.filter(item => item.userId == id && item.typeOfQuery === "Report a bug").map((question, key) => (
            <Card key={key}>
              <Card.Title key={key}>
                Type of query: {question.typeOfQuery}{" "}
              </Card.Title>
              <Card.Divider />
              <Text style={{ marginBottom: 10 }}>
                <Icon key={key} size={16} name="star" />
                Query: {question.query}
              </Text>
              <Text style={{ marginBottom: 10 }}>
                <Icon key={key} size={16} name="star" />
                Reply: {question.reply}
              </Text>
            </Card>
          ))}

        {questions.length === 0 && (
          <Text h3 style={{ textAlign: "center" }}>
            No questions found{" "}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
