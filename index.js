const url = require("url");

var express  = require('express')
  , session  = require('express-session')
  , passport = require('passport')
  , Strategy = require('passport-discord').Strategy
  , app      = express();

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var scopes = ['identify', /* 'connections', (it is currently broken) */ 'guilds'];
var prompt = 'consent'

passport.use(
  new Strategy({ clientID: '782264173823262750', clientSecret: process.env.CLIENT_SECRET, callbackURL: 'https://Houseannor-Website.HouseannorTeam.repl.co/auth/callback', scope: scopes, prompt: prompt }, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      return done(null, profile);
    });
  })
);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var exphbs  = require('express-handlebars');

const Discord = require('discord.js');
const fs = require('fs')

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'));

  var load = async () => await console.log(`Loading ${commandFiles.length} commands!`)

  load()

  for (const file of commandFiles) {
	  const command = require(`./bot/commands/${file}`);
	  client.commands.set(command.name, command);
  }

setInterval(() => {
  require('node-fetch')('https://Houseannor-Website.houseannorteam.repl.co')
}, 3000)

// Bot stuff

client.on('ready', () => {
  console.log(`[READY] ${client.user.tag} is online!`)
  client.guilds.cache.each(guild => {
    guild.fetch()
    guild.members.cache.each(member => {
      member.fetch()
    })
  })
})

client.on('message', (msg) => {
  require('./bot/event/message.js')(msg)
})
// Website!

client.server = app;

client.server.engine('handlebars', exphbs());
client.server.set('view engine', 'handlebars');

app.use('/src', express.static('public'))

app.get("/auth/callback", passport.authenticate("discord", { failureRedirect: "/" }), async (req, res) => {
if (req.session.backURL) {
const url = req.session.backURL;
req.session.backURL = null;
res.redirect(url);
} else {
res.redirect("/");
}
});

app.get('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

function checkAuth(req, res, next) {
if (req.isAuthenticated()) return next();
req.session.backURL = req.url
res.redirect("/auth/login");
}

app.get('/', (req, res) => res.render(`index`, {title: "Houseannor: The Best ROBLOX Discord Bot", data: {
  users: client.users.cache.size,
  guilds: client.guilds.cache.size
}}))

app.get("/auth/login", (req, res, next) => {
if (req.session.backURL) {
req.session.backURL = req.session.backURL;
} else if (req.headers.referer) {
const parsed = url.parse(req.headers.referer);
if (parsed.hostname === app.locals.domain) {
req.session.backURL = parsed.path;
}
} else {
req.session.backURL = "/";
}
next();
},
passport.authenticate("discord"));

app.get('/invite', (req, res) => res.redirect('https://top.gg/bot/621597193383575552/invite'))

app.get('/dashboard', checkAuth, (req, res) => res.send("Coming Soon...."))

app.get('/dashboard/:id', checkAuth, (req, res) => {
  var inserver = false
  req.user.guilds.forEach(guild => {
    if (guild.id == req.params.id) inserver = true
  })
  if (!inserver) return res.send("403 Unauthorized - You are not in this server.")
  const manageServerRoles = client.guilds.cache.get(req.params.id).members.cache.get(req.user.id).roles.cache.filter(role => role.permissions.has(0x00000020))

  if (!manageServerRoles.size) return res.send("403 Unauthorized - Not enough permissions.")
  res.send(inserver)
})

app.get('/support', (req, res) => res.redirect('https://discord.gg/SmN9Kkf'))

app.get('/faq', (req, res) => res.sendFile(`${__dirname}/views/faq.html`))

app.get('/commands', (req, res) => res.sendFile(`${__dirname}/views/commands.html`))

app.get('/commands/:command', (req, res) => {
  try {
    require('fs').readFileSync(`./views/commands/${req.params.command}.html`)
    // if successful
    res.sendFile(`${__dirname}/views/commands/${req.params.command}.html`)
  } catch (err) {
    // otherwise
    res.sendFile(`${__dirname}/views/404.html`)
  }
})

app.get('*', (req, res) => res.sendFile(`${__dirname}/views/404.html`))

app.listen(3000, () => {
  console.log('server started');
  var TOKEN = Buffer.from(process.env.BOT_TOKEN, 'base64').toString('utf-8');
  TOKEN = Buffer.from(TOKEN, 'base64').toString('utf-8');
  client.login(TOKEN)
})

new Promise(res => undefined)