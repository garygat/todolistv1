// #IMPORT MODULES + VAR DECS
// if (process.env.NODE_ENV !== 'production') {
//   require(`dotenv`).config();
// }
const date = require(__dirname + '/date.js');
const express = require('express');
const bodyParser = require('body-parser');
// const date = require(__dirname + '/date.js');
const path = require('path');
const mongoose = require(`mongoose`);
const methodOverride = require('method-override');

const dbURL = 'mongodb+srv://goryoandres:maclab7200@cluster0.7ntyih8.mongodb.net/?retryWrites=true&w=majority';
console.log(dbURL);
mongoose.connect('mongodb+srv://goryoandres:maclab7200@cluster0.7ntyih8.mongodb.net/todolistDB', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useUnifiedTopology: true,
  // // useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('Database connected');
});
const todoList = 'mongodb+srv://goryoandres:maclab7200@cluster0.7ntyih8.mongodb.net/todolistDB';
const Items = db.collection('items');

const port = process.env.PORT || 3000;
const app = express();
const title = 'To-Do List';
// const footerText = 'Group 2 IT209';
const footerText = ' 2022 JJ Burnek';

const dateToday = date.getDate();
// console.log(dateToday);
app.set('view engine', 'ejs');
//#DUNDIR PATH
app.use(express.static(path.join(__dirname, 'public')));
app.set(`views`, path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'images')));
app.set;
app.use(methodOverride(`_method`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// mongodb://localhost:27017/todolistDB
const itemsSchema = {
  name: String,
};

const Item = mongoose.model('Item', itemsSchema);
//# DEFAULT ITEMS 1
const item1 = new Item({
  name: 'Welcome to your todo list!',
});
const item2 = new Item({
  name: 'Click + to add new item.',
});
const item3 = new Item({
  name: 'Tick the checkbox to edit or delete item.',
});
const defaultItems = [item1, item2, item3];

//# DEFAULT ITEMS 2
// const item1 = new Item({
//   name: 'Mangigil mag-isa ',
// });
// const item2 = new Item({
//   name: 'Ibully si Aaron  ',
// });
// const item3 = new Item({
//   name: 'Kausapin ang sarili ',
// });
// const item4 = new Item({
//   name: 'Bolahin si Kalbo2 ',
// });
// const item5 = new Item({
//   name: 'Tibagin ang dalawang RPG',
// });
// const item6 = new Item({
//   name: 'Kumain ng Pulutan ',
// });
// const item7 = new Item({
//   name: 'Kumanta ng "One Day" ',
// });
// const item8 = new Item({
//   name: 'Kumain ulit ng Pulutan ',
// });
// const item9 = new Item({
//   name: 'Maghanap ng ibang i-bubully  ',
// });
// const item10 = new Item({
//   name: 'Saniban ng Konoha Shinobi',
// });
// const item11 = new Item({
//   name: 'Tibagin ang Calamares ',
// });
// const item12 = new Item({
//   name: 'Mag speed walk sa stairs ',
// });
// const defaultItems = [item1, item2, item3, item4, item5, item6, item7, item8, item9, item10, item11, item12];
//# GET

app.get('/', function (req, res) {
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Added Items to DB');
        }
      });
      res.redirect('/');
    } else {
      res.render('list', { listTitle: 'Today', newListItems: foundItems, footerText, title, dateToday });
    }
  });
});
//# POST
app.post('/', (req, res) => {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName,
  });
  item.save();
  res.redirect(`/`);

  app.post('/delete', (req, res) => {
    console.log(req.body);
  });
  // if (req.body.list === 'Work') {
  //   workItems.push(item);
  //   res.redirect('/work');
  // } else {
  //   items.push(item);
  //   res.redirect('/');
  // }
});
app.get(`/show/:id`, async (req, res) => {
  const name = 'Show';
  const { id } = req.params;
  console.log(id);
  // const checkedItemId = req.body.checkbox;
  const item = await Item.findById(id);
  console.log(item.name);
  console.log('tae', item.id);
  res.render(`show`, { name, title, id, item, footerText });
});
app.post('/delete/:id', (req, res) => {
  const { id } = req.params;
  const checkedItemId = id;
  console.log(checkedItemId);
  Item.findByIdAndRemove(checkedItemId, (err) => {
    if (!err) {
      console.log(`Deleted the item successfully!`);
    } else {
      console.log(err);
    }
    res.redirect('/');
  });
});
app.get(`/edit/:id/edit`, async (req, res) => {
  const name = 'Edit';
  const { id } = req.params;
  console.log(id);
  const item = await Item.findById(id);
  // console.log(item.name);
  // console.log('tae', item.id);
  res.render(`edit`, { title, name, id, item, footerText });
});
app.put(`/:id`, async (req, res) => {
  const { id } = req.params;
  const newCommentText = req.body.text;
  const item = Item.findByIdAndUpdate(id, { name: newCommentText }, { runValidators: true, new: true }, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      console.log('tae', docs);
    }
  });
  res.redirect(`/`);
});
app.put('/edit/:id/edit', async (req, res) => {
  try {
    await Item.findByIdAndUpdate(req.params.id, {
      name: req.body.text,
    });
    // Send response in here
    res.send('Item Updated!');
  } catch (err) {
    console.error(err.message);
    res.send(400).send('Server Error');
  }
});
app.post(`/delete`, async (req, res) => {
  // const { id } = req.params;
  try {
    const deleteMany = await Item.deleteMany({});
    await Item.deleteMany({});
    console.log('All Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  await res.redirect(`/`);
});
app.get('/work', (req, res) => {
  res.render('list', { listTitle: 'Work List', newListItems: workItems });
});

app.get('/about', (req, res) => {
  res.render('about');
});

//#LISTENER
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
