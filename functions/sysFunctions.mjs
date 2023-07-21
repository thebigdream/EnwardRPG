// IMPORTS
import random  from 'random';
import { defaultListPresetClio, defaultPresetClio, defaultDescPresetClio } from "./presets.mjs"
import { generateMessage } from "./generateMessage.mjs"
import { generateEmbed, generate3ColumnEmbed } from "./generateEmbed.mjs"
import { sanitise } from "./sanitise.mjs"
import { truncate } from "./truncate.mjs"
import { getId, rarities } from "../../NovelAPI/enwardRPG.mjs"
import { colors } from "../../NovelAPI/enwardRPG.mjs"

// Provide an embedded summary of the world
export async function summariseWorld(world) {
        var title = world.name
        var description = world.description
        var col1Title = 'Landmarks'
        var col1Desc = ""
            world.nodes.forEach((node) => {
                if ((node.type == 'landmark') && node.origin == world.name) col1Desc += node.name + " `#" + node.id + "`\n"
            })
            if (col1Desc == "") col1Desc = "null"
        var col2Title = 'NPCs'
        var col2Desc = ""
            world.nodes.forEach((node) => {
                if ((node.type == 'character') && node.origin == world.name) col2Desc += node.name + " `#" + node.id + "`\n"
            })
            if (col2Desc == "") col2Desc = "null"
        var col3Title = 'Businesses'
        var col3Desc = ""
            world.nodes.forEach((node) => {
                if ((node.type == 'business') && node.origin == world.name) col3Desc += node.name + " `#" + node.id + "`\n"
            })
            if (col3Desc == "") col3Desc = "null"
        var embed = await generate3ColumnEmbed(title, description, col1Title, col1Desc, col2Title, col2Desc, col3Title, col3Desc, colors.info)  
        return embed
}

// Generate node
export function generateNode(name, type, minVal, maxVal, origin, owner, id) {
    var node = ({
            name:name,
            description:null,
            type:type,
            id:getId(),
            rarity:random.int(1,100),
            ḇ:random.int(minVal,maxVal),
            origin:origin,
            owner:owner,
            flags:[],
        })
    // Increase value based on rarity
    node.ḇ = Math.round(node.ḇ + (node.ḇ * (node.rarity / 25)))
    return node
}

// Generate description of thing
export async function generateDescription(node) {
    var description = await generateMessage("[Description of a guard]Standing tall and resolute, the guard embodies unwavering dedication and unwavering vigilance. Adorned in a pristine uniform, their presence commands respect and conveyed a sense of authority. With a chiseled jawline and piercing eyes, their stern countenance mirrors their unwavering commitment to maintaining order and safeguarding those under their charge.[Description of a sword]This is a weapon that epitomizes strength and elegance. Crafted with precision, it boasts a single-edged blade made from high-quality steel, honed to a razor-sharp edge. The hilt is adorned with a sturdy and intricately designed guard, offering protection and enhancing the wielder's grip. Its grip is wrapped in supple leather, ensuring comfort and control during combat.[Description of a mansion]Nestled amidst lush landscapes, the majestic mansion stands as a testament to grandeur and opulence. Its imposing façade exudes a harmonious blend of architectural brilliance, adorned with intricate details and a symphony of exquisite materials. Towering columns flank the entrance, inviting guests into a world of refined elegance.[Description of a planet]This is a mesmerizing planet located in the Epsilon Eridani star system, approximately 10.5 light-years away from Earth. It boasts a breathtaking array of vibrant landscapes, making it a celestial marvel worth exploring. The planet's surface is adorned with sprawling forests, vast plains, and shimmering bodies of water that reflect the vibrant hues of its double suns.[Description of a " + node.type + " named " + node.name + "]", 'clio-v1', defaultDescPresetClio)
    description = truncate(description,2,3)
    return description
}

export async function list(prompt, num) {
    var list

    // Generate list
    for (var generated = false; generated!= true;) {
        list = await generateMessage(prompt, 'clio-v1', defaultListPresetClio)
        if (list != undefined && list.includes(',') && !list.includes('.') && !list.includes('!') && !list.includes('?') && !list.includes('[') && !list.includes(']') && list.length > num) {
            generated = true
    }}

    // Trim list
    list = list.split(',')
    list = list.splice(0, num)
    if (num == 1) list = list[0] //don't return as array if one requested

    // Return list
    return list
}

// Return the rarity of a thing
export function getRarity(num) {
    var rarity = ""
    for (var i = 0; i < rarities.length; i++) {
        if (num > rarities[i].cutoff) rarity = rarities[i].name
    }
    return rarity
}

// Use a node
export async function useNode(object, action) {
    var useMessage = await generateMessage('[Action:Fire|Thing:Gun]You fire the gun at an opposing soldier, wounding him in the arm. He falls to the ground, screaming in agony. You kick his weapon away.[Action:Sing a song to|Thing:Dog]A beautiful song erupts from your lips. The dog\'s ears perk up, and it begins bobbing its head to every note. You can\'t believe how good you sound.\n[Action:Release|Item:Thing]:You release the bird into the wild, watching as it flies upward into the cloud. Tears well in your eyes, it is so immeasurably beautiful being among nature.[Action:Visit|Thing:Iraq]You board a flight to the Northern provinces of Iraq. The mountains there are beautiful, and a guide shows you around to hidden and ancient places. You feel rewarded for undertaking such an adventure.[Action:Do the Moonwalk|Thing:Funeral]You want to dance so badly that in spite of your good conscience, you stand up in the middle of the funeral and begin moonwalking down the aisle. The bereaved are torn between being outraged by your impetuity or amazed by your dance moves. They settle for standing there with their mouths agape until you are done.[Action:Eat|Thing:Drywall]It\'s been awhile since the last ate, and so you walk over to your favourite drywall and take a large chomp out of it. The taste is indescribable. You love drywall. You just hope no one saw you do it.[Action:' + action + '|Thing:' + object + ' :]', 'clio-v1', defaultDescPresetClio)    
    useMessage = truncate(useMessage, 3, 4)
    return useMessage
}