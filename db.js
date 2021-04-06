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
    db.collection(this.collection)
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

  createSensor = async (DeviceID, name) => {
    let options = {};
    switch (name) {
      case "Water Sensor":
        options = {
          current: 10000,
          Min: 100,
          Max: 10000,
          isOn: false,
          Unit:"Litres",
          name: name,
          supplementRequest:false,
          DeviceID: DeviceID,
          active: false,
        };
        break;
      case "Food Sensor":
        options = {
          current: 10000,
          Min: 100,
          Max: 10000,
          isOn: false,
          Unit:"KG",
          supplementRequest:false,
          name: name,
          DeviceID: DeviceID,
          active: false,
        };
        break;
      case "Weather Sensor":
        options = {
          current: 25,
          Min: 0,
          Max: 60,
          isOn: false,
          name: name,
          DeviceID: DeviceID,
          active: false,
        };
        break;
      case "GPS Sensor":
        options = {
          long: 51.32014642820132,
          lat: 25.257019556609464,
          isOn: false,
          name: name,
          Unit:"Long / Lat",
          DeviceID: DeviceID,
          active: false,
        };
        break;
          case "temperature Sensor":
        options = {
          current: 37,
          Min: 35,
          Max: 40,
          Unit:"Celsius",
          isOn: false,
          name: name,
          DeviceID: DeviceID,
          active: false,
        };
        break;
        case "BP Sensor":
          options = {
            current: 120,
            Min: 100,
            Max: 180,
            Unit:"mm HG",
            isOn: false,
            name: name,
            DeviceID: DeviceID,
            active: false,
          };
          break;
          case "Electricity Sensor":
            options = {
              current: 10000,
              Min: 100,
              Max: 10000,
              Unit:"KW",
              isOn: false,
              name: name,
              DeviceID: DeviceID,
              active: false,
            };
            break;
    }

    let doc = await db.collection(this.collection).add(options);
    return doc.id;
  };

  FetchSensors = (deviceId, setSensor) => {
    db.collection(this.collection)
      .where("DeviceID", "==", deviceId)
      .onSnapshot((snap) => {
        setSensor(snap.docs.map(this.reformat));
      });
  };



    UpdateSensors = async (Sensor, id) => {
    if (Sensor.current <= Sensor.Min) {

      await db
        .collection(this.collection)
        .doc(Sensor.id)
        .set(
          {
            isOn: true,
          },
          { merge: true }
        );
    } else {
      await db
        .collection(this.collection)
        .doc(Sensor.id)
        .set(
          {
            current: firebase.firestore.FieldValue.increment(
              Math.floor(
                Math.random() *
                  (-(Sensor.current / 100) * 10 -
                    -(Sensor.current / 100) * 2 +
                    1) +
                  -(Sensor.current / 100) * 2
              )
            ),
            isOn: false,
          },
          { merge: true }
        );
    }
  };

  UpdateSensorTypeTwo = async (Sensor, id) => {
    if (Sensor.current > Sensor.Max) {
      let Notification = new Notifications();
      let supplement = new Supplement()
      await db
        .collection(this.collection)
        .doc(Sensor.id)
        .set(
          {
            current: firebase.firestore.FieldValue.increment(
              Math.floor(
                Math.random() *
                  (-(Sensor.current / 100) * 10 -
                    -(Sensor.current / 100) * 5 +
                    -1) +
                  -(Sensor.current / 100) * 5
              )
            ),
            isOn: true,
          },
          { merge: true }
        );
      await Notification.createNotification("Alert",Sensor,id)
    } else {
      await db
        .collection(this.collection)
        .doc(Sensor.id)
        .set(
          {
            current: firebase.firestore.FieldValue.increment(
              Math.floor(
                Math.random() *
                  ((Sensor.current / 100) * 12 -
                    (Sensor.current / 100) * 2 +
                    1) +
                  (Sensor.current / 100) * 2
              )
            ),
            isOn: false,
          },
          { merge: true }
        );
    }
  };

  

  IncDecSensor = (Sensor, type) => {
    db.collection(this.collection)
      .doc(Sensor.id)
      .set(
        {
          current: firebase.firestore.FieldValue.increment(
            type == "increment" ? 1 : -1
          ),
          isOn: false,
        },
        { merge: true }
      );
  };

  updateSupplementNeed =async (sensorId) => {
    await db.collection(this.collection)
      .doc(sensorId)
      .set(
        {
          supplementRequest:true,
        },
        { merge: true }
      );
  };


   updateSensor =async (sensorId, value) => {
    await db.collection(this.collection)
      .doc(sensorId)
      .set( 
        {
          current:value,   
          supplementRequest:false,
        },
        { merge: true }
      );
  };


}

class Farms extends DB {
  constructor() {
    super("Farms");
  }
  createFarm = async (userId, location, farmName, supplierId,isActive) => {
    let doc = await db.collection(this.collection).add({
      user: userId,
      farmName: farmName,
      location: location,
      supplier: supplierId,
      subScriptionStatus: "unpayed",
      active: isActive,
    });
    return doc.id;
  };

  listenBySupplier = (set, supplierName) => {
    db.collection(this.collection)
      .where("supplier", "==", supplierName)
      .onSnapshot((snap) => set(snap.docs.map(this.reformat)));
  };

  listenUser = (set, setDropdown, userId) => {
    db.collection(this.collection)
      .where("user", "==", userId)
      .onSnapshot((snap) => {
        set(snap.docs.map(this.reformat).filter((item) => item.active == true));
        setDropdown(
          snap.docs
            .map(this.reformat)
            .filter((item) => item.active == true)
            .map((farm) => {
              return { Action: farm.farmName };
            })
        );
      });
  };

  listenUserForAdmin = (set, setDropdown, userId) => {
    db.collection(this.collection)
      .where("user", "==", userId)
      .onSnapshot((snap) => {
        set(snap.docs.map(this.reformat));
        setDropdown(
          snap.docs
            .map(this.reformat)
            .map((farm) => {
              return { Action: farm.farmName };
            })
        );
      });
  };

  listenFarms = (set, setDropdown, userId) => {
    db.collection(this.collection).onSnapshot((snap) => {
      set(snap.docs.map(this.reformat));
      setDropdown(
        snap.docs.map(this.reformat).map((farm) => {
          return { Action: farm.farmName };
        })
      );
    });
  };

  UpdateFarm = async (farmId) => {
    await db
      .collection(this.collection)
      .doc(farmId)
      .update({ active: true, subScriptionStatus: "payed" }, { merge: true });
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

  createAnimal = async ( FarmId , name , deviceId) => {
    let doc = await db.collection(this.collection).add({
      name: name,
      deviceID:deviceId,
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
        FarmId = await farm.createFarm(userId, location, farmName, supplierId,false);
        let WaterPumpdeviceId = await device.createDevice(FarmId, "Water Pump");
        let AnimalChipsetdeviceId = await device.createDevice(FarmId,"Animal Chipset");
        await sensor.createSensor(WaterPumpdeviceId, "Water Sensor");
        await sensor.createSensor(AnimalChipsetdeviceId, "Food Sensor");
        await sensor.createSensor(AnimalChipsetdeviceId, "BP Sensor");
        await animal.createAnimal(FarmId, "Cow",AnimalChipsetdeviceId);
        await animal.createAnimal(FarmId, "goat",AnimalChipsetdeviceId);
        await animal.createAnimal(FarmId, "chicken",AnimalChipsetdeviceId);
        total = 9999;
        break;
      }
      case 1: {
        FarmId = await farm.createFarm(userId, location, farmName, supplierId,false);
        let WaterPumpdeviceId = await device.createDevice(FarmId, "Water Pump");
        let FandeviceId = await device.createDevice(FarmId, "Fan");
        let AnimalChipsetdeviceId = await device.createDevice(FarmId,"Animal Chipset");
        await sensor.createSensor(WaterPumpdeviceId, "Water Sensor");
        await sensor.createSensor(FandeviceId, "Weather Sensor");
        await sensor.createSensor(AnimalChipsetdeviceId, "Food Sensor");
        await sensor.createSensor(AnimalChipsetdeviceId, "BP Sensor");
        await animal.createAnimal(FarmId, "Cow",AnimalChipsetdeviceId);
        await animal.createAnimal(FarmId, "goat",AnimalChipsetdeviceId);
        await animal.createAnimal(FarmId, "chicken",AnimalChipsetdeviceId);
        await animal.createAnimal(FarmId, "turkey",AnimalChipsetdeviceId);
        total = 29999;
        break;
      }
      case 2: {
        FarmId = await farm.createFarm(userId, location, farmName, supplierId,false);
        let WaterPumpdeviceId = await device.createDevice(FarmId, "Water Pump");
        let FandeviceId = await device.createDevice(FarmId, "Fan");
        let BackUpGeneratordeviceId = await device.createDevice(FarmId,"Backup Generator");
        let AnimalChipsetdeviceId = await device.createDevice(FarmId,"Animal Chipset");
        await sensor.createSensor(WaterPumpdeviceId, "Water Sensor");
        await sensor.createSensor(FandeviceId, "Weather Sensor");
        await sensor.createSensor(AnimalChipsetdeviceId, "Food Sensor");
        await sensor.createSensor(AnimalChipsetdeviceId, "BP Sensor");
        await sensor.createSensor(BackUpGeneratordeviceId,"Electricity Sensor");
        await animal.createAnimal(FarmId, "Cow", AnimalChipsetdeviceId);
        await animal.createAnimal(FarmId, "goat", AnimalChipsetdeviceId);
        await animal.createAnimal(FarmId, "chicken", AnimalChipsetdeviceId);
        await animal.createAnimal(FarmId, "turkey", AnimalChipsetdeviceId);
        await animal.createAnimal(FarmId, "horse", AnimalChipsetdeviceId);
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
    await db.collection(this.collection).add({
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


class Supplement extends DB {
  constructor() {
    super("Supplement");
  }

  updateSupplementRequest = async (supplementId) => {
    await db.collection(this.collection)
      .doc(supplementId)
      .set(
        {
          status: 'fulfilled'
        },
        { merge: true }
      );
  };

  listenByStatus = (set, status , company) =>
    db.collection(this.collection)
      .where("status", "==", status)
      .where("company", "==", company)
      .onSnapshot((snap) => set(snap.docs.map(this.reformat)));

  createSupplementRequest = async (sensorId,userId,company) => {
    await db.collection(this.collection).add({
      sensorId: sensorId,
      userId: userId,
      status:'unfulfilled',
      company:company,
      dateAndTime: new Date(),
    });
  };
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

class Notifications extends DB {

  constructor() {
    super("Notifications");
  }

  createNotification =  async (typeOfNotification,notificationDetails,userId) => 
      await db.collection(this.collection).add({
      typeOfNotification: typeOfNotification,
      notificationDetails: notificationDetails,
      userId: userId,
      dateAndTime: new Date(),
    });
  };


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
  Animals: new Animals(),
  notifications: new Notifications(),
  supplement: new Supplement(),
};
