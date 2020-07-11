const Discord = require("discord.js")
const client = new Discord.Client()
require("dotenv").config()
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})
client.on("message", msg => {
    if (msg.content === "ping") {
        msg.reply("Pong!")
    }
})
client.on("voiceStateUpdate", (oldState,newState) => {
    const voiceStatus = newState.selfDeaf;
    const mem = newState.member;
    if(voiceStatus){
        client.channels.fetch(Process.env.AFK_CHANNEL_ID)
            .then(
                channel => mem.voice.setChannel(channel)
                );
    }
  })

client.login(Process.env.BOT_TOKEN)