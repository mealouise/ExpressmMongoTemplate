const hbs = require('express-handlebars'); //
const path = require('path'); //
const express = require('express'); //
const bodyParser = require('body-parser'); //
const mongoose = require('mongoose'); //
const UserSchema = require('./models/users');

const getUsers = require('./lib/getUsers');

require('dotenv').config(); //
const app = express(); //

mongoose.connect(`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@usersignup-6yj6w.mongodb.net/userdb?retryWrites=true&w=majority`, { //
    useNewUrlParser: true,
    useUnifiedTopolgy: true
});

const user = new UserSchema({
    email: 'name@mail.com',
    password: "password"
});

UserSchema.find({}, (err,docs) => {
    console.log(docs);
})


app.use(express.static(path.join(__dirname, 'public'))); //
app.use(bodyParser.urlencoded({extended: false})); //
app.use(bodyParser.json()); //

app.engine('.hbs', hbs ({ //
    defaultLayout: 'layout',
    extname: '.hbs'
}));

app.set('view engine', '.hbs'); //

app.get('/', (req,res) => { //
    res.render('index');
});

app.get('/login', (req,res) => {
    res.render('login');
});

app.get('/signup', (req,res) => {
    res.render('signup');
})

app.post('/login', async(req,res) => {
    let email = req.body.email;
    let password = req.body.password;

    
   
    // if (docs.length > 0) {
    //     res.render('index',{err: "a user with this email already exists"} )
    //     return; // might need to render the sign up page
    // }
    
    // if (docs1.length > 0) {
    //     res.render('index', {err: 'this username already exists'} )
    //     return;
    // }
    // console.log(docs);

    // const user = new UserSchema({
    //     email: email,
    //     password: password
    // });
    // user.save();

    res.render('index');
});

app.post('/signup', async(req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    
    let docs = await getUsers.email(email);
    let docs1 = await getUsers.username(username);
    if (docs.length > 0) {
        res.render('signup',{err: "a user with this email already exists"} )
        return; // might need to render the sign up page
    }

    if (docs1.length > 0) {
        res.render('signup',{err: "this username already exists"} )
        return; // might need to render the sign up page
    }
    const user = new UserSchema({
        name: username,
        email: email,
        password: password
    });
    user.save();

    res.render('index')
})


app.listen(3000, () => { //
    console.log('server is listening on port 3000');
});