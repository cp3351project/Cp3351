import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import NavigationCustomer from "./navigation/customer";
import NavigationAdmin from "./navigation/admin";
import NavigationSupport from "./navigation/support";
import NavigationFinancial from "./navigation/Financial";
import NavigationTester from "./navigation/Tester";

import { LogBox } from "react-native";

import fb from "./fb";
import db from "./db";
import UserContext from "./UserContext";
import RegisterLogin from "./RegisterLogin";
import "./SampleData";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [user, setUser] = useState(null); // store db user, not auth user
  LogBox.ignoreLogs(["Setting a timer for a long period of time"]);

  // run once, set listener to auth user state
  useEffect(() => {
    const findAndSetUser = async (user) => {
      if (user) {
        db.Users.listenOne(setUser, user.uid);
      } else {
        setUser(null);
      }
    };
    const authUnsubscribe = fb.auth().onAuthStateChanged(findAndSetUser);
    return () => {
      try {
        authUnsubscribe();
      } catch (error) {
        alert(error);
      }
    };
  }, []);

  const selectNavigation = () => {
    if (!user) {
      return <RegisterLogin />;
    } else if (user?.role === "Customer") {
      return <NavigationCustomer colorScheme={colorScheme} />;
    } else if (user?.role === "Admin") {
      return <NavigationAdmin colorScheme={colorScheme} />;
    } else if (user?.role === "Support") {
      return <NavigationSupport colorScheme={colorScheme} />;
    } else if (user?.role === "Tester") {
      return <NavigationTester colorScheme={colorScheme} />;
    } else if (user?.role === "financial") {
      return <NavigationFinancial colorScheme={colorScheme} />;
    } else {
      fb.auth().signOut();
      return null;
    }
  };

  return (
    isLoadingComplete && (
      <UserContext.Provider value={{ user }}>
        <SafeAreaProvider>
          {selectNavigation()}
          <StatusBar />
        </SafeAreaProvider>
      </UserContext.Provider>
    )
  );
}
