const express = require('express');
const app = express();
const port = 3000;
const direccion = require('path')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', direccion.join(__dirname, 'views'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'ejs')

app.use(express.static(direccion.join(__dirname, 'public')))

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
})

app.get('/', (req, res) => {
    res.render("product-sell.html")
})

app.get('/about-us', (req, res) => {
    res.render("about-us.html")
})
app.get('/battle-pokemon', (req, res) => {
    res.render("battle-pokemon.html")
})
app.get('/change-password', (req, res) => {
    res.render("change-password.html")
})
app.get('/create-teams', (req, res) => {
    res.render("create-teams.html")
})
app.get('/edit-teams', (req, res) => {
    res.render("edit-teams.html")
})

app.get('/friends-profile', (req, res) => {
    res.render("friends-profile.html")
})
app.get('/history-matches', (req, res) => {
    res.render("history-matches.html")
})
app.get('/list-teams', (req, res) => {
    res.render("list-teams.html")
})
app.get('/login', (req, res) => {
    res.render("login.html")
})
app.get('/ranking', (req, res) => {
    res.render("ranking.html")
})
app.get('/recover-password', (req, res) => {
    res.render("recover-password.html")
})

app.get('/regist-friends', (req, res) => {
    res.render("regist-friends.html")
})
app.get('/regist-user', (req, res) => {
    res.render("regist-user.html")
})
app.get('/search-friends', (req, res) => {
    res.render("search-friends.html")
})
app.get('/settings', (req, res) => {
    res.render("settings.html")
})
app.get('/user-profile', (req, res) => {
    res.render("user-profile.html")
})

//validacion about-us
app.post('/aboutEmail', (req, res) => {
    console.log(req.body.email);
})



//validaciones regist-user

app.post('/submitUser', (req, res) => {
    console.log(req.body.name);
    console.log(req.body.lastone);
    console.log(req.body.lasttwo);
    console.log(req.body.nameUser);
    console.log(req.body.email);
    console.log(req.body.id);
})

//VALIDACION-DE-BACKEND-BUSCAR-AMIGOS
app.post('/searchFriend', (req, res) => {
    console.log(req.body.addName);
    res.redirect('/search-friends')
});

//VALIDACIÓN-DE-BACKEND-REGISTRO-DE-AMIGOS/// JS PARA CLIENTE FUNCIONANDO :D

app.post('/registFriend', (req, res) => {
    console.log(req.body.addRegistFriend);
    console.log(req.body.addRegistFriendTwo);

});


/*Validacion_backend-change-password*/
app.post('/BoxPassword', (req, res) => {
    console.log(req.body.addPassword);

});

//BACKEND LOGIN
app.post('/addLogin', (req, res) => {
    console.log(req.body.addUser);

});

//BACKEND RECOVER PASSWORD
app.post('/addRecover', (req, res) => {
    console.log(req.body.addCorreo);

});

//Backend Settings
app.post('/pokemonRestrictionsBan', (req, res) => {
    console.log(req.body.pokemonData);

});

//Backend Settings

app.post('/pokemonRestrictionsAllow', (req, res) => {
    console.log(req.body.pokemonData);

});

//Backend Create-teams
app.post('/create-teams', (req, res) => {
    console.log(req.body.teamName);

})