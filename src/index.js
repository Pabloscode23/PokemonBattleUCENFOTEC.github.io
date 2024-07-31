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
    const login = require('..//models/login.js');
    const userList = async () => {
        //TODO: validar que sea el usuario loggeado
        const nameUser = await login.findOne();
        res.render('user-profile.html', { loggedIn: true, nameUser: nameUser })
    }
    userList()
    //TODO: meter imagen del backend y pokemones
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
app.post('/BoxPassword', (req, res) => {

    let data = {
        userPassword: req.body.addPassword,
        newPassword: req.body.addPasswordNew,
        confirmPassword: req.body.addPasswordConfirm
    };

    const changePassword = async () => {
        try {
            const passwordLogin = await login.findOne({ userPassword: data.userPassword });

            if (passwordLogin) {
                if (data.newPassword === data.confirmPassword) {
                    // Update the userPassword with the newPassword
                    await user.updateOne({ userPassword: data.userPassword }, { $set: { userPassword: data.newPassword } });

                    console.log("Password updated successfully");
                    res.redirect('/login');
                } else {
                    console.log("New password and confirmation password do not match");
                    res.redirect('/change-password');
                }
            } else {
                console.log("Current password not found");
                res.redirect('/change-password');
            }
        } catch (err) {
            console.log("Error " + err);
            res.redirect('/change-password');
        }
    };

    changePassword();
});

//BACKEND LOGIN
const login = require('..//models/login.js');
app.post('/addLogin', (req, res) => {
    let data = new login({
        nameUser: req.body.addUser,
        userPassword: req.body.userPassword,
    })
    const buscarUsuario = async () => {

        try {
            const registrado = await user.findOne({ nameUser: data.nameUser });

            if (registrado) {
                if (registrado.nameUser === data.nameUser) {
                    if (registrado.userPassword === data.userPassword) {
                        // Save the new data if the user and password match
                        await login.deleteOne({ nameUser: data.nameUser });
                        data.save()
                            .then(() => {
                                console.log("Usuario y contraseña guardado");
                                res.redirect('/user-profile');
                            })
                            .catch((err) => {
                                console.log("Error " + err);
                                res.redirect('/login');
                            });
                    } else {
                        console.log("Contraseña no coincide");
                        res.redirect('/login');
                    }
                } else {
                    console.log("Nombre diferente");
                    res.redirect('/login');
                }
            } else {
                console.log("Usuario no encontrado");
                res.redirect('/login');
            }
        } catch (err) {
            console.log("Error " + err);
            res.redirect('/login');
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
//Agregar la informacion de los pokemones para guardar
//Backend Create-teams
const team = require('../models/team.js')
app.post('/create-teams', (req, res) => {
    let data = new team({
        pokemonOne: req.body.pokemonOne,
        pokemonTwo: req.body.pokemonTwo,
        pokemonThree: req.body.pokemonThree,
        pokemonFour: req.body.pokemonFour,
        pokemonFive: req.body.pokemonFive,
        pokemonSix: req.body.pokemonSix,
        teamName: req.body.teamName
    })
    data.save()
        .then((data) => {
            console.log("Equipo guardado");
        })
        .catch((err) => {
            console.log("Error " + err);
        })
    res.redirect('/list-teams')
})