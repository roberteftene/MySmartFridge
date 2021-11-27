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

module.exports = { generateFakeFridge };
