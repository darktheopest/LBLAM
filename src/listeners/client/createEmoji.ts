import { Events, Listener } from "@sapphire/framework";
import { Message } from "discord.js";

export default class createEmoji extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            event: Events.MessageCreate
        })
    }
    public async run(message: Message) {
        if (message.author.bot
            || message.channelId !== '1334795112881979394'
            || message.content
            || !message.attachments
        ) return;

        for (const attachment of message.attachments) {
            const url = attachment[1].url
            const name = attachment[1].name.replace(/\.[^/.]+$/, '');
            const cleanName = name.replace(/[^a-zA-Z]/g, '');
            await message.guild?.emojis.create({
                attachment: url,
                name: cleanName
            })
            .then(async(emoji) => await Promise.all([await message.react('1334552775073468510'), await message.react(emoji)]))
            .catch(async(error) => await message.react('1334553266544967740').then(() => this.container.client.logger.error(error)))
        }
    }
}