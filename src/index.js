const express = require('express');
const axios = require('axios');
const app = express();
const session = require('express-session');
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
const port = 3000;
const direccion = require('path')
const bodyParser = require('body-parser')
const team = require('../models/team.js')

app.use('/public', express.static('src/public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', direccion.join(__dirname, 'views'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'ejs')

app.use(express.static(direccion.join(__dirname, 'public')))

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
})
const user = require('../models/user.js')

app.get('/', (req, res) => {
    res.render("product-sell.html")
})

app.get('/about-us', (req, res) => {
    res.render("about-us.html")
})
app.get('/battle-pokemon', async (req, res) => {
    const users = require('../models/user.js');
    const login = require('../models/login.js');
    try {
        // Fetch the list of logged-in user names
        const loggedInUsers = await login.find({}).exec();
        if (!loggedInUsers.length) {
            return res.status(404).send('No users are currently logged in');
        }

        const loggedInUserName = loggedInUsers[0].nameUser; // Assuming there's only one logged-in user

        // Fetch the user document for the logged-in user
        const loggedInUser = await users.findOne({ nameUser: loggedInUserName }).exec();
        if (!loggedInUser) {
            return res.status(404).send('Logged-in user not found');
        }

        // Fetch a user who is not logged in
        const userNotLoggedIn = await users.findOne({
            nameUser: { $nin: loggedInUserName } // User whose name is not in the list of logged-in user names
        }).exec();
        if (!userNotLoggedIn) {
            return res.status(404).send('No available users found');
        }
        const userTeams = await team.find({ createdBy: req.session.nameUser }).sort({ _id: -1 });

        if (!userTeams || userTeams.length === 0) {
            return res.status(404).send('No tiene equipo, favor vuelva a la página anterior');
        }

        const pokemonPromises = userTeams.map(userTeam => {
            const pokemonNames = [
                userTeam.pokemonOne,
                userTeam.pokemonTwo,
                userTeam.pokemonThree,
                userTeam.pokemonFour,
                userTeam.pokemonFive,
                userTeam.pokemonSix
            ];

            return Promise.all(pokemonNames.map(name =>
                axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`).catch(err => null)
            ));
        });

        const pokemonResponses = await Promise.all(pokemonPromises);
        const userPokemons = userTeams.map((userTeam, index) => ({
            team: userTeam,
            pokemons: pokemonResponses[index].map(response => response ? response.data : null)
        }));

        // Serialize userPokemons to be safely passed to the EJS template
        const userPokemonsSerialized = JSON.stringify(userPokemons.map(up => ({
            ...up,
            pokemons: up.pokemons.filter(pokemon => pokemon !== null).map(pokemon => ({
                name: pokemon.name,
                url: `https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`
            }))
        })));

        res.render("battle-pokemon.ejs", {
            loggedIn: true,
            nameFriend: userNotLoggedIn.nameUser,
            imagePathFriend: `/public/img/${userNotLoggedIn.userImg}`,
            nameUser: loggedInUserName,
            imagePathUser: `/public/img/${loggedInUser.userImg}`,
            userPokemons: userPokemonsSerialized
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/change-password', (req, res) => {
    res.render("change-password.html")
})
app.get('/create-teams', async (req, res) => {
    res.render('create-teams.html');  // Adjust to match your view/template name


})
app.get('/edit-teams', (req, res) => {
    res.render("edit-teams.html")
})

app.get('/friends-profile', async (req, res) => {
    const users = require('../models/user.js');
    const login = require('../models/login.js');
    try {
        // Fetch the list of logged-in user names
        const loggedInUsers = await login.find({}).exec();
        const loggedInUserNames = loggedInUsers.map(user => user.nameUser);

        // Debug the logged-in user names
        console.log('Logged in user names:', loggedInUserNames);

        // Find a user who is not logged in
        const userNotLoggedIn = await users.findOne({
            nameUser: { $nin: loggedInUserNames } // User whose name is not in the list of logged-in user names
        }).exec();

        // Debug the user found
        console.log('User not logged in:', userNotLoggedIn);

        if (!userNotLoggedIn) {
            return res.status(404).send('No available users found');
        }

        // Render the user profile page and pass the user's name and image path to the EJS file
        res.render('friends-profile.ejs', {
            loggedIn: true,
            nameUser: userNotLoggedIn.nameUser,
            imagePath: `/public/img/${userNotLoggedIn.userImg}`

        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})
app.get('/history-matches', (req, res) => {
    res.render("history-matches.html")
})
app.get('/list-teams', async (req, res) => {
    if (!req.session.nameUser) {
        return res.status(401).send('Unauthorized: No user logged in');
    }

    try {
        const userTeams = await team.find({ createdBy: req.session.nameUser }).sort({ _id: -1 });

        if (!userTeams || userTeams.length === 0) {
            return res.status(404).send('No tiene equipo, favor vuelva a la página anterior');
        }
        //TODO: Daniela y Melina tomar en cuenta este codigo
        const pokemonPromises = userTeams.map(userTeam => {
            const pokemonNames = [
                userTeam.pokemonOne,
                userTeam.pokemonTwo,
                userTeam.pokemonThree,
                userTeam.pokemonFour,
                userTeam.pokemonFive,
                userTeam.pokemonSix
            ];

            return Promise.all(pokemonNames.map(name =>
                axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`).catch(err => null)
            ));
        });

        const pokemonResponses = await Promise.all(pokemonPromises);
        const teamsWithPokemons = userTeams.map((userTeam, index) => ({
            team: userTeam,
            pokemons: pokemonResponses[index].map(response => response ? response.data : null)
        }));

        res.render('list-teams.ejs', {
            nameUser: req.session.nameUser,
            teamsWithPokemons
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
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
app.get('/user-profile', async (req, res) => {
    const users = require('../models/user.js')
    const login = require('../models/login.js');
    try {
        // Retrieve the logged-in user's name from the session
        const loggedInUserName = req.session.nameUser;

        if (!loggedInUserName) {
            return res.status(401).send('Unauthorized: No user logged in');
        }

        // Fetch the logged-in user's data from the login model
        const loginUser = await login.findOne({ nameUser: loggedInUserName });

        if (!loginUser) {
            return res.status(404).send('Login record not found');
        }

        // Use the information from the login model to fetch additional user details from the users model
        const user = await users.findOne({ nameUser: loginUser.nameUser });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Render the user profile page and pass the user's name and image path to the EJS file
        res.render('user-profile.ejs', { loggedIn: true, nameUser: user.nameUser, imagePath: `/public/img/${user.userImg}` });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    //TODO: meter imagen del backend y pokemones
})

//validacion about-us
app.post('/aboutEmail', (req, res) => {
    console.log(req.body.email);
})

//validaciones regist-user

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
                        await login.deleteMany({})
                        data.save()
                            .then(() => {
                                console.log("Usuario y contraseña guardado");
                                req.session.nameUser = registrado.nameUser;
                                console.log(req.session);
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
/*
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/img'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
    }
});
const upload = multer({ storage: storage });

app.post('/changeImg', upload.single('userImg'), async (req, res) => {
    if (!req.session.nameUser) {
        return res.status(401).send('Unauthorized: No user logged in');
    }
    console.log("entradio");
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        // Replace 'src/public/' with '/public/' to create the correct URL path
        const filePath = req.file.path.replace('src/public/', '/public/');

        // Update the user document in the 'User' collection
        const updateResult = await user.updateOne(
            { nameUser: req.session.nameUser },
            { $set: { userImg: filePath } }
        );

        // Check if the update was successful
        if (updateResult.matchedCount === 0) {
            return res.status(404).send('User not found');
        }

        // Redirect to the user profile page
        res.redirect('/user-profile');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

*/


app.post('/create-teams', (req, res) => {
    let data = new team({
        pokemonOne: req.body.pokemonOne,
        pokemonTwo: req.body.pokemonTwo,
        pokemonThree: req.body.pokemonThree,
        pokemonFour: req.body.pokemonFour,
        pokemonFive: req.body.pokemonFive,
        pokemonSix: req.body.pokemonSix,
        teamName: req.body.teamName,
        createdBy: req.session.nameUser
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
//Edit-Teams

app.post('/updateTeam', async (req, res) => {

    const { teamName, actualPokemon, newPokemon } = req.body;

    try {
        const teamDoc = await team.findOne({ teamName: teamName });

        if (!teamDoc) {
            return res.status(404).send('Team not found');
        }

        // Check if the new Pokémon is already in the team
        const pokemonFields = ['pokemonOne', 'pokemonTwo', 'pokemonThree', 'pokemonFour', 'pokemonFive', 'pokemonSix'];
        const pokemonInTeam = pokemonFields.some(field => teamDoc[field] === newPokemon);

        if (pokemonInTeam) {
            return res.status(400).send('El Pokemon ya se encuentra en el equipo');
        }

        // Find the current Pokémon and update it to the new Pokémon
        let updated = false;

        for (let field of pokemonFields) {
            if (teamDoc[field] === actualPokemon) {
                teamDoc[field] = newPokemon;
                updated = true;
                break;
            }
        }

        if (!updated) {
            return res.status(404).send('Current Pokémon not found in the team');
        }

        await teamDoc.save();
        res.redirect('/list-teams'); // Redirect to the list teams page after update
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})