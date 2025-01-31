import { container, Container } from "@sapphire/framework";
import { ActionRowBuilder, APIButtonComponentWithCustomId, ButtonBuilder, ButtonInteraction, ButtonStyle, Interaction, Message, TextChannel, TimestampStyles } from "discord.js";
import splitMessage from "./splitMessage";


export default async function updateEmojisList(container: Container) {
    const guild = await container.client.guilds.fetch(container.client._config.mainGuildId).catch(() => null);

    if (!guild) return;

    const logChannel = await guild.channels.fetch(container.client._config.updateChannelId) as TextChannel;

    if (!logChannel) return;

    const message = (await logChannel.messages.fetch()).filter(m => m.author.equals(container.client.user!)).first() as Message

    const emojis = await guild.emojis.fetch()

    const mappedEmojis = emojis.map(emoji => `${emoji.toString()} \`${emoji.toString()}\``).join('\n')

    if (mappedEmojis.length < 1850) return message.edit(`${mappedEmojis}\n\n[<t:${Math.round(Date.now() / 1000)}:f>]`)

    const content = splitMessage(mappedEmojis, { maxLength: 1850, char: [new RegExp(`.{1,1850}`, 'g'), '\n'], append: '', prepend: ''}).flatMap(e => e)

    const button = [
        new ButtonBuilder()
            .setCustomId('$next')
            .setLabel('Next')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('$prev')
            .setLabel('Previous')
            .setStyle(ButtonStyle.Secondary)
    ]

    return await paginatedMessage(button, message, content)
}

async function paginatedMessage(buttonList: ButtonBuilder[], message: Message, content: string[]) {
    let page = 0;
  
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttonList);
  
    const curPage = await message.edit({
      content: content[0] + `\n\nPage ${page + 1} / ${content.length}`,
      components: [row]
    });
  
  
    container.client.on('interactionCreate', async (i: Interaction) => {
        if (!i.isButton()) return;
      switch (i.customId) {
        case (buttonList[0].data as APIButtonComponentWithCustomId)
          .custom_id:
          page = page > 0 ? --page : content.length - 1;
          break;
        case (buttonList[1].data as APIButtonComponentWithCustomId)
          .custom_id:
          page = page + 1 < content.length ? ++page : 0;
          break;
        default:
          break;
      }
      await i.deferUpdate();
      await curPage.edit({
          content: content[page] + `\n\nPage ${page + 1} / ${content.length}`,
        components: [row]
      });
    });
  
    return curPage;
  }