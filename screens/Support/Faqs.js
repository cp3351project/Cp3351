import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView,Pressable  } from "react-native";
import { ListItem,Text,Button,Input } from "react-native-elements";
import db from "../../db";

export default function Faqs() {
  const [reports, setReports] = useState([]);
  const [ActiveIndex, setActiveIndex] = useState();
  const [UserInput, setUserInput] = useState();

  useEffect(() =>{
    try {
      db.Reports.listenAll(setReports)      
    } catch (error) {
      
    }
    
    return () => {
      setActiveIndex(null)
      setUserInput(null)
      setReports([])
    };

  } , [])

  const updateActiveItem=itemIndex=>{
    setActiveIndex(itemIndex)
  }

  const Submit = async (item,UserInput) => {
    try {
     await db.Reports.update({
        id: item.id,
        reply: UserInput,
        query:item.query,
        userId: item.userId,
        typeOfQuery:item.typeOfQuery,
        dateAndTime:item.dateAndTime
      })
    } catch (error) {
      alert(error.message);
    }
  };

  return (
      <>
    <Text h1 style={styles.header}>FAQ</Text>
    <ScrollView style={styles.container}>
      { 
       reports.map((l, i) => (
        <ListItem key={i} bottomDivider>
          <ListItem.Content style={{height:150}}>
          <Pressable onPress={()=> updateActiveItem(i)}>
            <ListItem.Title>{l.query}</ListItem.Title>
            <ListItem.Subtitle>{l.typeOfQuery}</ListItem.Subtitle>
            </Pressable>
            {
            ActiveIndex===i
            &&
            <>
            <Input placeholder="input" onChangeText={(input) => setUserInput(input)} />
            <Button
            buttonStyle={{
              backgroundColor: "green",
            }}
            onPress={ () => {Submit(l,UserInput)}}
            title="Submit"
          />
          </>
            }
            
          </ListItem.Content>
        </ListItem>
      ))
      }
    </ScrollView> 
    </>
  );  
}


const styles = StyleSheet.create({
  header: {
    color:'green',
    marginTop: 2,
    margin:10,
  }
});
