/* eslint-disable no-undef */
//LEAK BY WEZ#1000
const {
    token,
    prefix,
} = require('./config.json');
const {
    Client,
    Collection,
} = require("discord.js");
const fs = require('fs').promises;
const db = require('quick.db');;
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
require("discord-reply")




const client = new Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.commands = new Collection();


const disbut = require('discord-buttons');
disbut(client)

const path = require('path');
async function registry(cheminDossier = path.join(__dirname, './src/events')) {
    const files = await fs.readdir(cheminDossier)
    if (cheminDossier.includes('events')) {
        for (let i = 0; i < files.length; i++) {
            if (files[i].endsWith('js')) {
                const file = require(path.join(cheminDossier, files[i]));
                file(client)
            } else {
                registry(path.join(cheminDossier, files[i]));
            }
        }
    } else if (cheminDossier.includes('commands')) {
        for (let i = 0; i < files.length; i++) {
            if (files[i].endsWith('js')) {
                const command = require(path.join(cheminDossier, files[i]));
                client.commands.set(command.name, command);
            } else {
                registry(path.join(cheminDossier, files[i]));
            }
        }
    } else if (cheminDossier.includes('logs')) {
        for (let i = 0; i < files.length; i++) {
            if (files[i].endsWith('js')) {
                const file = require(path.join(cheminDossier, files[i]));
                file(client)
            } else {
                registry(path.join(cheminDossier, files[i]));
            }
        }
    }
}
registry(path.join(__dirname, './src/events'));
registry(path.join(__dirname, './src/logs'));
registry(path.join(__dirname, './src/commands'));

//client.on('ready', async () => {
    // client.guilds.cache.forEach(guild => {
    //     if (guild.memberCount > 15) {
    //         return console.log(`${guild.name} | ${guild.id} | ${guild.memberCount}`);
    //     } else {
    //         guild.leave()
    //     }
    // })
   // console.log(`${client.user.username} à été allumé avec succès.`)
  //  console.log(`${client.guilds.cache.size} serveurs | ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} membres`)
  //  db.set(`${client.user.id}.statutTime`, false)
  //  db.set(`${client.user.id}.avatar`, false)
  //  db.set(`${client.user.id}.username`, false)
  //  db.set(`${client.user.id}.activityTypeTime`, false)

  //  if (db.get(`${client.user.id}.statut`) === undefined || db.get(`${client.user.id}.statut`) === null) {
 //       db.set(`${client.user.id}.statut`, `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} membres`)
 //   }
 //   if (db.get(`${client.user.id}.activityType`) === undefined || db.get(`${client.user.id}.activityType`) === null) {
        
   //     db.set(`${client.user.id}.activityType`, `PLAYING`)
  //  }

  //  client.user.setActivity(db.get(`${client.user.id}.statut`), {
   //     type: db.get(`${client.user.id}.activityType`),
   //     url: "https://www.twitch.tv/wez"
   // })
//});
//client.on("ready", () =>{
  //  client.user.setPresence({
 //       status: "idle", 
  //  });
  //});

 client.on('ready', async () => {
    console.log(`${client.user.username} à été allumé avec succès.`)
     console.log(`${client.guilds.cache.size} serveurs | ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} membres`)

     let statuses = [
         "Discord.gg/stalamina",
         `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Membres`,
     ]
//${client.guilds.cache.size} serveurs
     setInterval(() => {
         let status = statuses[Math.floor(Math.random() * statuses.length)];
         client.user.setActivity(status, {
             type: "PLAYING",
             url: "https://www.twitch.tv/BetterGuard",
             status: "idle"
         })
     }, 20000)

 });

client.on('presenceUpdate', async (oldPresence, newPresence) => {

    if (!oldPresence) return;
    if (!newPresence.guild.me.hasPermission("MANAGE_ROLES")) return
    let presenceStatusSoutien = db.get(`${newPresence.guild.id}.statutchange`);
    let roleSoutien = db.get(`${newPresence.guild.id}.RoleSoutien`)
    if (db.get(`${newPresence.guild.id}.RoleSoutien`) == undefined) return;
    if (db.get(`${newPresence.guild.id}.statutchange`) == undefined) return;
    if (db.get(`${newPresence.guild.id}.RoleSoutien`) == null) return;
    if (db.get(`${newPresence.guild.id}.statutchange`) == null) return;
    let roleS = newPresence.guild.roles.cache.get(roleSoutien);
    if (!roleS) return;
    if (roleS.position > newPresence.guild.me.roles.highest.position) return
    const m = newPresence;
    if (m.user.bot) return;
    const Ifsoutien = (presence) => {
        if (presence.activities.length > 0) {
            if (presence.activities.some(activity => activity.type === 'CUSTOM_STATUS')) {
                if (presence.activities.find(x => x.type == "CUSTOM_STATUS").state) {
                    if (presence.activities.find(x => x.type == "CUSTOM_STATUS").state.toLowerCase().includes(presenceStatusSoutien.toLowerCase())) {
                        return true;
                    }
                    return false;
                }
                return false;
            }
            return false;
        }
        return false;
    }
    if (!Ifsoutien(oldPresence) && Ifsoutien(newPresence)) {
        if (!m.member.roles.cache.has(roleS.id)) {
            return m.member.roles.add(roleS)
        }
    }
    if (Ifsoutien(oldPresence) && Ifsoutien(newPresence)) {
        if (!m.member.roles.cache.has(roleS.id)) {
            return m.member.roles.add(roleS)
        }
    }
    if (Ifsoutien(oldPresence) && !Ifsoutien(newPresence)) {
        if (m.member.roles.cache.has(roleS.id)) {
            return m.member.roles.remove(roleS)
        }
    }
});

///////////////////////////////////////////////////////////////////
////////////////////////// IMPORT COMMANDES //////////////////////
/////////////////////////////////////////////////////////////////

client.on('message', async (message) => {
    if (!message.member || message.channel.type == 'dm') return;
    if (!message.guild || message.author.bot) return;

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(db.get(`${message.guild.id}.prefix`) || prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    if (!cmd) return;

    let language;
    if (db.get(`${message.guild.id}.language`) === undefined || db.get(`${message.guild.id}.language`) === null) {
        await db.set(`${message.guild.id}.language`, "fr")
        language = db.get(`${message.guild.id}.language`)
    }
    language = db.get(`${message.guild.id}.language`)
    const lang = JSON.parse(await fs.readFile(`./Languages/${language}.json`))
    try {
        cmd.execute(message, args, client, lang);
    } catch (error) {
        console.log(error);
        return message.lineReply("Il semble y avoir un eu une erreur lors de l'éxécution de cette commande ")
    }

});

////snipe
client.snipes = new Map()
client.on('messageDelete', function(message, channel){
  
  client.snipes.set(message.channel.id, {
    content:message.content,
    author:message.author,
    image:message.attachments.first() ? message.attachments.first().proxyURL : null
  })
  
})
///Bl

client.login(token)


const express = require('express')
const app = express();
const port = 3000

app.get('/', (req, res) => res.send('Yo boi!!'))

app.listen(port, () =>
console.log(`Your app is listening a http://localhost:${port}`)
);