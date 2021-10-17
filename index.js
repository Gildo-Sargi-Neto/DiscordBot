const Discord = require("discord.js")
const client = new Discord.Client()
require("dotenv").config()
const vision = require('@google-cloud/vision');
const visionClient = new vision.ImageAnnotatorClient({
    credentials: JSON.parse(process.env.VISION_PRIVATE_KEY_AND_CLIENT_EMAIL_JSON),
    projectId: process.env.PROJECT_ID,
});

//detects all text from image and reply it to who write /lepramim
async function detectTextFromImage(imagePath, msg) {
    const [result] = await visionClient.textDetection(imagePath);
    const text = result.textAnnotations;
    msg.reply('\n' + text[0].description)
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
    if (msg.author.bot) return;

    if (msg.content === "ping") {
        msg.reply("Pong!")
    }

    if (msg.content === "-lepramim") {
        msg.channel.messages.fetch(msg.reference.messageID)
            .then(
                message => {
                    attachments = (message.attachments).array();
                    if(attachments.length > 0 && typeof attachments !== 'undefined') {
                        attachments.forEach(function(attachment) {
                            detectTextFromImage(attachment.url, msg);
                        })
                    }
                }
            )
            .catch(console.error);
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
    if (voiceStatus && mem.voice.channelID != process.env.AFK_CHANNEL_ID) {
        client.channels.fetch(process.env.AFK_CHANNEL_ID)
            .then(
                channel => mem.voice.setChannel(channel)
            );
    }
})

client.login(process.env.BOT_TOKEN)
