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
const dbURL = 'mongodb+srv://goryoandres:maclab7200@cluster0.7ntyih8.mongodb.net/?retryWrites=true&w=majority';
console.log(dbURL);
mongoose.connect(dbURL, { useNewUrlParser: true });
// mongodb://localhost:27017/todolistDB
const itemsSchema = {
  name: String,
};

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  name: 'Welcome to your todo list!',
});
const item2 = new Item({
  name: 'Click + to add new item.',
});
const item3 = new Item({
  name: 'Tick the checkbox to edit or delete item.',
});

//# GET
const defaultItems = [item1, item2, item3];
app.get('/te', function (req, res) {
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
app.get('/', (req, res) => {
  const name = 'Cats';
  const cats = [
    'Vhagar',
    'Melys',
    'Caraxes',
    'Arrax',
    'Sunfyre',
    'Meraxes',
    'Dreamfyre',
    'Seasmoke',
    'Syrax',
    'Vermax',
    'Vermithor',
  ];
  res.render('cats', { cats, name, title, footerText });
});
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
  console.log(item.name);
  console.log('tae', item.id);
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
