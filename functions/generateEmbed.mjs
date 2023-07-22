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

export async function generate3Column2RowsEmbed(title, description, col1Title, col1Desc, col2Title, col2Desc, col3Title, col3Desc, col4Title, col4Desc, col5Title, col5Desc, col6Title, col6Desc, color) {
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
            .addFields(
                { name: col4Title, value: col4Desc, inline: true },
                { name: col5Title, value: col5Desc, inline: true },
                { name: col6Title, value: col6Desc, inline: true },
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