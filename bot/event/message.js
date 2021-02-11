const Discord = require('discord.js')
const prefix = "hw!"

module.exports = (message) => {
  if (message.author.bot) return

  if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = message.client.commands.get(commandName)
		|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

  if (command.guildOnly && message.channel.type === 'dm') {
		return message.channel.send(new Discord.MessageEmbed().setColor("FF0000").setDescription(`That command can't be executed within DMs ${message.author}!`))
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(new Discord.MessageEmbed().setColor("FF0000").setDescription(reply));
	}

  if (command.owneronly && ["708042832237297665", 
  "349936436373618689", "400182710284582912", "471589269379612684", "573208975143862283", "658650587679948820"].includes(message.author.id) == false) {
    return message.channel.send(new Discord.MessageEmbed().setColor("FF0000").setDescription("Only bot owners can use this command! (That's Losh, Toblerone, Homeannor, Chelsea and Haroon)"))
  }

	try {
    command.execute(message, args, prefix)
	} catch (error) {
		console.error(error);
		message.reply('could not execute that command: ' + error.message);
	}
}