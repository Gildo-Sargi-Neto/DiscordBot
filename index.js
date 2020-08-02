const Discord = require("discord.js")
const client = new Discord.Client()
require("dotenv").config()

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
    if (msg.author.bot) return;

    if (msg.content === "ping") {
        msg.reply("Pong!")
    }

    var Attachment = (msg.attachments).array();
    if (msg.channel.id !== process.env.CHANNEL_PRINTS_ID) {
        if(Attachment.length > 0 && typeof Attachment !== 'undefined') {
            Attachment.forEach(function(attachment) {
                client.channels.fetch(process.env.CHANNEL_PRINTS_ID)
                    .then(channel => channel.send(msg.author.username + ' enviou =   \n' + msg.content, {
                        files: [attachment.url]
                    }))
            })
            msg.delete({timeout: 4000})
        }
    }
})

client.on("voiceStateUpdate", (oldState,newState) => {
    const voiceStatus = newState.selfDeaf;
    const mem = newState.member;
    if (voiceStatus) {
        client.channels.fetch(process.env.AFK_CHANNEL_ID)
            .then(
                channel => mem.voice.setChannel(channel)
            );
    }
  })

client.login(process.env.BOT_TOKEN)
