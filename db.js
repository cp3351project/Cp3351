import firebase from "./fb";
import fetch from "node-fetch";
const db = firebase.firestore();

class DB {
  constructor(collection) {
    this.collection = collection;
  }

  reformat(doc) {
    return { id: doc.id, ...doc.data() };
  }

  findAll = async () => {
    const data = await db.collection(this.collection).get();
    return data.docs.map(this.reformat);
  };

  listenAll = (set) =>
    db.collection(this.collection).onSnapshot((snap) => {
      set(snap.docs.map(this.reformat));
    });

  findOne = async (id) => {
    const doc = await db.collection(this.collection).doc(id).get();
    return doc.exists ? this.reformat(doc) : undefined;
  };

  listenOne = (set, id) => {
    id === ""
      ? set(null)
      : db
          .collection(this.collection)
          .doc(id)
          .onSnapshot((snap) => set(this.reformat(snap)));
  };

  // item has no id
  create = async (item) => {
    const { id, ...rest } = item;
    return await db.collection(this.collection).add(rest);
  };

  // item has id
  update = async (item) => {
    const { id, ...rest } = item;
    await db.collection(this.collection).doc(id).set(rest);
  };

  remove = async (id) => {
    await db.collection(this.collection).doc(id).delete();
  };
}

class Sensors extends DB {
  constructor() {
    super("sensors");
    this.Readings = new Readings(this.collection);
  }

  listenByCategory = (set, categoryid) =>
    db
      .collection(this.collection)
      .where("categoryid", "==", categoryid)
      .onSnapshot((snap) => set(snap.docs.map(this.reformat)));

  listenByUser = (set, userid) =>
    db
      .collection(this.collection)
      .where("userid", "==", userid)
      .onSnapshot((snap) => set(snap.docs.map(this.reformat)));

  listenByUserAndCategory = (set, userid, categoryid) =>
    db
      .collection(this.collection)
      .where("userid", "==", userid)
      .where("categoryid", "==", categoryid)
      .onSnapshot((snap) => set(snap.docs.map(this.reformat)));

  toggleMotionDetected = (sensor) =>
    db
      .collection(this.collection)
      .doc(sensor.id)
      .set({ motiondetected: !sensor.motiondetected }, { merge: true });

  setMotionDetected = (sensor, motiondetected) =>
    db
      .collection(this.collection)
      .doc(sensor.id)
      .set({ motiondetected }, { merge: true });

  toggleAlert = (sensor) =>
    db
      .collection(this.collection)
      .doc(sensor.id)
      .set({ alert: !sensor.alert }, { merge: true });

  // reformat = (doc) => ({ id: doc.id, ...doc.data() });

  createSensor = async (DeviceID, name) => {
    let doc = await db.collection(this.collection).add({
      current: 100,
      Min: 100,
      Max: 10000,
      isOn: false,
      name: name,
      DeviceID: DeviceID,
      active: false,
    });
    return doc.id;
  };

  FetchSensors =  (deviceId, setSensor)  => {
     db.collection(this.collection)
      .where("DeviceID", "==",deviceId).onSnapshot((snap) => {
        setSensor(snap.docs.map(this.reformat));
      });
  };

  UpdateSensors = (Sensor) => {

    if(Sensor.current > Sensor.Max){
      db.collection(this.collection)
      .doc(Sensor.id)
      .set(
        {
          current: firebase.firestore.FieldValue.increment(
            Math.floor(Math.random() * (-100 - -20 + -1) + -20)
          ),isOn:true
        },
        { merge: true }
      );
    }
    else {
      db.collection(this.collection)
      .doc(Sensor.id)
      .set(
        {
          current: firebase.firestore.FieldValue.increment(
            Math.floor(Math.random() * (600 - 300 + 1) + 300)
          ),isOn:false
        },
        { merge: true }
      );
    }
  };


  IncDecSensor = (Sensor,type) => {
      db.collection(this.collection)
      .doc(Sensor.id)
      .set(
        {
          current: firebase.firestore.FieldValue.increment((type == "increment" ? 1 : -1)),isOn:false
        },
        { merge: true }
      );
    
  };


}

class Farms extends DB {
  constructor() {
    super("Farms");
  }
  createFarm = async (userId, location, farmName, supplierId) => {
    let doc = await db.collection(this.collection).add({
      user: userId,
      farmName: farmName,
      location: location,
      supplier: supplierId,
      subScriptionStatus: "unpayed",
      active: false,
    });
    return doc.id;
  };

  listenUser = (set, setDropdown, userId) => {
    db.collection(this.collection)
      .where("user", "==", userId)
      .onSnapshot((snap) => {
        set(snap.docs.map(this.reformat).filter(item => item.active == true));
        setDropdown(
          snap.docs.map(this.reformat).filter(item => item.active == true).map((farm) => {
            return { Action: farm.farmName };
          })
        );
      });
  };


  listenFarms = (set, setDropdown, userId) => {
    db.collection(this.collection)
      .onSnapshot((snap) => {
        set(snap.docs.map(this.reformat));
        setDropdown(
          snap.docs.map(this.reformat).map((farm) => {
            return { Action: farm.farmName };
          })
        );
      });
  };




  
  UpdateFarm =  async(farmId) => {
   await db.collection(this.collection).doc(farmId).update({active:true},{merge:true})
  };

  listenByUser = (set, userid) => {
    try {
      db.collection(this.collection)
        .where("user", "==", userid)
        .onSnapshot((snap) => {
        
          set(snap.docs.map(this.reformat));
        });
    } catch (error) {
      return null;
    }
  };
}

class Devices extends DB {
  constructor() {
    super("Devices");
  }

  FetchDevices = async (farmId, setDevice) => {
    db.collection(this.collection)
      .where("FarmUID", "==", farmId)
      .onSnapshot((snap) => {
        setDevice(snap.docs.map(this.reformat));
      });
  };

  createDevice = async (FarmUID, name) => {
    let doc = await db.collection(this.collection).add({
      name: name,
      Status: true,
      FarmUID: FarmUID,
      PurchaseDate: new Date(),
      active: true,
    });
    return doc.id;
  };

  listenDevicesByFarm = (set, farmId) => {
    db.collection(this.collection)
      .where("FarmUID", "==", farmId)
      .onSnapshot((snap) => {
        const snaps = snap.docs.map(this.reformat);
        set(snaps);
      });
  };
}


class Animals extends DB {
  constructor() {
    super("Animals");
  }

  listenAnimalsByFarm = (set, farmId) => {
    db.collection(this.collection)
      .where("FarmId", "==", farmId)
      .onSnapshot((snap) => {
        const snaps = snap.docs.map(this.reformat);
        set(snaps);
      });
  };

  createAnimal = async (FarmId, name) => {
    let doc = await db.collection(this.collection).add({
      name: name,
      FarmId: FarmId,
      HealthStatus: "healthy",
    });
    return doc.id;
  };
}

class Payments extends DB {
  constructor() {
    super("Payments");
  }

  CreatePayment = async (
    subScriptionId,
    userId,
    name,
    farmId,
    farmName,
    location,
    supplierId
  ) => {
    let total = 0;
    let FarmId = null;
    const farm = new Farms();
    const device = new Devices();
    const sensor = new Sensors();
    const animal = new Animals();
    switch (subScriptionId) {
      case 0: {
        FarmId = await farm.createFarm(userId, location, farmName, supplierId);
         await animal.createAnimal(FarmId,"Cow");
         await animal.createAnimal(FarmId,"goat");
         await animal.createAnimal(FarmId,"chicken");
        let WaterPumpdeviceId = await device.createDevice(FarmId, "Water Pump");
        let AnimalChipsetdeviceId = await device.createDevice(
          FarmId,
          "Animal Chipset"
        );
        await sensor.createSensor(WaterPumpdeviceId, "Water Sensor");
        await sensor.createSensor(AnimalChipsetdeviceId, "Food Sensor");
        total = 9999;
        break;
      }
      case 1: {
        FarmId = await farm.createFarm(userId, location, farmName, supplierId);
        let WaterPumpdeviceId = await device.createDevice(FarmId, "Water Pump");
        let FandeviceId = await device.createDevice(FarmId, "Fan");
        await animal.createAnimal(FarmId,"Cow");
        await animal.createAnimal(FarmId,"goat");
        await animal.createAnimal(FarmId,"chicken");
        await animal.createAnimal(FarmId,"turkey");
        let AnimalChipsetdeviceId = await device.createDevice(
          FarmId,
          "Animal Chipset"
        );
        await sensor.createSensor(WaterPumpdeviceId, "Water Sensor");
        await sensor.createSensor(FandeviceId, "Weather Sensor");
        await sensor.createSensor(AnimalChipsetdeviceId, "Food Sensor");
        total = 29999;
        break;
      }
      case 2: {
        FarmId = await farm.createFarm(userId, location, farmName, supplierId);
        let WaterPumpdeviceId = await device.createDevice(FarmId, "Water Pump");
        let FandeviceId = await device.createDevice(FarmId, "Fan");
        await animal.createAnimal(FarmId,"Cow");
        await animal.createAnimal(FarmId,"goat");
        await animal.createAnimal(FarmId,"chicken");
        await animal.createAnimal(FarmId,"turkey");
        await animal.createAnimal(FarmId,"horse");
        let BackUpGeneratordeviceId = await device.createDevice(
          FarmId,
          "Backup Generator"
        );
        let AnimalChipsetdeviceId = await device.createDevice(
          FarmId,
          "Animal Chipset"
        );
        await sensor.createSensor(WaterPumpdeviceId, "Water Sensor");
        await sensor.createSensor(FandeviceId, "Weather Sensor");
        await sensor.createSensor(AnimalChipsetdeviceId, "Food Sensor");
        await sensor.createSensor(
          BackUpGeneratordeviceId,
          "Electricity Sensor"
        );
        total = 70000;
        break;
      }
    }
    let payment = await db.collection(this.collection).add({
      userId: userId,
      BuyersName: name,
      total: total,
      Descion: false,
      subScriptionId: subScriptionId,
      dateAndTime: new Date(),
      farmId: FarmId,
    });
  };
}

class Reports extends DB {
  constructor() {
    super("Reports");
  }

  createReport = async (typeOfQuery, query, userId) => {
    const { uid: userid } = await db.collection(this.collection).add({
      typeOfQuery: typeOfQuery,
      query: query,
      userId: userId,
      reply: "",
      replyBy: "",
      dateAndTime: new Date(),
    });
  };

  listenByUser = (set, categoryid) =>
    db
      .collection(this.collection)
      .where("categoryid", "==", categoryid)
      .onSnapshot((snap) => set(snap.docs.map(this.reformat)));
}

class Readings extends DB {
  constructor(containing) {
    super("readings");
    this.containing = containing;
  }

  createReading = (sensorId, reading) =>
    db
      .collection(this.containing)
      .doc(sensorId)
      .collection(this.collection)
      .add(reading);

  listen2OrderByWhen = (set, sensorId) =>
    db
      .collection(this.containing)
      .doc(sensorId)
      .collection(this.collection)
      .orderBy("when", "desc")
      .limit(2)
      .onSnapshot((snap) => set(snap.docs.map(this.reformat)));

  listenLatestOne = (set, sensorId) =>
    db
      .collection(this.containing)
      .doc(sensorId)
      .collection(this.collection)
      .orderBy("when", "desc")
      .limit(1)
      .onSnapshot((snap) => set(snap.docs.map(this.reformat)[0]));
}

class Users extends DB {
  constructor() {
    super("users");
  }
}

class Categories extends DB {
  constructor() {
    super("categories");
  }

  // max 10
  listenInIds = (set, ids) =>
    db
      .collection(this.collection)
      .where(db.FieldPath.documentId(), "in", ids)
      .onSnapshot((snap) => set(snap.docs.map(this.reformat)));
}

export default {
  Categories: new Categories(),
  Sensors: new Sensors(),
  Users: new Users(),
  Farms: new Farms(),
  Reports: new Reports(),
  Devices: new Devices(),
  Payments: new Payments(),
  Animals: new Animals()
};
