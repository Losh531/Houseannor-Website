const Discord = require('discord.js')

module.exports = {
	name: 'dashboard',
	description: "lol",
	args: false,
  supportonly: false,
  guildonly: false,
  usage: "",
  owneronly: true,
	async execute(message, args, prefix) {
    const client = message.client

    const manageServerRoles = message.member.roles.cache.filter(role => role.permissions.has(0x00000020))

    if (!manageServerRoles.size) return message.channel.send("You don't have enough permissions to run this command.")
  
    await message.channel.send(`Here is your ~~non-functioning~~ dashboard! https://Houseannor-Website.HouseannorTeam.repl.co/dashboard/${message.guild.id}`)
	},
};