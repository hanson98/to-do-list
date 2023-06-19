import mongoose from "mongoose";

let Item;

let route = "";

export function currentRoute(currentRoute) {
  route = currentRoute;
}

export async function connectToDatabase() {
  const db = "to_do_list";
  const uri =
    "mongodb+srv://hanson98:YvAQ9eWjvxSF6Dx3@cluster0.jezfnwr.mongodb.net/" +
    db;
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Successfully connected to MongoDB.");
      if (route === "/") {
        createItemModel();
      } else {
        createCustomListModel();
      }
    }
  } catch (e) {
    console.log("Error caught while connecting to MongoDB: " + e);
  }
}

export async function disconnectFromDatabase() {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (e) {
    console.log("Error caught while disconnecting from MongoDB: " + e);
  }
}

export async function getData() {
  try {
    if (!Item) {
      createItemModel();
    }
    const allItems = await Item.find().exec();
    return allItems;
  } catch (e) {
    console.log("Error caught while retrieving data: " + e);
  }
}

function createItemModel() {
  const itemSchema = new mongoose.Schema({
    item: String,
  });

  Item = mongoose.models.Item || mongoose.model("Item", itemSchema);
}

export { Item };

export async function addItem(item) {
  const newItem = new Item({
    item: item,
  });

  return newItem.save();
}

export async function deleteItem(itemId) {
  await Item.findByIdAndRemove(itemId);
}

// For customList
let List;

function createCustomListModel() {
  const listSchema = new mongoose.Schema({
    name: String,
    item: String,
  });

  List = mongoose.models.List || mongoose.model("List", listSchema);
}
export { List };

export async function getListData(routeName) {
  try {
    if (!List) {
      createCustomListModel();
    }
    const ListItems = await List.find({ name: routeName }).exec();
    return ListItems;
  } catch (e) {
    console.log("Error caught while retrieving data: " + e);
  }
}

export async function addListItem(name, item) {
  const newListItem = new List({
    name: name,
    item: item,
  });

  return newListItem.save();
}

export async function deleteListItem(itemId) {
  await List.findByIdAndRemove(itemId);
}
