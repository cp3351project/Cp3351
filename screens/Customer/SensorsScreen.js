import * as Notification from "expo-notifications";
import * as Permission from "expo-permissions";
import React, { useState , useEffect , useContext} from "react";
import { StyleSheet, Pressable } from "react-native";
import { View } from "../../components/Themed";
import { ListItem, Avatar } from "react-native-elements";
import FarmStatusScreen from './FarmStatusScreen'
import DevicesStatusScreen from './DevicesStatusScreen'
import AnimalsScreen from './AnimalsScreen'
import PurchaseScreen from './PurchaseScreen'
import UserContext from "../../UserContext";
import fb from "./../../fb";



Notification.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldShowAlert: true,
    };
  },
});

export default function MenuScreen() {
  const [ActiveIndex, setActiveIndex] = useState();
  const [ShowMenu, setShowMenu] = useState(true);
  const { user } = useContext(UserContext);
  const { id,name } = user;
  const handleNotification = () => {
    Notification.scheduleNotificationAsync({
      content: {
        title: "Welcome back " + name,
        body: "",
      },
      trigger: {
        seconds: 5,
      },
    });
  };

  useEffect(() => {
    Permission.getAsync(Permission.NOTIFICATIONS)
      .then((response) => {
        if (response.status !== "granted") {
          return Permission.askAsync(Permission.NOTIFICATIONS);
        }
        return response;
      })
      .then((response) => {
        if (response.status !== "granted") {
          return;
        }
      });

      handleNotification();
  }, []);





  const menuItems = [
    {
      name: "Farms",
      avatar_url: "https://www.pngrepo.com/png/26307/512/farm.png",
      subtitle: "View the status of your farm",
    },
    {
      name: "Devices",
      avatar_url:
        "https://icons-for-free.com/iconfiles/png/512/sensor-131964752703471516.png",
      subtitle: "View the status of your IOT Devices",
    },
    {
      name: "Animals",
      avatar_url:
        "https://image.flaticon.com/icons/png/128/4388/4388935.png",
      subtitle: "View your farm Animals",
    },
    {
      name: "Store",
      avatar_url:
        "https://cdn2.iconfinder.com/data/icons/real-estate-1-12/50/13-512.png",
      subtitle: "Purchase farms, IOT devices and Animals for your farm",
    },
    {
      name: "Sign out",
      avatar_url:
        "https://iconarchive.com/download/i86056/graphicloads/100-flat-2/inside-logout.ico",
      subtitle: "Sign out the application",
    },
  ];

  const logout = async () => {
    await fb.auth().signOut();
  };

  const MenuOptions = () => {
    switch (ActiveIndex) {
      case 0:return (<FarmStatusScreen set={setShowMenu} />) 
      case 1:return   (<DevicesStatusScreen set={setShowMenu} /> )
      case 2:return   (<AnimalsScreen set={setShowMenu} /> )
      case 3:return (<PurchaseScreen set={setShowMenu} />)
      case 4:logout();
      break;
    }
  };

  const menuAction = (itemIndex) => {
    setShowMenu(false)
    setActiveIndex(itemIndex);
  };

  return (
    <View>
      {menuItems.map((l, i) => (
        <Pressable key={i} onPress={() => menuAction(i)}>
          {(ShowMenu) && (
            <ListItem
              style={{ borderWidth: 0.3, borderColor: "green" }}
              key={i}
              bottomDivider
            >
              <Avatar source={{ uri: l.avatar_url }} />
              <ListItem.Content>
                <ListItem.Title>{l.name}</ListItem.Title>
                <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          )}
        </Pressable>
      ))}

      {
     (!ShowMenu) && MenuOptions()
      }
    </View>
  );
}

const styles = StyleSheet.create({});
