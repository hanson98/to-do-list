import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { getDate } from "./date.js";
import * as db from "./db.js";
import _ from "lodash";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.port || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  db.currentRoute(req.url);
  let day = getDate();
  await db.connectToDatabase();
  try {
    let items = await db.getData();
    res.render("list", { listTitle: `Today is ${day}`, newListItems: items });
  } catch (e) {
    console.log("Error caught: " + e);
    res.send("An error occurred while retrieving data.");
  } finally {
    await db.disconnectFromDatabase();
  }
});

app.get("/favicon.ico", (req, res) => {
  res.sendStatus(204); 
});

app.get("/:listName", async (req, res) => {
  const routeName = _.startCase(req.params.listName);
  db.currentRoute(routeName);
  console.log(routeName);
  await db.connectToDatabase();
  try {
    let listItems = await db.getListData(routeName);
    res.render("list", { listTitle: routeName, newListItems: listItems });
  } catch (e) {
    console.log("Error caught: " + e);
    res.send("An error occurred while retrieving data.");
  } finally {
    await db.disconnectFromDatabase();
  }
});

app.post("/", async (req, res) => {
  let day = getDate();
  const item = req.body.newItem;
  const listName = req.body.list;

  if (listName === `Today is ${day}`) {
    await db.connectToDatabase();
    await db.addItem(item);
    res.redirect("/");
  } else {
    await db.connectToDatabase();
    await db.addListItem(listName, item);
    res.redirect("/" + listName);
  }
});

app.post("/delete", async (req, res) => {
  let day = getDate();
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === `Today is ${day}`) {
    await db.connectToDatabase();
    await db.deleteItem(checkedItemId);
    res.redirect("/");
  } else {
    await db.connectToDatabase();
    await db.deleteListItem(checkedItemId);
    res.redirect("/" + listName);
  }
});

app.listen(port, () => {
  console.log("Server has been running on port 3000");
});
