const faker = require("faker");
const db = require("../config/firebase");

const generateFakeItems = async (req, res) => {
  try {
    const users = [];
    const fridges = [];
    let usersCollection = await db.collection("users").get();
    let fridgesCollections = await db.collection("fridges").get();

    let no_records = req.params.no_records;

    usersCollection.docs.map((item) => {
      users.push(item.id);
    });
    fridgesCollections.docs.map((item) => {
      fridges.push(item.id);
    });

    for (let i = 0; i < no_records; i++) {
      let itemName = faker.commerce.productName();
      let itemQuantity = faker.datatype.number(5);
      let itemPrice = itemQuantity * faker.commerce.price(1, 100, 2) + " RON";
      let buyDate = faker.date.recent();
      let expirationDate = faker.date.future();
      let itemDescription = faker.lorem.sentence(4);

      let userId = faker.random.arrayElement(users);
      let fridgeId = faker.random.arrayElement(fridges);

      const fakeItem = {
        itemName: itemName,
        itemQuantity: itemQuantity,
        itemPrice: itemPrice,
        buyDate: buyDate,
        expirationDate: expirationDate,
        itemDescription: itemDescription,
        userId: userId,
        fridgeId: fridgeId,
      };
      await db.collection("items").add(fakeItem);
    }
    res.status(201).json({
      message: "Items added!",
    });
  } catch (e) {
    res.status(500).json({
      message: `Server error: ${e}`,
    });
  }
};

const addItem = async (req, res) => {
  try {
    const fridgeId = req.params.fridgeId;
    const userId = req.params.userId;
    let item = { ...req.body };
    item.fridgeId = fridgeId;
    item.userId = userId;
    await db.collection("items").add(item);
    res.status(201).json({
      message: "Item added!",
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

const updateItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    let item = { ...req.body };
    await db.collection("items").doc(itemId).update(item);
    res.status(202).json({
      message: "Item updated!",
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    await db.collection("items").doc(itemId).delete();
    res.status(202).json({
      message: "Item deleted!",
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

module.exports = { generateFakeItems, deleteItem, updateItem, addItem };
