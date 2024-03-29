// IMPORTS
import { Client, GatewayIntentBits, Collection, Events, InteractionCollector, EmbedBuilder } from "discord.js"
import { discordAPIKey, channelID } from "./config.mjs"
import { setTimeout } from "timers/promises"
import { generateMessage } from "./functions/generateMessage.mjs"
import { generateWorld } from "./functions/generateWorld.mjs"
import { generateEmbed, generate3ColumnEmbed, generate3Column2RowsEmbed } from "./functions/generateEmbed.mjs"
import { sanitise } from "./functions/sanitise.mjs"
import { truncate } from "./functions/truncate.mjs"
import { defaultPresetClio, defaultListPresetClio, defaultDescPresetClio } from "./functions/presets.mjs"
import { world } from "./saves.mjs"
import { summariseWorld, list, getName, generateNode, generateDescription, getRarity, useNode } from "./functions/sysFunctions.mjs"
import random  from 'random'
import fs from 'fs'

// EXPORTS
export const colors = { info:"#2596be", alert:"#D0342C", success:"#ffcc5f" }
export var ids = [] //list of all ids in use
export const rarities = [ 
    { name: 'common', cutoff: 0 },
    { name: 'uncommon', cutoff: 50 },
    { name: 'rare', cutoff: 75 },
    { name: 'epic', cutoff: 85 },
    { name: 'relic', cutoff: 99 } 
]

// GLOBALS
var channel = ""
var messages = []
var worldTimer = 0
var commands = [
    { name: '!buy', description: 'buy the referenced node e.g. !buy|E5001' }, 
    { name: '!inspect', description: 'inspect the properites of the referenced node e.g. !inspect|E5001' }, 
    { name: '!fight', description: 'initiate combat with referenced node e.g. !fight|E5001' }, 
    { name: '!generateWorld', description: 'generates a new world (admin only)' }, 
    { name: '!help', description: 'display a list of commands' }, 
    { name: '!players', description: 'shows all current players' }, 
    { name: '!sell', description: 'sell the referenced node e.g. !sell|E5001' }, 
    { name: '!talk', description: 'initiates a conversation with a node e.g. !talk|E5001' },
    { name: '!use', description: 'initiates a scene with a particular node e.g. !use|E5001|eat' },
    { name: '!world', description: 'provides a summary of current world' }
]
const msgLength = { veryshort:15000, short:30000, medium:60000, long:120000, verylong:240000 }

// INTENTS
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
	],
}); client.login(discordAPIKey);

// BEGIN
client.on("ready", async () => {
    channel = client.channels.cache.get(channelID) // decide channel
    await channel.send({ embeds: [await generateEmbed('What\'s that?', 'A wild `Cunt` appears!', colors.info)] })

    //FIX SCRIPT, REMOVE WHEN DONE
    //world.nodes.forEach((node) => { if (node.origin) node.origin = "B0000", console.log(node) })
 })

// EVENTS
setInterval(async() => {
    //Regularly update world save
    fs.writeFileSync('./saves.mjs', 'export const world = ' + JSON.stringify(world), (err) => {
        console.log('Data saved successfully.')
    })

    // Check if 15 minutes has passed, and if so, generate new world
    try { messages[messages.length-1].time } catch { return } //try to get latest message time, otherwise return
    if (new Date() - worldTimer > 900000) { //if 15 minutes have elapsed since last shop, and can get latest message

        // Generate new world
        worldTimer = new Date() //reset shop timer
        var newWorld = await generateWorld()
                world.name = newWorld.name
                world.description = newWorld.description
                world.id = newWorld.id
                for(var i = 0; i < newWorld.nodes.length; i++) world.nodes.push(newWorld.nodes[i])

        // Send summary to channel
        channel.send({ embeds: [await summariseWorld(world)] })
    }
}, 60000); //check every 1 minute check whether 15 minutes has elapsed

// ON MESSAGE
client.on("messageCreate", async (message) => {

    // If no message, don't bother
    if (!message) return

    // Log user nickname, use username if none available
    if (message.guild.members.cache.get(message.author.id).nickname) message.member.nickname = sanitise(message.guild.members.cache.get(message.author.id).nickname)
        else sanitise(message.member.nickname = message.member.user.username) 

    try { message.embeds[0].description.length > 1, message.content = message.embeds[0].description, message.member.nickname = 'System' } catch { } //try to make embed description message.content
        messages.push({ "id":message.id, "parent":message.reference, "time":message.createdTimestamp, "author":message.member.nickname, "content":sanitise(message.content) }) //push latest message to messages array
        if ((message.channel.id == channel) && (!message.author.bot) && ((message.content.includes('1068439682460942407') || message.mentions.has(client.user)))) { //if message is in main channel, doesn't come from bot, includes or mentions bot

        // If player doesn't yet exist, create a node for them
        if (!world.nodes.some(node => node.name === message.member.user.username)) world.nodes.push(generateNode(message.member.user.username, 'player', 50, 50, 'Sigurdistan', null))

        // Log player for future interactions
        var playerIndex = world.nodes.findIndex(node => node.name == message.member.user.username)

        // Give brahcoin for interaction
        world.nodes[playerIndex].ḇ++

        if (message.content.includes('!test')) {
            var prompt = message.content.split('!test')
            var test = await list(prompt[1], 5)
            replyUser(message, test.join(","), false)
        }
        
        // Buy item
        else if (message.content.includes('!buy')) {

            // Search for node, return if none found
            var itemIndex = await validateInput(message, 2)
            if (!itemIndex) return

            // Check that node isn't a player
            if (world.nodes[itemIndex].type == 'player') {
                replyUser(message, await generateEmbed('Error', '`' + world.nodes[itemIndex].name + '` cannot be bought as they are a player.', colors.alert), true)
                return
            }

            // Check that node isn't owned by a player
            if (world.nodes[itemIndex].owner != null) {
                var ownerIndex = world.nodes.findIndex(node => node.id === world.nodes[itemIndex].owner)
                    if (itemIndex === -1) {
                        replyUser(message, await generateEmbed('Error', '`Could not find item owner, `#' + world.nodes[itemIndex].owner, colors.alert) + '`.', true)
                        return
                    }
                    if (world.nodes[ownerIndex].type == 'player') {
                        replyUser(message, await generateEmbed('Error', '`' + world.nodes[itemIndex].name + '` cannot be bought. It is already owned by `' + world.nodes[ownerIndex].name + '`.', colors.alert), true)
                        return
                    }
            }

            // Check that player does not own too many items already
            var playerItemsCount = world.nodes.filter(node => node.owner === world.nodes[playerIndex].id).length
                if (playerItemsCount >= 12) {
                    replyUser(message, await generateEmbed('Error', 'You have exceeded the item limit.', colors.alert), true)
                    return
                }

            // Check player can afford item
            if (world.nodes[playerIndex].ḇ < world.nodes[itemIndex].ḇ) {
                replyUser(message, await generateEmbed('Error', 'You cannot afford `' + + world.nodes[itemIndex].ḇ + 'ḇ`. You have `' + world.nodes[playerIndex].ḇ + 'ḇ`.', colors.alert), true)
                return
            }

            // Transfer ownership to player and deduct ḇ
            world.nodes[itemIndex].owner = world.nodes[playerIndex].id
            world.nodes[playerIndex].ḇ += -world.nodes[itemIndex].ḇ

            // Generate description if not available
            if (world.nodes[itemIndex].description == null) world.nodes[itemIndex].description = await generateDescription(world.nodes[itemIndex])

            replyUser(message, await generateEmbed(world.nodes[itemIndex].name + " #" + world.nodes[itemIndex].id, "You buy `" + world.nodes[itemIndex].name +'` for `' + world.nodes[itemIndex].ḇ + 'ḇ`. You now have `' + world.nodes[playerIndex].ḇ + 'ḇ`\n\n' + world.nodes[itemIndex].description, colors.success), true)
        }

        // Sell a node
        else if (message.content.includes('!sell')) {

            // Search for node, return if none found
            var itemIndex = await validateInput(message, 2)
            if (!itemIndex) return

            // Check player owns item
            if (world.nodes[itemIndex].owner != world.nodes[playerIndex].id) {
                replyUser(message, await generateEmbed('Error', 'You do not own `' + world.nodes[itemIndex].name + '`', colors.alert), true)
                return
            }

            // Remove ownership and renumerate player
            world.nodes[itemIndex].owner = null
            world.nodes[playerIndex].ḇ += world.nodes[itemIndex].ḇ

            replyUser(message, await generateEmbed(world.nodes[itemIndex].name + " #" + world.nodes[itemIndex].id, "You sell `" + world.nodes[itemIndex].name +'` for `' + world.nodes[itemIndex].ḇ + 'ḇ`. You now have `' + world.nodes[playerIndex].ḇ + 'ḇ`.', colors.success), true)
        }

        // Fight a node
        else if (message.content.includes('!fight')) {
            var actionLog = ""
            var playerHP = random.int(10,20)
            var nodeHP = random.int(10,20)
            var playerWeapons = []
            var nodeWeapons = []
            var replyColor = ""

            // Search for node, return if none found
            var nodeIndex = await validateInput(message, 2)
                if (!nodeIndex) return

            // Log player items
            world.nodes.forEach((node) => { if (node.owner == world.nodes[playerIndex].id) playerWeapons.push(node) })

            // Generate node description if not available
            if (world.nodes[nodeIndex].description == null) world.nodes[nodeIndex].description = await generateDescription(world.nodes[nodeIndex])

            // Generate node inventory if none available and not a player
            if (!world.nodes.some(node => node.owner === world.nodes[nodeIndex].id && node.type != 'player')) {
                var items = await list("[Fishing supplies. This is a fishing shop on the outskirts of town, selling a variety of rods and bait supplies. Items you'd find here include]Fishing Rod,Bait,Fresh Fish,Strong Net,Line,Fish Tank,Deluxe Travelling Bag,Fishing Book,Bobbler,Sunglasses,[Shady Opium Den. Nestled in the heart of a dimly lit alley, the Shady Opium Den exudes an air of mystery and allure, its smoke-filled rooms veiling secrets and whispered tales of forbidden pleasures. Items you'd find in its inventory include]Opium Pipe,Drug Baggy,Fine Oriental Decor,Drool,Incense Burner,Used Opium Lamp,Lounging Bed,Instruction Manual,[Necromancer. He exudes an air of sophisticated evil, his cloak swaying as if upheld by its own gravity. In his hand is a dark, wooden staff. Items you'd find in its inventory include]Forboding Potion,Shrivelled Body,Evil Wooden staff,Tattered Black robes,Fifty Gold Coins,Fake Eyeball,Gloves,Sense of Doom,Belt Containing Putrid Vials,[The Ancient Armoury. Nestled within the heart of a forgotten city, The Ancient Armoury stands as a solemn testament to a bygone era, its weathered stone walls and rusted iron gates guarding a treasure trove of battle-worn artifacts and whispered tales of valor and conquest. Items you'd find in its inventory include]Steel Battleaxe,Mace,Polished Knights Armour,Hound,Coat of Arms,Hammer,Quiver of Arrows,Map,Trusty Steed,[Jason's Jeans. Nestled in a quaint corner of town, 'Jason's Jeans' emanates a timeless charm with its rustic storefront adorned with faded denim patches, inviting passersby to step into a denim lover's haven, where rows upon rows of meticulously displayed jeans tell stories of style, comfort, and authenticity. Items you'd find in its inventory include]Pair of Jeans,Quality Shirt,Boat Shoes,Fake Leather Boots,Beanie,Wide-brimmed Hat,Torn Jeans,Rockstar Jeans,Shorts,[President. She stares through you as if totally unaware of your presence. She wears a flashy blue suit and holds a clipboard and pen. Items in their inventory include]Flashy Business Suit,Pen and Clipboard,Glasses,Code to Nuclear Bombs,Cellular Phone,Line of Cocaine,Briefcase,[Eastville Eatery. It beckons with its vibrant ambiance, offering a culinary haven where the tantalizing aromas of diverse cuisines mingle harmoniously, promising a gastronomic journey for every palate. Items you'd find in its inventory include]Recently Roasted Chicken,Potato Gems,Sausage and Eggs,Coca Cola,Deep Fried Fish,Burger,Mars Bar,Pizza,[ " + world.nodes[nodeIndex].name + ". " + world.nodes[nodeIndex].description + "Items you'd find in its inventory include]", random.int(4,7))                
                    for(var i = 0; i < items.length; i++) {
                        items[i] = await generateNode(items[i], 'item', 1, 50, world.nodes[nodeIndex].name, world.nodes[nodeIndex].id)
                            world.nodes.push(items[i]) // Store item in world with shop as owner
                }
            }

            // Log node items
            world.nodes.forEach((node) => { if (node.owner == world.nodes[nodeIndex].id) nodeWeapons.push(node) })

            // Give generic fist weapon if none available
            var fist = { name:'fists', rarity:50, ḇ:100 }
            if (playerWeapons.length == 0) playerWeapons.push(fist)
            if (nodeWeapons.length == 0) nodeWeapons.push(fist)

            // Provide icons to indicate damage
            function decorateDamage(num) {
                if (num == 0) return '🛡️'
                if (num <= 5) return '❤️'
                if (num <= 100) return '💔'
            }

            // Generate a reward
            function getReward(weapons) {
                var difficulty = 0
                for (var i = 0; i < weapons.length; i++) {
                    difficulty += weapons[i].rarity
                }
                return Math.round((difficulty/weapons.length)/20) //return reward
            }

            // Generate fight
            while (playerHP > 0 && nodeHP > 0) {
                // Use a random item per combat action, and use its rarity to determine damage
                var playerWeapon = playerWeapons[random.int(0,playerWeapons.length-1)]
                var nodeWeapon = nodeWeapons[random.int(0,nodeWeapons.length-1)]
                var playerDamage = random.int(0,Math.round(playerWeapon.rarity/10))
                var nodeDamage = random.int(0,Math.round(nodeWeapon.rarity/10))

                // Log damage
                actionLog += "\nThey attack with their " + nodeWeapon.name + " for " + nodeDamage + decorateDamage(nodeDamage)
                playerHP += -nodeDamage
                    if (playerHP <= 0) break
                actionLog += "\nYou attack with your " + playerWeapon.name + " for " + playerDamage + decorateDamage(playerDamage)
                nodeHP += -playerDamage
                    if (nodeHP <= 0) break
            }

            // If player loses, give ḇ to node and deduct from players
            if (playerHP <= 0) { 
                actionLog += "\n\nYou lose! The `" + world.nodes[nodeIndex].name + "` takes `" + getReward(playerWeapons) + "ḇ` from you."
                world.nodes[playerIndex].ḇ += -getReward(playerWeapons)
                replyColor = colors.alert
            }
            else if (nodeHP <= 0) {
                actionLog += "\n\nYou win! You take `" + getReward(nodeWeapons) + "ḇ` from the `" + world.nodes[nodeIndex].name + "`."
                world.nodes[playerIndex].ḇ += getReward(nodeWeapons)
                replyColor = colors.success
            }

            replyUser(message, await generateEmbed('Fight with ' + world.nodes[nodeIndex].name + " #" + world.nodes[nodeIndex].id, actionLog, replyColor), true)
        }
        
        // Inspect a node
        else if (message.content.includes('!inspect')) {
            var inventory = ""

            //Assume searching for self
            nodeIndex = playerIndex

            //If bar included, search for node instead
            if (message.content.includes('!inspect|')) {
                var nodeIndex = await validateInput(message, 2)
                if (!nodeIndex) return
            }

            // Generate description if not available
            if (world.nodes[nodeIndex].description == null) world.nodes[nodeIndex].description = await generateDescription(world.nodes[nodeIndex])

            // Generate inventory if none available
            if (!world.nodes.some(node => node.owner === world.nodes[nodeIndex].id)) {
                var items = await list("[Fishing supplies. This is a fishing shop on the outskirts of town, selling a variety of rods and bait supplies. Items you'd find here include]Fishing Rod,Bait,Fresh Fish,Strong Net,Line,Fish Tank,Deluxe Travelling Bag,Fishing Book,Bobbler,Sunglasses,[Shady Opium Den. Nestled in the heart of a dimly lit alley, the Shady Opium Den exudes an air of mystery and allure, its smoke-filled rooms veiling secrets and whispered tales of forbidden pleasures. Items you'd find here include]Opium Pipe,Drug Baggy,Fine Oriental Decor,Drool,Incense Burner,Used Opium Lamp,Lounging Bed,Instruction Manual,[The Ancient Armoury. Nestled within the heart of a forgotten city, The Ancient Armoury stands as a solemn testament to a bygone era, its weathered stone walls and rusted iron gates guarding a treasure trove of battle-worn artifacts and whispered tales of valor and conquest. Items you'd find here include]Steel Battleaxe,Mace,Polished Knights Armour,Hound,Coat of Arms,Hammer,Quiver of Arrows,Map,Trusty Steed,[Jason's Jeans. Nestled in a quaint corner of town, 'Jason's Jeans' emanates a timeless charm with its rustic storefront adorned with faded denim patches, inviting passersby to step into a denim lover's haven, where rows upon rows of meticulously displayed jeans tell stories of style, comfort, and authenticity. Items you'd find here include]Pair of Jeans,Quality Shirt,Boat Shoes,Fake Leather Boots,Beanie,Wide-brimmed Hat,Torn Jeans,Rockstar Jeans,Shorts,[Eastville Eatery. It beckons with its vibrant ambiance, offering a culinary haven where the tantalizing aromas of diverse cuisines mingle harmoniously, promising a gastronomic journey for every palate. Items you'd find here include]Recently Roasted Chicken,Potato Gems,Sausage and Eggs,Coca Cola,Deep Fried Fish,Burger,Mars Bar,Pizza,[ " + world.nodes[nodeIndex].name + ". " + world.nodes[nodeIndex].description + "Items you'd find here include]", random.int(4,7))
                for(var i = 0; i < items.length; i++) {
                    items[i] = await generateNode(items[i], 'item', 1, 50, world.nodes[nodeIndex].name, world.nodes[nodeIndex].id)
                        world.nodes.push(items[i]) // Store item in world with shop as owner
                }
            }

            // Log inventory
            world.nodes.forEach((node) => { if (node.owner == world.nodes[nodeIndex].id) inventory += "\n" + node.name + " `" + node.ḇ + "ḇ` `#" + node.id + "`" + " `" + getRarity(node.rarity) + "`" })

            replyUser(message, await generate3Column2RowsEmbed(
                world.nodes[nodeIndex].name, 
                world.nodes[nodeIndex].description + "\n\n**Inventory**" + inventory + "\n ᲼᲼",
                'ID', 
                '#' + world.nodes[nodeIndex].id, 
                'Type', 
                sanitise(world.nodes[nodeIndex].type), 
                'Rarity', 
                sanitise(getRarity(world.nodes[nodeIndex].rarity)),
                'Value', 
                world.nodes[nodeIndex].ḇ + "ḇ",
                'Owner', 
                getName(world.nodes, world.nodes[nodeIndex].owner),
                'Origin', 
                getName(world.nodes, world.nodes[nodeIndex].owner),
                colors.info), 
                true
            )}

        // Generate new world
        else if (message.content.includes('!generateWorld')) {
            if (message.author.id != 357080117346041858) return // don't do if not Tibby

            // Replace current name and description, and add newly generated nodes to historic node list.
            var newWorld = await generateWorld()
                world.name = newWorld.name
                world.description = newWorld.description
                world.id = newWorld.id
                for(var i = 0; i < newWorld.nodes.length; i++) world.nodes.push(newWorld.nodes[i])

            // Send summary
            replyUser(message, await summariseWorld(world), true)
        }

        // Summarise the current world
        else if (message.content.includes('!world')) {
            replyUser(message, await summariseWorld(world), true)
        }

        // Initiate conversation with node
        else if (message.content.includes('!talk|')) {
            // Search for node, return if none found
            var nodeIndex = await validateInput(message, 2)
            if (!nodeIndex) return

            // Generate description if not available
            if (world.nodes[nodeIndex].description == null) world.nodes[nodeIndex].description = await generateDescription(world.nodes[nodeIndex])

            replyUser(message, await generateEmbed('New conversation', "You are now chatting with `" + world.nodes[nodeIndex].name +'`.\n\n' + world.nodes[nodeIndex].description, colors.success), true)
        }

        // Show list of players
        else if (message.content.includes('!players')) {
            var result = ""

            // Search for items with player as owner
            try { world.nodes.forEach((node) => { if (node.type == 'player') result += "\n" + node.name + " `" + node.ḇ + "ḇ` `#" + node.id + "`" }) } catch { return }
            
            replyUser(message, await generateEmbed('Players', result, colors.info), true)
        }

        // Use a node
        else if (message.content.includes('!use|')) {
            // Search for node, return if none found
            var nodeIndex = await validateInput(message, 3)
            if (!nodeIndex) return

            // Generate action
            var useMessage = await useNode(world.nodes[nodeIndex].name, message.content.split(2))

            replyUser(message, await generateEmbed(world.nodes[nodeIndex].name + " #" + world.nodes[nodeIndex].id, useMessage, colors.success), true)
        }

        // See current commands
        else if (message.content.includes('!help')) {
            var commandString = ''
            for (var i = 0; i < commands.length; i++) {
                commandString += '`' + commands[i].name + '` - ' + commands[i].description + '\n'
            }
            
            replyUser(message, await generateEmbed('Commands', commandString, colors.info), true)
        }

        // Else treat as a conversation
        else {
            var query = messages[messages.length-1] //start query at latest message
            var prompt = []

            // Define 'system' character in case no character found
            var character = {
                name:'Enward',
                description:'Enward is a yellow guy with a smile and large, beckoning eyes. He is well-mannered, talkative, and respectful of others.'
            }

            var exitLoop = false
            while (typeof query !== 'undefined' && !exitLoop) { //so long as query does not fail to find another message, and exitloop flag hasn't been triggered
                try { 
                    //If a talk request is found, log the character and quit, otherwise log the message
                    if (query.content.includes('!talk|')) {
                        var searchId = query.content.split('!talk|')[1]
                        var result = ""
                        try { world.nodes.forEach((node) => { if (node.id == searchId) character = node; exitLoop = true }) } catch { return }
                    } 
                    
                    //If a command, exit loop
                    else if (commands.some((command) => query.content.includes(command.name))) exitLoop = true 

                    //Log unless part of the talk response
                    else if (!query.content.includes('You are now chatting with')) prompt.unshift(sanitise(query.author) + ': ' + sanitise(query.content))

                    query = messages.find(function(messages) { return messages.id === query.parent.messageId })
                } 
                catch { 
                    query = undefined
                }
            }

            // Enter character description, then chat history, then prime their latest response
            prompt = prompt.join("\n")
            prompt = prompt.replace(/Enward:/g, character.name + ':')
            prompt = '[' + character.name + '. ' + character.description + ']\n' + prompt + '\n' + character.name + '[replying to ' + message.member.nickname + ']:'

            //console.clear()
            console.log(prompt)

            if (prompt.length > 8000) prompt = prompt.substring(prompt.length - 8000) //ensure prompt is less than ~4000 tokens
            
            var response = await generateMessage(prompt, 'clio-v1', defaultPresetClio)
                response = truncate(response, 2, 4)
                response = sanitise(response)
                response = ('(as ' + character.name + '): ') + response
            replyUser(message, response, false)
        }
    }
})

//reply to user async
async function replyUser(message, response, system) {
    // If no message, return 'undefined'
    if (message == undefined) { 
        console.log('Error: Undefined message')
        return 
    }

    // If embed, reply immediately
    if(system) {
        var response = message.reply({ embeds: [response] }).catch(error => {console.error(`Error sending message: ${error}`)})
        return response;
    }

    // If normal message, delay by 10 seconds to avoid spam
    else {
        message.channel.sendTyping().catch(error => {console.error(`Error typing to message: ${error}`)})
        await setTimeout(10000)
        message.reply(response).catch(error => {console.error(`Error sending message: ${error}`)})
    }
}

async function deleteMessage(message, timer) {
    await setTimeout(timer)
    channel.messages.delete(message.id).catch(error => {console.error(`Error deleting message: ${error}` + ' ' + message)})
}

// Generate an unused ID
export function getId() {
    // Generate a random number between 1000 and 9999
    const randomNumber = Math.floor(Math.random() * 9000) + 1000
  
    // Generate a random letter between 'A' and 'Z'
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
  
    // Concatenate the random letter and number
    const randomID = randomLetter + randomNumber
  
    // Check if the random ID already exists in the array
    for (let i = 0; i < world.nodes.length; i++) {
        if (world.nodes[i].id === randomID) {
            return getId()
        }
    }
  
    // Return the generated random ID
    return randomID
}


// Validate whether the input matches the expected length, and if targeted node exists
async function validateInput(message, segments) {
    var string = message.content.split('|')
    var valid = true

    // Validate length
    if (string.length != segments) valid = false

    // Validate node
    var nodeIndex = world.nodes.findIndex(node => node.id === string[1])
    if (nodeIndex === -1) valid = false

    // If valid, return the node index, else return false
    if (valid) return nodeIndex
    else {
        replyUser(message, await generateEmbed('Error', 'Invalid input.', colors.alert), true)
        return false
    } 
}