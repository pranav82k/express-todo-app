const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Item = require('./models/items.js'); // Importing model

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

// Mongodb connectivity
mongoose.connect(process.env.mongodb).then(() => {
    app.listen(port);
    console.log(`mongodb Connected and listening on port ${port}`);
}).catch((err) => console.log(err));

// Use the middleware to accept the form data
app.use(express.urlencoded({ extended: true }));

// Set the view engine from HTML to ejs
app.set('view engine', 'ejs');

// Testing Routes Start
    app.get('/create-item', (req, res) => {
        // const item = new Item({
        //     name: 'Computer',
        //     price: 12000
        // });
        const item = Item({
            name: 'Computer',
            price: 12000
        });
        item.save().then(result => res.send(result)).catch(err => console.log(err));
    });

    app.get('/get-item', (req, res) => {
        Item.findById('62b2d95a2d16151f6c9bf86a').then(result => res.send(result)).catch(err => console.log(err));
    })

    // app.get('/', (req, res) => {
    //     const items = [
    //         { name: 'A', 'price': 300},
    //         { name: 'B', 'price': 400},
    //         { name: 'C', 'price': 500}
    //     ]
    //     res.render('index', {items});
    //     // res.sendFile('./views/index.html', {root: __dirname});
    //     // res.send("<h1>Home Page</h1>");
    // });

// Testing Routes End
app.get('/', (req, res) => {
    res.redirect('/get-items');
});
    
app.get('/get-items', (req, res) => {
    Item.find().then(result => {
        res.render('index', {items: result, title: 'Item Listing Page'});
    }).catch(err => console.log(err));
})

app.get('/add-item', (req, res) => {
    res.render('add-item', { title: 'Add Item Page' });
    // res.sendFile('./views/add-item.html', {root: __dirname});
    // res.send("<h1>Add Item</h1>");
});

app.post('/items', (req, res) => {
    // console.log(req.body);
    const item = Item(req.body);
    item.save().then((result) => {
        res.redirect('/get-items')
    }).catch((err) => console.log(err));
});

// app.get('/items/:id', (req, res) => {
//     const id = req.params.id;
//     Item.findById(id).then((result) => {
//         res.render('item-detail', { item: result, title: 'Item Detail Page' });
//     }).catch(err => console.log(err));
// });

app.get('/items/:id', async (req, res) => {
    const id = req.params.id;
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid) {
        return res.render('error');
    }
    
    try {
        const item = await Item.findById(id);
        if(item) {
            res.render('item-detail', { item: item, title: 'Item Detail Page' });
        } else {
            res.render('error');
        }
    } catch (error) {
        console.log(error);
    }
});

app.delete('/items/:id', (req, res) => {
    const id = req.params.id;
    Item.findByIdAndDelete(id).then((result) => {
        res.json({ redirect: '/get-items' });
    }).catch((err) => console.log(err));
})

app.put('/items/:id', (req, res) => {
    // console.log(req.body);
    const id = req.params.id;
    Item.findByIdAndUpdate(id, req.body).then(result => { 
        res.json({msg: 'Updated Successfully'}) 
    }).catch(err => console.log(err));
})

app.use((req, res) => {
    res.render('error');
    // res.sendFile('./views/error.html', {root: __dirname});
});