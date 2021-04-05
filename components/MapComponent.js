import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Button,
} from "react-native";
// import MapView from "react-native-maps";
import Callout from "react-native-maps";
// import Marker from "react-native-maps";
import MapView, { Marker } from "react-native-maps";

const height = Dimensions.get("window").height;

export default function MapComponent({ set }) {
  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}> 
       
        <MapView.Marker
         coordinate={{ latitude : 37.78825 , longitude : -122.4324,latitudeDelta: 0.0922,longitudeDelta: 0.0421 }}
         title="farm"
         description="farm"
        image={"https://cdn2.iconfinder.com/data/icons/agriculture-1/512/location-512.png"}/>


       </MapView>
      

      <View style={{ position: "absolute", top: 20, left: 20 , fontSize:50 }}>
        <Button
          onPress={() => {set(false)}}
          title="Back"
          color="green"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    height,
  },
  buttonCallout: {
    position: "absolute",
    backgroundColor: "red",
  },
  container: {
    flex: 1,
  },
  buttonCallout: {
    flex: 1,
    alignSelf: "flex-end",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    borderWidth: 0.5,
    borderRadius: 20,
  },
  touchable: {
    backgroundColor: "lightblue",
    padding: 10,
    margin: 10,
  },
  touchableText: {
    fontSize: 24,
  },
  searchCallout: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    width: "80%",
    marginLeft: "5%",
    marginTop: 40,
  },
  calloutSearch: {
    borderColor: "transparent",
    marginLeft: 10,
    width: "90%",
    marginRight: 10,
    height: 40,
    borderWidth: 0.0,
  },
});
