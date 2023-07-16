// IMPORTS
import { EmbedBuilder } from "discord.js";
import { colors } from "../../NovelAPI/enwardRPG.mjs";

// Regular embed
export async function generateEmbed(title, description, color,) {
    if (title.length >= 256) title = title.substring(title.length - 256) //ensure title is less than ~256 char
    if (description.length >= 2048) description = description.substring(description.length - 2048) //ensure desc is less than ~2048 char
    try {
        var embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp()
        return embed;
    } catch {
        var embed = new EmbedBuilder()
            .setColor(colors.alert)
            .setTitle('System')
            .setDescription('There was an issue generating an embed message.')
            .setTimestamp()
        return embed;
    }
}

// Complex embed
export async function generate3ColumnEmbed(title, description, col1Title, col1Desc, col2Title, col2Desc, col3Title, col3Desc, color) {
    if (title.length >= 256) title = title.substring(title.length - 256) //ensure title is less than ~256 char
    if (description.length >= 2048) description = description.substring(description.length - 2048) //ensure desc is less than ~2048 char
    try {
        var embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .addFields(
                { name: col1Title, value: col1Desc, inline: true },
                { name: col2Title, value: col2Desc, inline: true },
                { name: col3Title, value: col3Desc, inline: true },
            )
            .setTimestamp()
        return embed;
    } catch {
        var embed = new EmbedBuilder()
            .setColor(colors.alert)
            .setTitle('System')
            .setDescription('There was an issue generating an embed message.')
            .setTimestamp()
        return embed;
    }
}