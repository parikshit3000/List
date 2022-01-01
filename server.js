const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistdb", {
  useNewUrlParser: true,
});

const itemsSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to",
});
const item2 = new Item({
  name: "To-Do List",
});
const item3 = new Item({
  name: "Enter your work here",
});
const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  var day = today.toLocaleDateString("en-US", options);

  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) console.log(err);
        console.log("Successfully Saved");
      });
      res.redirect("/");
    } else {
      if (err) console.log(err);
      //   console.log(foundItems);

      res.render("list", { kindOfDay: day, newListItems: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item4 = new Item({
    name: itemName,
  });
  item4.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  // console.log(req.body.checkbox);
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (!err) console.log("Successfully Removed");
  });
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
