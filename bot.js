const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const moment = require('moment');
var Jimp = require('jimp');
const { Client, Util } = require('discord.js');
const weather = require('weather-js')
const fs = require('fs');
const db = require('quick.db');
const http = require('http');
const express = require('express');
require('./util/eventLoader')(client);
const path = require('path');
const request = require('request');
const snekfetch = require('snekfetch');
const queue = new Map();
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');


const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping tamamdır.");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var prefix = ayarlar.prefix;

const log = message => {
    console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);

//Gelişmiş Hazır Sunucu Kurma Yapımcı : DraqoNs#0128//

client.on("message", async message => {
  const ms = require("ms");
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  let u = message.mentions.users.first() || message.author;
  if (command === "sunucu-kur") {
    if (
      message.guild.channels.find(channel => channel.name === "Bot Kullanımı")
    )
      return message.channel.send(" Bot Paneli Zaten Ayarlanmış.");
    message.channel.send(
      `Bot Bilgi Kanallarının kurulumu başlatılsın mı? başlatılacak ise **evet** yazınız.`
    );
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send(
        " Bu Kodu `Yönetici` Yetkisi Olan Kişi Kullanabilir."
      );
    message.channel
      .awaitMessages(response => response.content === "evet", {
        max: 1,
        time: 10000,
        errors: ["time"]
      })
      .then(collected => {
        message.guild.createChannel("|▬▬|ÖNEMLİ KANALLAR|▬▬|", "category", [
          {
            id: message.guild.id,
            deny: ["SEND_MESSAGES"]
          }
        ]);

        message.guild
          .createChannel("「📃」kurallar", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「🚪」gelen-giden", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「✅」sayaç", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「💾」log-kanalı", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel("「📢」duyuru-odası", "text", [
            {
              id: message.guild.id,
              deny: ["SEND_MESSAGES"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|"
              )
            )
          );
      })
      .then(collected => {
        message.guild.createChannel("|▬▬|GENEL KANALLAR|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);

        message.guild
          .createChannel(`「💡」şikayet-ve-öneri`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`「👥」pre-arama-odası`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`「📷」görsel-içerik`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`「🤖」bot-komutları`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`「💬」sohbet`, "text")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|"
              )
            )
          );

        message.guild
          .createChannel(`🏆》Kurucu Odası`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|SES KANALLARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            let role2 = message.guild.roles.find("name", "Kurucu");

            c.overwritePermissions(role, {
              CONNECT: false
            });
            c.overwritePermissions(role2, {
              CONNECT: true
            });
          });

        message.guild.createChannel("|▬▬|SES KANALLARI|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);

        message.guild
          .createChannel(`🏆》Yönetici Odası`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|SES KANALLARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            let role2 = message.guild.roles.find("name", "Kurucu");
            let role3 = message.guild.roles.find("name", "Yönetici");
            c.overwritePermissions(role, {
              CONNECT: false
            });
            c.overwritePermissions(role2, {
              CONNECT: true
            });
            c.overwritePermissions(role3, {
              CONNECT: true
            });
          });

        message.guild
          .createChannel(`💬》Sohbet Odası`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|SES KANALLARI|▬▬|"
              )
            )
          )
          .then(c => {
            let role = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
              CONNECT: true
            });
          });

        message.guild.createChannel("|▬▬|OYUN ODALARI|▬▬|", "category", [
          {
            id: message.guild.id
          }
        ]);

        message.guild
          .createChannel(`🎮》LOL`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》ZULA`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》COUNTER STRİKE`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》PUBG`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》FORTNİTE`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》MİNECRAFT`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》ROBLOX`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );
        message.guild
          .createChannel(`🎮》WOLFTEAM`, "voice")
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|"
              )
            )
          );

        message.guild.createRole({
          name: "Kurucu",
          color: "RED",
          permissions: ["ADMINISTRATOR"]
        });

        message.guild.createRole({
          name: "Yönetici",
          color: "BLUE",
          permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES",
            "KICK_MEMBERS"
          ]
        });

        message.guild.createRole({
          name: "Moderatör",
          color: "GREEN",
          permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES"
          ]
        });

        message.guild.createRole({
          name: "V.I.P",
          color: "00ffff"
        });

        message.guild.createRole({
          name: "Üye",
          color: "WHITE"
        });

        message.guild.createRole({
          name: "Bot",
          color: "ORANGE"
        });

        message.channel.send("Gerekli Odalar Kuruldu!");
      });
  }
});

//Gelişmiş Hazır Sunucu Kurma Yapımcı : DraqoNs#0128//

client.on("guildDelete", guild => {
  let rrrsembed = new Discord.RichEmbed()

    .setColor("RED")
    .setTitle(" Bot Kickledi ")
    .addField("Sunucu Adı:", guild.name)
    .addField("Sunucu sahibi", guild.owner)
    .addField("Sunucu Sahibi'nin ID'si", guild.ownerID)
    .addField("Sunucunun Kurulu Olduğu Bölge:", guild.region)
    .addField("Sunucudaki Kişi Sayısı:", guild.memberCount);

  client.channels.get("555044354528509953").send(rrrsembed);
});

client.on("guildCreate", guild => {
  let rrrsembed = new Discord.RichEmbed()

    .setColor("GREEN")
    .setTitle(" Bot Eklendi ")
    .addField("Sunucu Adı:", guild.name)
    .addField("Sunucu sahibi", guild.owner)
    .addField("Sunucu Sahibi'nin ID'si", guild.ownerID)
    .addField("Sunucunun Kurulu Olduğu Bölge:", guild.region)
    .addField("Sunucudaki Kişi Sayısı:", guild.memberCount);

  client.channels.get("555044354528509953").send(rrrsembed);
});

//MOD LOG//

client
  .on("guildBanAdd", async (guild, member) => {
    const fs = require("fs");
    let gc = JSON.parse(
      fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8")
    );

    const hgK = member.guild.channels.get(gc[member.guild.id].gkanal);
    if (!hgK) return;
    const embed = new Discord.RichEmbed()
      .setTitle("Üye yasaklandı.")
      .setAuthor(member.user.tag, member.user.avatarURL)
      .setColor("RANDOM")
      .setDescription(`<@!${member.user.id}>, ${member.user.tag}`)
      .setThumbnail(member.user.avatarURL)
      .setFooter(`Botismi Mod-Log Sistemi | ID: ${member.user.id}`)
      .setTimestamp();
    hgK.send({ embed });
  })

  .on("guildBanRemove", async (guild, member) => {
    const fs = require("fs");
    let gc = JSON.parse(
      fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8")
    );

    const hgK = member.guild.channels.get(gc[member.guild.id].gkanal);
    if (!hgK) return;
    var embed = new Discord.RichEmbed()
      .setTitle("Üyenin yasaklaması kaldırıldı.")
      .setAuthor(member.user.tag, member.user.avatarURL)
      .setColor("RANDOM")
      .setDescription(`<@!${member.user.id}>, ${member.user.tag}`)
      .setThumbnail(member.user.avatarURL)
      .setFooter(`Botismi Mod-Log Sistemi | ID: ${member.user.id}`)
      .setTimestamp();
    hgK.send({ embed });
  })

  .on("messageDelete", async msg => {
    if (!msg.guild) return;
    const fs = require("fs");
    let gc = JSON.parse(
      fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8")
    );

    const hgK = msg.guild.channels.get(gc[msg.guild.id].gkanal);
    if (!hgK) return;
    var embed = new Discord.RichEmbed()
      .setAuthor(msg.author.tag, msg.author.avatarURL)
      .setColor("RANDOM")
      .setDescription(
        `<@!${msg.author.id}> tarafından <#${msg.channel.id}> kanalına gönderilen "${msg.content}" mesajı silindi.`
      )
      .setFooter(`Botismi Mod-Log Sistemi | ID: ${msg.id}`);
    hgK.send({ embed });
  })

  .on("channelCreate", async channel => {
    if (!channel.guild) return;
    const fs = require("fs");
    let gc = JSON.parse(
      fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8")
    );

    const hgK = channel.guild.channels.get(gc[channel.guild.id].gkanal);
    if (!hgK) return;
    if (channel.type === "text") {
      var embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(channel.guild.name, channel.guild.iconURL)
        .setDescription(`<#${channel.id}> kanalı oluşturuldu. _(metin kanalı)_`)
        .setFooter(`Botismi Mod-Log Sistemi | ID: ${channel.id}`);
      hgK.send({ embed });
    }
    if (channel.type === "voice") {
      var embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(channel.guild.name, channel.guild.iconURL)
        .setDescription(`${channel.name} kanalı oluşturuldu. _(sesli kanal)_`)
        .setFooter(`Botismi Mod-Log Sistemi | ID: ${channel.id}`);
      hgK.send({ embed });
    }
  })

  .on("channelDelete", async channel => {
    const fs = require("fs");
    let gc = JSON.parse(
      fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8")
    );

    const hgK = channel.guild.channels.get(gc[channel.guild.id].gkanal);
    if (!hgK) return;
    if (channel.type === "text") {
      let embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(channel.guild.name, channel.guild.iconURL)
        .setDescription(`${channel.name} kanalı silindi. _(metin kanalı)_`)
        .setFooter(`Botismi Mod-Log Sistemi | ID: ${channel.id}`);
      hgK.send({ embed });
    }
    if (channel.type === "voice") {
      let embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(channel.guild.name, channel.guild.iconURL)
        .setDescription(`${channel.name} kanalı silindi. _(sesli kanal)_`)
        .setFooter(`Botismi Mod-Log Sistemi | ID: ${channel.id}`);
      hgK.send({ embed });
    }
  })

  .on("roleDelete", async role => {
    const fs = require("fs");
    let gc = JSON.parse(
      fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8")
    );

    const hgK = role.guild.channels.get(gc[role.guild.id].gkanal);
    if (!hgK) return;
    let embed = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setAuthor(`Rol Silindi!`)
      .setThumbnail(role.guild.iconURL)
      .setDescription(`'${role.name}' adlı rol silindi.`, true)
      .setFooter(`Botismi Mod-Log Sistemi | ID: ${role.id}`);
    hgK.send({ embed });
  })

  .on("emojiCreate", async emoji => {
    const fs = require("fs");
    let gc = JSON.parse(
      fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8")
    );

    const hgK = emoji.guild.channels.get(gc[emoji.guild.id].gkanal);
    if (!hgK) return;
    let embedds9 = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setAuthor(`Emoji Oluşturuldu!`)
      .setThumbnail(emoji.guild.iconURL)
      .setDescription(
        `<:${emoji.name}:${emoji.id}> - ${emoji.name} adlı emoji oluşturuldu!`,
        true
      )
      .setFooter(`Botismi Mod-Log Sistemi | ID: ${emoji.id}`);
    hgK.send({ embedds9 });
  })

  .on("emojiDelete", async emoji => {
    const fs = require("fs");
    let gc = JSON.parse(
      fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8")
    );

    const hgK = emoji.guild.channels.get(gc[emoji.guild.id].gkanal);
    if (!hgK) return;
    let embedds0 = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setAuthor(`Emoji Silindi!`)
      .setThumbnail(emoji.guild.iconURL)
      .setDescription(`':${emoji.name}:' adlı emoji silindi!`, true)
      .setFooter(`Botismi Mod-Log Sistemi | ID: ${emoji.id}`);
    hgK.send(embedds0);
  })

  .on("roleCreate", async role => {
    const fs = require("fs");
    let gc = JSON.parse(
      fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8")
    );

    const hgK = role.guild.channels.get(gc[role.guild.id].gkanal);
    if (!hgK) return;
    let embedds0 = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setAuthor(`Rol Oluşturuldu!`)
      .setThumbnail(role.guild.iconURL)
      .setDescription(`'${role.name}' adlı rol oluşturuldu.`, true)
      .setFooter(`Botismi Mod-Log Sistemi | ID: ${role.id}`);
    hgK.send(embedds0);
  })

  .on("messageUpdate", async (oldMessage, newMessage) => {
    const fs = require("fs");
    let gc = JSON.parse(
      fs.readFileSync("./sunucuyaözelayarlar/log.json", "utf8")
    );
    const hgK = oldMessage.guild.channels.get(gc[oldMessage.guild.id].gkanal);
    if (!hgK) return;
    if (oldMessage.author.bot) {
      return false;
    }

    if (!oldMessage.guild) {
      return false;
    }

    if (oldMessage.content == newMessage.content) {
      return false;
    }

    if (
      !oldMessage ||
      !oldMessage.id ||
      !oldMessage.content ||
      !oldMessage.guild
    )
      return;
    let embedds4 = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setAuthor(`Mesaj Güncellendi!`)
      .setThumbnail(oldMessage.author.avatarURL)
      .addField("Gönderen", oldMessage.author.tag, true)
      .addField("Önceki Mesaj", oldMessage.content, true)
      .addField("Şimdiki Mesaj", newMessage.content, true)
      .addField("Kanal", newMessage.channel.name, true)
      .setFooter(`Botismi Mod-Log Sistemi | ID: ${oldMessage.id}`);
    hgK.send(embedds4);
  });

//MOD LOG//

//BOT PANEL//

client.on("message", async message => {
  const ms = require("ms");
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  let u = message.mentions.users.first() || message.author;
  if (command === "panelkur") {
    if (
      message.guild.channels.find(channel => channel.name === "Bot Kullanımı")
    )
      return message.channel.send(" Bot Paneli Zaten Ayarlanmış.");
    message.channel.send(
      `Bot Bilgi Kanallarının kurulumu başlatılsın mı? başlatılacak ise **evet** yazınız.`
    );
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send(
        " Bu Kodu `Yönetici` Yetkisi Olan Kişi Kullanabilir."
      );
    message.channel
      .awaitMessages(response => response.content === "evet", {
        max: 1,
        time: 10000,
        errors: ["time"]
      })
      .then(collected => {
        message.guild.createChannel("Bot Kullanımı", "category", [
          {
            id: message.guild.id,
            deny: ["CONNECT"]
          }
        ]);

        message.guild
          .createChannel(
            `Bellek Kullanımı: ${(
              process.memoryUsage().heapUsed /
              1024 /
              1024
            ).toFixed(2)} MB`,
            "voice",
            [
              {
                id: message.guild.id,
                deny: ["CONNECT"]
              }
            ]
          )
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "Bot Kullanımı"
              )
            )
          );
        message.guild
          .createChannel(
            `Sunucular: ${client.guilds.size.toLocaleString()}`,
            "voice",
            [
              {
                id: message.guild.id,
                deny: ["CONNECT"]
              }
            ]
          )
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "Bot Kullanımı"
              )
            )
          );
        message.guild
          .createChannel(
            `Toplam Kanal: ${client.channels.size.toLocaleString()}`,
            "voice",
            [
              {
                id: message.guild.id,
                deny: ["CONNECT"]
              }
            ]
          )
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "Bot Kullanımı"
              )
            )
          );
        message.guild
          .createChannel(`Ping: ${client.ping}`, "voice", [
            {
              id: message.guild.id,
              deny: ["CONNECT"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "Bot Kullanımı"
              )
            )
          );
        message.guild
          .createChannel("Yapımcım: ! HΛЯÐ ℂ⋆ Sálvádøre#0001", "voice", [
            {
              id: message.guild.id,
              deny: ["CONNECT"]
            }
          ])
          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "Bot Kullanımı"
              )
            )
          );
        message.guild
          .createChannel(`Kütüphanesi: Discord.js`, "voice")

          .then(channel =>
            channel.setParent(
              message.guild.channels.find(
                channel => channel.name === "Bot Kullanımı"
              )
            )
          );
        message.channel.send("Bot Bilgi Panelini Oluşturdum");
      });
  }
});

//BOT PANEL//

client.on("guildDelete", guild => {
  let rrrsembed = new Discord.RichEmbed()

    .setColor("RED")
    .setTitle(" Bot Kickledi ")
    .addField("Sunucu Adı:", guild.name)
    .addField("Sunucu sahibi", guild.owner)
    .addField("Sunucu Sahibi'nin ID'si", guild.ownerID)
    .addField("Sunucunun Kurulu Olduğu Bölge:", guild.region)
    .addField("Sunucudaki Kişi Sayısı:", guild.memberCount);

  client.channels.get("556159437035929600").send(rrrsembed);
});

client.on("guildCreate", guild => {
  let rrrsembed = new Discord.RichEmbed()

    .setColor("GREEN")
    .setTitle(" Bot Eklendi ")
    .addField("Sunucu Adı:", guild.name)
    .addField("Sunucu sahibi", guild.owner)
    .addField("Sunucu Sahibi'nin ID'si", guild.ownerID)
    .addField("Sunucunun Kurulu Olduğu Bölge:", guild.region)
    .addField("Sunucudaki Kişi Sayısı:", guild.memberCount);

  client.channels.get("556159437035929600").send(rrrsembed);
});

//SAYAÇ//

client.on("message", async message => {
  let sayac = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
  if (sayac[message.guild.id]) {
    if (sayac[message.guild.id].sayi <= message.guild.members.size) {
      const embed = new Discord.RichEmbed()
        .setDescription(
          `Tebrikler ${message.guild.name}! Başarıyla ${sayac[message.guild.id].sayi} kullanıcıya ulaştık! Sayaç sıfırlandı!`
        )
        .setColor("RANDOM")
        .setTimestamp();
      message.channel.send({ embed });
      delete sayac[message.guild.id].sayi;
      delete sayac[message.guild.id];
      fs.writeFile("./ayarlar/sayac.json", JSON.stringify(sayac), err => {
        console.log(err);
      });
    }
  }
});
client.on("guildMemberRemove", async member => {
  let sayac = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
  let giriscikis = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
  let embed = new Discord.RichEmbed()
    .setTitle("")
    .setDescription(``)
    .setColor("RED")
    .setFooter("", client.user.avatarURL);

  if (!giriscikis[member.guild.id].kanal) {
    return;
  }

  try {
    let giriscikiskanalID = giriscikis[member.guild.id].kanal;
    let giriscikiskanali = client.guilds
      .get(member.guild.id)
      .channels.get(giriscikiskanalID);
    giriscikiskanali.send(
      `:loudspeaker: :outbox_tray: Kullanıcı Ayrıldı. \`${
        sayac[member.guild.id].sayi
      }\` Kişi Olmamıza \`${sayac[member.guild.id].sayi -
        member.guild.memberCount}\` Kişi Kaldı \`${
        member.guild.memberCount
      }\` Kişiyiz! :x: **${member.user.tag}**`
    );
  } catch (e) {
    // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
    return console.log(e);
  }
});
client.on("guildMemberAdd", async member => {
  let sayac = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
  let giriscikis = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
  let embed = new Discord.RichEmbed()
    .setTitle("")
    .setDescription(``)
    .setColor("GREEN")
    .setFooter("", client.user.avatarURL);

  if (!giriscikis[member.guild.id].kanal) {
    return;
  }

  try {
    let giriscikiskanalID = giriscikis[member.guild.id].kanal;
    let giriscikiskanali = client.guilds
      .get(member.guild.id)
      .channels.get(giriscikiskanalID);
    giriscikiskanali.send(
      `:loudspeaker: :inbox_tray: Kullanıcı Katıldı! **${
        sayac[member.guild.id].sayi
      }** Kişi Olmamıza **${sayac[member.guild.id].sayi -
        member.guild.memberCount}** Kişi Kaldı **${
        member.guild.memberCount
      }** Kişiyiz! ${process.env.basarili} Hoşgeldin! **${member.user.tag}**`
    );
  } catch (e) {
    // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
    return console.log(e);
  }
});
client.on("guildMemberAdd", async member => {
  let sayac = JSON.parse(
    fs.readFileSync("./sunucuyaözelayarlar/otorol.json", "utf8")
  );
  let otorole = JSON.parse(
    fs.readFileSync("./sunucuyaözelayarlar/otorol.json", "utf8")
  );
  let arole = otorole[member.guild.id].sayi;
  let role = otorole[member.guild.id];
  let giriscikis = JSON.parse(
    fs.readFileSync("./sunucuyaözelayarlar/otorol.json", "utf8")
  );
  if (!giriscikis[member.guild.id].kanal) {
    return;
  }

  try {
    let giriscikiskanalID = giriscikis[member.guild.id].kanal;
    let giriscikiskanali = client.guilds
      .get(member.guild.id)
      .channels.get(giriscikiskanalID);
    giriscikiskanali.send(
      `:loudspeaker: :inbox_tray:  <@${member.user.id}>'a Başarıyla Rol Verildi`
    );
  } catch (e) {
    // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
    return console.log(e);
  }
});

//SAYAÇ//

//AFK//

client.on("message", async message => {
  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || ayarlar.prefix;

  let kullanıcı = message.mentions.users.first() || message.author;
  let afkdkullanıcı = await db.fetch(`afk_${message.author.id}`);
  let afkkullanıcı = await db.fetch(`afk_${kullanıcı.id}`);
  let sebep = afkkullanıcı;

  if (message.author.bot) return;
  if (message.content.includes(`${prefix}afk`)) return;

  if (message.content.includes(`<@${kullanıcı.id}>`)) {
    if (afkdkullanıcı) {
      message.channel.send(
        `\`${message.author.tag}\` adlı kullanıcı artık AFK değil.`
      );
      db.delete(`afk_${message.author.id}`);
    }
    if (afkkullanıcı)
      return message.channel.send(
        `${message.author}\`${kullanıcı.tag}\` şu anda AFK. Sebep : \`${sebep}\``
      );
  }

  if (!message.content.includes(`<@${kullanıcı.id}>`)) {
    if (afkdkullanıcı) {
      message.channel.send(
        `\`${message.author.tag}\` adlı kullanıcı artık AFK değil.`
      );
      db.delete(`afk_${message.author.id}`);
    }
  }
});

//AFK//

//SUNUCUYA HG//

client.on("guildMemberAdd", member => {
  const embed = new Discord.RichEmbed()
    .setColor("0x808080")
    .addField("https://i.ibb.co/NSwhgf1/bella-hosgeldin.gif")
    .addField("Bu Sunucu Türk Botunu Kullanıyor!")
    .addField("Yardım Komutlarına Bakmak İçin t!yardım t!eskiyardım")
    .setFooter("Yıkık, iyi eğlenceler diler!", client.user.avatarURL);
  member.send(embed);
});

//SUNUCUYA HG//

//rainbow//

client.on("message", async msg => {
  if (msg.content.toLowerCase() === prefix + "rainbow") {
    if (msg.channel.type === "dm") return;
    const rol = "rainbow"; // Rol ismi buraya
    setInterval(() => {
      msg.guild.roles.find(s => s.name === rol).setColor("RANDOM");
    }, 350);
  }
});

//rainbow//

//Kod Yusuf = SONUNDASewgilimGeldiye 'a Aittir.  CODE ARE <3
//Kod Yusuf = SONUNDASewgilimGeldiye 'a Aittir.  CODE ARE <3

client.on("guildMemberAdd", async member => {
  const fs = require("fs");
  let gkanal = JSON.parse(fs.readFileSync("./ayarlar/glog.json", "utf8"));
  const gözelkanal = member.guild.channels.get(gkanal[member.guild.id].resim);
  if (!gözelkanal) return;
  let username = member.user.username;
  if (gözelkanal === undefined || gözelkanal === null) return;
  if (gözelkanal.type === "text") {
    const bg = await Jimp.read(
      "https://cdn.discordapp.com/attachments/561837767324336138/567025914861322248/12.png"
    );
    const userimg = await Jimp.read(member.user.avatarURL);
    var font;
    if (member.user.tag.length < 15)
      font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
    else if (member.user.tag.length > 15)
      font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
    else font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    await bg.print(font, 430, 170, member.user.tag);
    await userimg.resize(362, 362);
    await bg.composite(userimg, 43, 26).write("./img/" + member.id + ".png");
    setTimeout(function() {
      gözelkanal.send(new Discord.Attachment("./img/" + member.id + ".png"));
    }, 1000);
    setTimeout(function() {
      fs.unlink("./img/" + member.id + ".png");
    }, 10000);
  }
});

client.on("guildMemberRemove", async member => {
  const fs = require("fs");
  let gkanal = JSON.parse(fs.readFileSync("./ayarlar/glog.json", "utf8"));
  const gözelkanal = member.guild.channels.get(gkanal[member.guild.id].resim);
  if (!gözelkanal) return;
  let username = member.user.username;
  if (gözelkanal === undefined || gözelkanal === null) return;
  if (gözelkanal.type === "text") {
    const bg = await Jimp.read(
      "https://cdn.discordapp.com/attachments/561837767324336138/567025915348123648/123.png"
    );
    const userimg = await Jimp.read(member.user.avatarURL);
    var font;
    if (member.user.tag.length < 15)
      font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
    else if (member.user.tag.length > 15)
      font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
    else font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    await bg.print(font, 430, 170, member.user.tag);
    await userimg.resize(362, 362);
    await bg.composite(userimg, 43, 26).write("./img/" + member.id + ".png");
    setTimeout(function() {
      gözelkanal.send(new Discord.Attachment("./img/" + member.id + ".png"));
    }, 1000);
    setTimeout(function() {
      fs.unlink("./img/" + member.id + ".png");
    }, 10000);
  }
});

//SAYAÇ//

client.on("message", async message => {
  let sayac = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
  if (sayac[message.guild.id]) {
    if (sayac[message.guild.id].sayi <= message.guild.members.size) {
      const embed = new Discord.RichEmbed()
        .setDescription(
          `Tebrikler, başarılı bir şekilde ${sayac[message.guild.id].sayi} kullanıcıya ulaştık!`
        )
        .setColor("0x808080")
        .setTimestamp();
      message.channel.send({ embed });
      delete sayac[message.guild.id].sayi;
      delete sayac[message.guild.id];
      fs.writeFile("./ayarlar/sayac.json", JSON.stringify(sayac), err => {
        console.log(err);
      });
    }
  }
});
client.on("guildMemberRemove", async member => {
  let sayac = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
  let giriscikis = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
  let embed = new Discord.RichEmbed()
    .setTitle("")
    .setDescription(``)
    .setColor("RED")
    .setFooter("", client.user.avatarURL);

  if (!giriscikis[member.guild.id].kanal) {
    return;
  }

  try {
    let giriscikiskanalID = giriscikis[member.guild.id].kanal;
    let giriscikiskanali = client.guilds
      .get(member.guild.id)
      .channels.get(giriscikiskanalID);
    giriscikiskanali.send(
      `:loudspeaker: ${member.user.tag}, aramızdan ayrıldı, \**${
        sayac[member.guild.id].sayi
      }\** kişi olmamıza \**${sayac[member.guild.id].sayi -
        member.guild.memberCount}\** kişi kaldı!`
    );
  } catch (e) {
    // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
    return console.log(e);
  }
});
