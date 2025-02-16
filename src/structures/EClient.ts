/**
 ▄█        ▄██████▄     ▄████████   ▄▄▄▄███▄▄▄▄      ▄████████    ▄████████ 
███       ███    ███   ███    ███ ▄██▀▀▀███▀▀▀██▄   ███    ███   ███    ███ 
███       ███    ███   ███    ███ ███   ███   ███   ███    ███   ███    █▀  
███       ███    ███  ▄███▄▄▄▄██▀ ███   ███   ███   ███    ███   ███        
███       ███    ███ ▀▀███▀▀▀▀▀   ███   ███   ███ ▀███████████ ▀███████████ 
███       ███    ███ ▀███████████ ███   ███   ███   ███    ███          ███ 
███▌    ▄ ███    ███   ███    ███ ███   ███   ███   ███    ███    ▄█    ███ 
█████▄▄██  ▀██████▀    ███    ███  ▀█   ███   █▀    ███    █▀   ▄████████▀  
▀                      ███    ███                                           
 * Code generated by Lormas Bot Lab
 * All code in this folder belongs to Lormas Bot Lab
 * For any rights, contact support@lormas.net

*/

import { LogLevel, Logger, SapphireClient } from '@sapphire/framework';
import config from '../config';
import { ActivityType, Partials } from 'discord.js';

export default class EClient extends SapphireClient {
	public _config: typeof config;
	public constructor() {
		super({
			defaultPrefix: config.prefix,
			intents: [
				'Guilds',
				'GuildMessages',
				'MessageContent',
				'GuildEmojisAndStickers'
			],
			caseInsensitiveCommands: true,
			caseInsensitivePrefixes: true,
			failIfNotExists: true,
			loadDefaultErrorListeners: true,
			loadApplicationCommandRegistriesStatusListeners: true,
			loadMessageCommandListeners: true,
			logger: new Logger(LogLevel.Debug),
			presence: {
				activities: [
					{
						name: 'Lormas Bot Lab',
						type: ActivityType.Watching
					}
				]
			},
			partials: [
				Partials.Channel,
				Partials.GuildMember,
				Partials.Message,
				Partials.User,
			]
		});
		this._config = config;
	}
	public start() {
		return super.login(this._config.token);
	}
}