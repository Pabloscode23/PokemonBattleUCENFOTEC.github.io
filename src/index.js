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
const user = require('../models/user.js')
app.post('/submitUser', (req, res) => {

    let data = new user({
        userImg: req.body.userImg,
        name: req.body.name,
        lastName: req.body.lastone,
        secondLastName: req.body.lasttwo,
        nameUser: req.body.nameUser,
        email: req.body.email,
        id: req.body.id,
        userPassword: req.body.nameUser,
    })
    data.save()
        .then((data) => {
            console.log("Usuario guardado");
        })
        .catch((err) => {
            console.log("Error " + err);
        })
    //    res.redirect('/login')
})


//VALIDACIÓN-DE-BACKEND-REGISTRO-DE-AMIGOS
const friends = require('../models/friends.js')
app.post('/registFriend', (req, res) => {

    let data = new friends({
        nameFriend: req.body.addRegistFriend,
        email: req.body.addRegistFriendTwo,
    })
    data.save()
        .then((data) => {
            console.log("Amigo Registrado");
        })
        .catch((err) => {
            console.log("Error " + err);
        })
});
//VALIDACION-DE-BACKEND-BUSCAR-AMIGOS
app.post('/searchFriend', (req, res) => {

    let data = {
        nameFriend: req.body.addName,
        email: req.body.addName,
    }

    const buscarAmigo = async () => {

        const user = await friends.findOne({ nameFriend: data.nameFriend })
        const email = await friends.findOne({ email: data.email })
        if (user != null) {
            if (user.addName == data.addName) {
                console.log(user)
                res.redirect('/search-friends')
            }
        }
        else if (email != null) {
            if (email.addName == data.addName) {
                console.log(email)
                res.redirect('/search-friends')
            } else {
                console.log("primer else email")
                res.redirect('/search-friends')
            }

        } else {
            console.log("No registrado")
            res.redirect('/regist-friends')
        }
    }
    buscarAmigo();
})


/*Validacion_backend-change-password*/
const password = require('../models/passwordLists.js');
app.post('/BoxPassword', (req, res) => {

    let data = new password({
        userPassword: req.body.addPassword,
        newPassword: req.body.addPasswordNew,
        confirmPassword: req.body.addPasswordConfirm,

    })
    const changePassword = async () => {
        //TODO: modificar la de registro-login en la base de datos
        const passwordLogin = await login.findOne({ userPassword: data.userPassword })
        if (passwordLogin != null) {
            if (passwordLogin.userPassword == data.userPassword) {
                if (data.newPassword == data.confirmPassword) {
                    data.save()
                        .then((data) => {
                            console.log("Contraseña guardada");
                        })
                        .catch((err) => {
                            console.log("Error " + err);
                        })

                    res.redirect('/user-profile')
                } else {
                    console.log("Contraseña no coinciden");
                    res.redirect('/change-password')

                }
            } else {
                console.log("Contraseña no es de login");
                res.redirect('/change-password')
            }
        } else {
            console.log("Contraseña no encontrada");
            res.redirect('/change-password')
        }
    }
    changePassword();
});

//BACKEND LOGIN
const login = require('..//models/friends.js');
app.post('/addLogin', (req, res) => {
    let data = new login({
        nameUser: req.body.addUser,
        userPassword: req.body.userPassword,
    })
    const buscarUsuario = async () => {
        const registrado = await user.findOne({ nameUser: data.nameUser })
        const password = await user.findOne({ userPassword: data.userPassword })
        if (registrado != null) {
            if (registrado.nameUser == data.nameUser) {
                if (password.userPassword == data.userPassword) {
                    data.save()
                        .then((data) => {
                            console.log("Usuario y contraseña guardado");
                        })
                        .catch((err) => {
                            console.log("Error " + err);
                        })
                    res.redirect('/user-profile')
                } else {
                    console.log("Contraseña no coinciden");
                    res.redirect('/login')
                }
            } else {
                console.log("nombre diferente");
                res.redirect('/login')
            }
        } else {
            console.log("nombre diferente dos");

            res.redirect('/login')
        }
    }
    buscarUsuario();
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
const team = require('../models/teamsName.js')
app.post('/create-teams', (req, res) => {
    let data = new team({
        teamName: req.body.teamName
    })
    data.save()
        .then((data) => {
            console.log("Nombre de equipo guardado");
        })
        .catch((err) => {
            console.log("Error " + err);
        })
    res.redirect('/list-teams')
})