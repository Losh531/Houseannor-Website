const Discord = require('discord.js')

module.exports = {
	name: 'lol',
	description: "lol",
	args: false,
  supportonly: false,
  guildonly: false,
  usage: "",
  owneronly: true,
	async execute(message, args, prefix) {
    const client = message.client
  
    await message.channel.send("lol")
	},
};