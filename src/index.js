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

app.get('/product-sell', (req, res) => {
    res.render("product-sell.html")
})


app.get('/', (req, res) => {
    res.render("about-us.html")
})
app.get('/battle-pokemon/:friendName', async (req, res) => {
    try {
        // Retrieve logged-in user
        const loggedInUsers = await login.find({}).exec();
        if (!loggedInUsers.length) {
            return res.status(404).send('No users are currently logged in');
        }
        const loggedInUserName = loggedInUsers[0].nameUser;

        // Retrieve logged-in user data
        const loggedInUser = await user.findOne({ nameUser: loggedInUserName }).exec();
        if (!loggedInUser) {
            return res.status(404).send('Logged-in user not found');
        }

        const friendName = req.params.friendName;

        // Retrieve another user (potential opponent)
        const opponentUser = await user.findOne({
            nameUser: friendName // Exclude logged-in user
        }).exec();
        if (!opponentUser) {
            return res.status(404).send('No available opponent found');
        }

        // Fetch teams for logged-in user and opponent
        const [userTeamData, opponentTeamData] = await Promise.all([
            team.find({ createdBy: loggedInUserName }).sort({ _id: -1 }).exec(),
            team.find({ createdBy: opponentUser.nameUser }).sort({ _id: -1 }).exec()
        ]);

        if (!userTeamData.length) {
            return res.status(404).send('No team found for the logged-in user');
        }

        // Fetch Pokémon for each team
        const fetchPokemons = (teamData) => {
            return Promise.all(teamData.map(userTeam => {
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
            }));
        };

        const [userPokemonsResponses, opponentPokemonsResponses] = await Promise.all([
            fetchPokemons(userTeamData),
            fetchPokemons(opponentTeamData)
        ]);

        // Serialize Pokémon data
        const serializePokemons = (pokemons) => pokemons.map(up => ({
            ...up,
            pokemons: up.pokemons.filter(pokemon => pokemon !== null).map(pokemon => ({
                name: pokemon.name,
                url: `https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`
            }))
        }));

        // Prepare data for rendering
        const userTeams = userTeamData.map((userTeam, index) => ({
            ...userTeam,
            pokemons: userPokemonsResponses[index].map(response => response ? response.data : null)
        }));

        const opponentTeams = opponentTeamData.map((opponentTeam, index) => ({
            ...opponentTeam,
            pokemons: opponentPokemonsResponses[index].map(response => response ? response.data : null)
        }));

        res.render("battle-pokemon.ejs", {
            loggedIn: true,
            nameFriend: opponentUser.nameUser,
            friendImg: opponentUser.userImg,
            nameUser: loggedInUserName,
            userImg: loggedInUser.userImg,
            userTeams, // Pass userTeams to EJS
            opponentTeams // Pass opponentTeams to EJS
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/team/:teamName', async (req, res) => {
    try {
        const teamName = req.params.teamName;
        const loggedInUsers = await login.find({}).exec();
        if (!loggedInUsers.length) {
            return res.status(404).send('No users are currently logged in');
        }
        const loggedInUserName = loggedInUsers[0].nameUser;

        const teamData = await team.findOne({ teamName, createdBy: loggedInUserName }).exec();
        if (!teamData) {
            return res.status(404).json({ message: 'Team not found or you do not have access to this team' });
        }

        res.json(teamData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});



app.get('/team/:teamName/:userName', async (req, res) => {
    try {
        const { teamName, userName } = req.params;
        const loggedInUsers = await login.find({}).exec();
        if (!loggedInUsers.length) {
            return res.status(404).send('No users are currently logged in');
        }
        const loggedInUserName = loggedInUsers[0].nameUser;

        // Ensure the team is not created by the logged-in user
        if (userName === loggedInUserName) {
            return res.status(403).json({ message: 'You cannot access your own team using this endpoint' });
        }

        const teamData = await team.findOne({ teamName, createdBy: userName }).exec();
        if (!teamData) {
            return res.status(404).json({ message: 'Team not found or you do not have access to this team' });
        }

        res.json(teamData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
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

app.get('/friends-profile/:friendName', async (req, res) => {
    const users = require('../models/user.js');
    const login = require('../models/login.js');

    try {
        const friendName = req.params.friendName;

        // Fetch the list of logged-in user names
        const loggedInUsers = await login.find({}).exec();
        const loggedInUserNames = loggedInUsers.map(user => user.nameUser);

        // Debug the logged-in user names
        console.log('Logged in user names:', loggedInUserNames);


        const friend = await users.findOne({ nameUser: friendName });
        if (!friend) {
            return res.status(404).send('Friend not found');
        }

        const userTeams = await team.find({ createdBy: friend.nameUser }).sort({ _id: -1 });
        if (userTeams.length === 0) {
            return res.status(404).send('No teams found for this user');
        }

        /////////////////////////////////////////Codigo user-profile-->
        const pokemonNames = userTeams.reduce((names, userTeam) => {
            return names.concat([
                userTeam.pokemonOne,
                userTeam.pokemonTwo,
                userTeam.pokemonThree,
                userTeam.pokemonFour,
                userTeam.pokemonFive,
                userTeam.pokemonSix
            ]);
        }, []);

        const pokemonBattleData = await PokemonBattle.find({ pokemonName: { $in: pokemonNames } });

        const pokemonPromises2 = pokemonNames.map(name =>
            axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`).catch(err => null)
        );
        const pokemonResponses2 = await Promise.all(pokemonPromises2);

        // Create a map to easily find Pokémon battle data
        const battleDataMap = pokemonBattleData.reduce((map, battle) => {
            map[battle.pokemonName] = battle;
            return map;
        }, {});

        // Map the Pokémon data with battle information and sort them

        const teamsWithPokemons2 = userTeams.map(userTeam => {
            const pokemons = [
                userTeam.pokemonOne,
                userTeam.pokemonTwo,
                userTeam.pokemonThree,
                userTeam.pokemonFour,
                userTeam.pokemonFive,
                userTeam.pokemonSix
            ];

            const sortedPokemons = pokemons.map(name => {
                const response = pokemonResponses2.find(resp => resp && resp.data.name === name.toLowerCase());
                const battle = battleDataMap[name] || { roundsUsed: 0 };

                return {
                    name,
                    sprite: response ? response.data.sprites.front_default : 'img/default.png',
                    roundsUsed: battle.roundsUsed || 0
                };
            }).sort((a, b) => b.roundsUsed - a.roundsUsed);

            // Calculate total roundsUsed for sorting teams
            const totalRoundsUsed = sortedPokemons.reduce((total, pokemon) => total + pokemon.roundsUsed, 0);

            return {
                team: userTeam,
                pokemons: sortedPokemons,
                battleData: pokemonBattleData.filter(battle => pokemons.includes(battle.pokemonName)),
                totalRoundsUsed
            };
        });

        // Sort teams by totalRoundsUsed
        teamsWithPokemons2.sort((a, b) => b.totalRoundsUsed - a.totalRoundsUsed);
        /////////////////////////////////////////



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
        //////////////////////////////////
        const pokemonResponses = await Promise.all(pokemonPromises);
        const teamsWithPokemons = userTeams.map((userTeam, index) => ({
            team: userTeam,
            pokemons: pokemonResponses[index].map(response => response ? response.data : null)
        }));

        // Render the user profile page and pass the user's name and image path to the EJS file
        res.render('friends-profile.ejs', {
            loggedIn: true,
            nameUser: friend.nameUser,
            imagePath: friend.userImg,
            teamsWithPokemons,
            teamsWithPokemons2
            //////////////////////////////Revisar teaswithPokemon
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

app.get('/settings', (req, res) => {
    res.render("settings.html")
})

//validacion about-us
app.post('/aboutEmail', (req, res) => {
    console.log(req.body.email);
})

//validaciones regist-user
const multer = require('multer');
const fs = require('fs');

// Set up multer to store the uploaded file in a temporary location
const upload = multer({ dest: 'src/public/' });

app.post('/submitUser', upload.single('userImg'), (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).send('Image file is required');
        }

        // Read the uploaded file and convert it to a base64 string
        const file = req.file;
        const data = fs.readFileSync(file.path);
        const base64Image = data.toString('base64');

        // Create a new user object with the base64-encoded image
        let newUser = new user({
            userImg: `data:image/png;base64,${base64Image}`,
            name: req.body.name,
            lastName: req.body.lastone,
            secondLastName: req.body.lasttwo,
            nameUser: req.body.nameUser,
            email: req.body.email,
            id: req.body.id,
            userPassword: req.body.nameUser,
        });

        // Save the user to the database
        newUser.save()
            .then(() => {
                console.log("Usuario guardado");
                res.redirect('/login'); // Replace with your desired redirect path
            })
            .catch((err) => {
                console.error("Error " + err);
                res.status(500).send('Internal Server Error');
            });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});




//VALIDACIÓN-DE-BACKEND-REGISTRO-DE-AMIGOS
const friends = require('../models/friends.js')


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

app.post('/changeImg', upload.single('input-file'), async (req, res) => {
    if (!req.session.nameUser) {
        return res.status(401).send('Unauthorized: No user logged in');
    }

    if (!req.file) {
        return res.status(400).send('Bad Request: Image not found');
    }

    try {
        console.log({ req });
        const file = req.file;
        const data = fs.readFileSync(file.path);

        let base64Image = data.toString('base64');
        console.log({ data, base64Image });


        // Update the user document in the 'User' collection
        const updateResult = await user.updateOne(
            { nameUser: req.session.nameUser },
            { $set: { userImg: `data:image/png;base64,${base64Image}` } }
        );

        // Check if the update was successful
        if (updateResult.matchedCount === 0) {
            return res.status(404).send('User not found');
        }

        // Redirect to the user profile page
        res.redirect('/user-profile');

        // Replace 'src/public/' with '/public/' to create the correct URL path
        // const filePath = req.file.path.replace('src/public/', '/public/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

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
            return res.status(404).send('Ese equipo no existe, regrese a la página anterior');
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

// POST route to search for a friend
app.post('/searchFriend', async (req, res) => {
    const { friendName } = req.body;
    req.session.recentInput = friendName;
    res.redirect('/search-friends')
});

const friendsModel = require('../models/friends.js');

app.get('/search-friends', async (req, res) => {
    const users = require('../models/user.js');
    const login = require('../models/login.js');
    try {
        // Encontrar todos los usuarios que están logueados
        const loggedInUsers = await login.find({}).exec();
        const loggedInUserNames = loggedInUsers.map(user => user.nameUser);

        // Buscar un usuario que no esté logueado
        const userNotLoggedIn = await users.findOne({
            nameUser: { $nin: loggedInUserNames }
        }).exec();

        if (!userNotLoggedIn) {
            return res.status(404).send('No available users found');
        }

        // Recuperar recentInput de la sesión
        let recentInput = req.session.recentInput || '';

        let friend = null;
        if (recentInput) {
            friend = await users.findOne({
                nameUser: recentInput,
            }).exec();

            if (!friend) {
                friend = await users.findOne({
                    email: recentInput,
                }).exec();
            }
        }

        // Obtener todos los usuarios, excluyendo a los logueados
        const allUsers = await users.find({
            nameUser: { $nin: loggedInUserNames }  // Excluir a los usuarios logueados
        }).exec();

        res.render('search-friends.ejs', {
            loggedIn: true,
            recentInput: recentInput,
            friend,
            allUsers,
            loggedInUserNames
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


const PokemonBattle = require('../models/pokemonBattle');

app.post('/api/notify-defeat', async (req, res) => {
    const { winnerPokemon, defeatedPokemon } = req.body;

    try {
        // Update or create a document for the defeated Pokémon
        await PokemonBattle.updateOne(
            { pokemonName: defeatedPokemon },
            {
                $push: { defeatedBy: winnerPokemon }
            },
            { upsert: true } // Create if not exists
        );

        // Update or create a document for the winning Pokémon
        await PokemonBattle.updateOne(
            { pokemonName: winnerPokemon },
            {
                $push: { defeatedPokemon: defeatedPokemon },
                $inc: { roundsUsed: 1 } // Increment roundsUsed
            },
            { upsert: true } // Create if not exists
        );

        // Increment roundsUsed for the defeated Pokémon if it is still in use
        await PokemonBattle.updateOne(
            { pokemonName: defeatedPokemon },
            {
                $inc: { roundsUsed: 1 } // Increment roundsUsed
            }
        );

        res.status(200).send('Defeat recorded');
    } catch (error) {
        console.error('Error updating defeat record:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/user-profile', async (req, res) => {
    const users = require('../models/user.js');
    const login = require('../models/login.js');
    const PokemonBattle = require('../models/pokemonBattle.js');
    const team = require('../models/team.js'); // Assuming you have a team model
    const axios = require('axios');

    try {
        const loggedInUserName = req.session.nameUser;
        const loginUser = await login.findOne({ nameUser: loggedInUserName });

        if (!loginUser) {
            return res.status(404).send('Login record not found');
        }

        const user = await users.findOne({ nameUser: loginUser.nameUser });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const userTeams = await team.find({ createdBy: req.session.nameUser }).sort({ _id: -1 });
        //////////////////////////////////////////////////////////////////////////////
        const pokemonNames = userTeams.reduce((names, userTeam) => {
            return names.concat([
                userTeam.pokemonOne,
                userTeam.pokemonTwo,
                userTeam.pokemonThree,
                userTeam.pokemonFour,
                userTeam.pokemonFive,
                userTeam.pokemonSix
            ]);
        }, []);

        const pokemonBattleData = await PokemonBattle.find({ pokemonName: { $in: pokemonNames } });

        const pokemonPromises = pokemonNames.map(name =>
            axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`).catch(err => null)
        );
        const pokemonResponses = await Promise.all(pokemonPromises);

        // Create a map to easily find Pokémon battle data
        const battleDataMap = pokemonBattleData.reduce((map, battle) => {
            map[battle.pokemonName] = battle;
            return map;
        }, {});

        // Map the Pokémon data with battle information and sort them

        const teamsWithPokemons = userTeams.map(userTeam => {
            const pokemons = [
                userTeam.pokemonOne,
                userTeam.pokemonTwo,
                userTeam.pokemonThree,
                userTeam.pokemonFour,
                userTeam.pokemonFive,
                userTeam.pokemonSix
            ];

            const sortedPokemons = pokemons.map(name => {
                const response = pokemonResponses.find(resp => resp && resp.data.name === name.toLowerCase());
                const battle = battleDataMap[name] || { roundsUsed: 0 };

                return {
                    name,
                    sprite: response ? response.data.sprites.front_default : 'img/default.png',
                    roundsUsed: battle.roundsUsed || 0
                };
            }).sort((a, b) => b.roundsUsed - a.roundsUsed);

            // Calculate total roundsUsed for sorting teams
            const totalRoundsUsed = sortedPokemons.reduce((total, pokemon) => total + pokemon.roundsUsed, 0);

            return {
                team: userTeam,
                pokemons: sortedPokemons,
                battleData: pokemonBattleData.filter(battle => pokemons.includes(battle.pokemonName)),
                totalRoundsUsed
            };
        });

        // Sort teams by totalRoundsUsed
        teamsWithPokemons.sort((a, b) => b.totalRoundsUsed - a.totalRoundsUsed);
        /////////////////////////////////////////////////////////////////////////////
        // Render the EJS template and pass the necessary data
        res.render('user-profile.ejs', {
            nameUser: req.session.nameUser,
            teamsWithPokemons,
            loggedIn: true,
            user,

        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

const nodemailer = require('nodemailer');

const userModel = require('..//models/user.js'); // Asegúrate de ajustar la ruta según la ubicación de tu archivo

app.use(bodyParser.urlencoded({ extended: true }));

const enviarMail = async (correoDestino) => {
    // Buscar el usuario en la base de datos
    let user;
    try {
        user = await userModel.findOne({ email: correoDestino });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        throw new Error('Error al recuperar datos del usuario');
    }

    const passwordRecuperada = user.userPassword;

    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'gabrielbryansalazar@gmail.com',
            pass: 'jufd ltal wgpq nhjd'
        }
    };

    const mensaje = {
        from: 'gabrielbryansalazar@gmail.com',
        to: correoDestino,
        subject: "Recuperación de Contraseña",
        text: `Hola ${user.nameUser}`
            + `
Te contactamos de Pokémon. Hemos recibido tu solicitud de recuperación de contraseña. Tu contraseña actual es: ${passwordRecuperada}`
    };

    try {
        const transport = nodemailer.createTransport(config);
        const info = await transport.sendMail(mensaje);
        console.log(info);
    } catch (error) {
        console.error("Error al enviar el correo:", error);
    }
};

app.post('/addRecover', (req, res) => {
    const correo = req.body.addCorreo;
    enviarMail(correo).then(() => {
        res.redirect('/login')
    }).catch((error) => {
        res.status(500).send("Error al enviar el correo.");
    });
});