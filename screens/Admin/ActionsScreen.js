import React, { useState } from 'react';
import { StyleSheet,Text } from 'react-native';
import { View } from '../../components/Themed';
import ActionPicker from '../pickers/ActionCategory'
import AddFarm from './addFarmScreen'
import AddDevice from './AddDeviceScreen'



export default function ActionsScreen() {

const [Action, setAction] = useState(null)


  const actions = [
    {
      "Action": "add farm",
    },
    {
        "Action": "add Water pump",
    },
    {
        "Action": "add Back up generator",
    },
    {
        "Action": "add Animal Chipset",
    },
    {
        "Action": "add Fan",
    },
    {
        "Action": "add Food lid",
    }
]




 
  return (
    <View>
      <ActionPicker set={setAction} action={Action} actions = {actions} />
   
       {
        Action
        &&
        Action === "add farm"
        &&
        <AddFarm set={setAction} admin={true} />
      }
      {
        Action
        &&
        Action === "add Water pump"
        &&
        <AddDevice func={'Water Pump'} />
      }
      {
        Action
        &&
        Action === "add Back up generator"
        &&
        <AddDevice func={'Backup Generator'} />
      }
      {
        Action
        &&
        Action === "add Animal Chipset"
        &&
        <AddDevice func={'Animal Chipset'} />
      }
      {
        Action
        &&
        Action === "add Fan"
        &&
        <AddDevice func={'Fan'} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
