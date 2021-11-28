const faker = require("faker");
const db = require("../config/firebase");

const generateFakeFridge = async (req, res) => {
  try {
    const users = [];
    let usersCollection = await db.collection("users").get();
    let no_records = req.params.no_records;

    usersCollection.docs.map((item) => {
      users.push(item.id);
    });

    for (let i = 0; i < no_records; i++) {
      let fridgeName = faker.lorem.word();
      let creationDate = faker.date.recent();
      let userId = faker.random.arrayElement(users);

      const fakeFridge = {
        fridgeName: fridgeName,
        creationDate: creationDate,
        userId: userId,
      };

      await db.collection("fridges").add(fakeFridge);
    }
    res.status(201).json({
      message: "Fridges added",
    });
  } catch (e) {
    res.status(500).json({
      message: `Server error: ${e}`,
    });
  }
};

const createFridge = async (req, res) => {
  try {
    const userId = req.params.userId;
    let fridgeData = { ...req.body };
    fridgeData.userId = userId;
    await db.collection("fridges").add(fridgeData);
    res.status(201).json({
      message: "Fridge created! Enjoy!",
    });
  } catch (e) {
    res.status(500).json({
      message: `Something went wrong!`,
    });
  }
};

const updateFridge = async (req, res) => {
  try {
    const fridgeId = req.params.fridgeId;
    let fridge = { ...req.body };
    await db.collection("fridges").doc(fridgeId).update(fridge);
    res.status(202).json({ message: "Fridge updated!" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const deleteFridge = async (req, res) => {
  try {
    const fridgeId = req.params.fridgeId;
    await db.collection("fridges").doc(fridgeId).delete();
    res.status(202).json({ message: "Fridge deleted!" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getFridgeOfUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    let fridges = [];
    await db
      .collection("fridges")
      .where("userId", "==", userId)
      .get()
      .then((querySnapshot) => {
        let fridge;
        querySnapshot.forEach((doc) => {
          fridge = doc.data();
          fridge.id = doc.id;
          fridges.push(fridge);
        });
      });

    for (let i = 0; i < fridges.length; i++) {
      let items = [];
      let itemCollection = await db
        .collection("items")
        .where("fridgeId", "==", fridges[i].id)
        .get()
        .then((querySnapshot) => {
          let item;
          querySnapshot.forEach((doc) => {
            item = doc.data();
            item.id = doc.id;
            items.push(item);
          });
        });
      fridges[i].items = items;
    }
    res.status(200).json({
      message: "Success!",
      fridges: fridges,
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

module.exports = { generateFakeFridge, createFridge, updateFridge, deleteFridge, getFridgeOfUser };
