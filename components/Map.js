import React, { useEffect, useContext, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import db from "../db";
import { Icon, Button } from "react-native-elements";
import UserContext from "../UserContext";
import {MapView } from "react-native-maps";
import { Marker } from "react-native-maps";
const height = Dimensions.get("window").height;

export default function Map({ set }) {
  const { user } = useContext(UserContext);
  const { id } = user;

  useEffect(() => {}, []);

  function close() {
    set(false);
  }

  return (
    <>
      <MapView
        style={styles.map}
        loadingEnabled={true}
        initialRegion={{
          latitude: 43.594231,
          longitude: -83.825947,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 43.594231, longitude: -83.825947 }}
          title={"Animal"}
          description={"farm animal Healthy"}
          image={
            "https://cdn2.iconfinder.com/data/icons/agriculture-1/512/location-512.png"
          }
        ></Marker>
          {/* <OverlayComponent
      style={{position: "absolute", bottom: 50}}
    /> */}
      </MapView>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    height,
  },
  buttonCallout: {
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 0.5,
    borderRadius: 20,
  },
});
