// IMPORTS
import random  from 'random';
import { defaultListPresetClio, defaultDescPresetClio } from "./presets.mjs"
import { generateMessage } from "./generateMessage.mjs"
import { sanitise } from "./sanitise.mjs"
import { truncate } from "./truncate.mjs"
import { generateNode, generateDescription, list } from "./sysFunctions.mjs"
import { getId } from "../../NovelAPI/enwardRPG.mjs";

// EXPORTS
export async function generateWorld(ids) {
    // Start world from scratch
    var world = {
        name:null,
        description:null,
        type:'world',
        nodes:[""],
        id:getId(),
    }

    // Generate possible worlds
    world.name = await list("[locations]Alternate Earth,Iceworld,Moon,The Back of a Giant Turtle,Overmined Asteroid,Waterworld,Vibrant Undercity,Cloud Kingdom,Alternate Dimension,Cotton Candy World,Ethereal Realm of Magical Flora,A Giant Jellyfish,Tropical Island,Mushroom Kingdom,Inside the Mind of an Animal,Cratered Mars Surface,Desert,Winding Mountain Range,Decadent Republic,Active Volcano,Beautiful Archipelago,Desert,Post-apocalyptic Landscape,Heaven,Demonic Realm,Sprawling Metropolis,Tropical Monkey Island Paradise,Cyberpunk City,Distant Outpost,Fishing Town,Realm of the Mad King,Virtual Paradise,Deep Black Forest,Floating Islands,",1)

    // Generate shops
    var businesses = await list("[Shops you'd find in a city]Frank's Department Store,McDonalds,Workman's Warehouse,Barber Shop,Arizon Accountancy,Maria's Cafe,Gruesome Gun Store,[shops you'd find in a forest]Elven Wood Supplies,Bowmaker,Eladir's Alchemy Supplies,Berries Berries & Berries,Wandering Trader,Shop Inside A Tree,[Shops you'd find in a demonic realm]Pain R Us,Wilson's Whips,Fire and Brimstone,Smoked Meats,Flame Emporium,666 Cigarettes,Eternal Torment Insurance,[Shops you'd find in a " + world.name + "]", random.int(2,4))
    for (var i = 0; i < businesses.length; i++) {
        businesses[i] = await generateNode(sanitise(businesses[i]), 'business', 500, 2500, world.name, null)
        world.nodes.push(businesses[i])
    }

    // Generate NPCs
    var NPCs = await list("[Characters you'd find in a city]Scheming Businessman,Police Officer Fresh From the Academy,Opinionated Pizza Shop Owner,Overworked Delivery Driver,Expert Barista,Civilian,Highly Efficient Traffic Controller,Just a Man,Woman out for a Walk,Exotic Dancer,Celebrity Who You Can't Recall the Name Of,Former President,Shop Assistant,Finely Dressed Mafioso,Trucker Chatting to a Friend,[Characters you'd find in a forest]Elven Archer,Gnome Explorer,Living Mushroom Creature,Alchemist Witch,Shady Ranger,Wandering Trader Who Sells Beads,Grizzled Mountain Man,Centaur,Monk Trying To Become Enlightened,[Characters you'd find in a military base]Patrolling Soldier,Cagey Sniper,Cook Who Is Busy,Desparate Prisoner,Guard (Private Company),Visiting Diplomat,5-Star General,Bored Admin Clerk,Disinterested Construction Worker,[Characters you'd find in a " + world.name + "]",random.int(6,8))
    for (var i = 0; i < NPCs.length; i++) {
        world.nodes.push(await generateNode(sanitise(NPCs[i]), 'NPC', 250, 500, world.name, null))
    }

    // Generate landmarks
    var landmarks = await list("[Landmarks you'd find in a city]Post Office,Large Mansion,Skyscraper,Park,Suburban House,Art Gallery,Oppulent Church,Town Square,Historic Building,[Landmarks you'd find in a demonic realm]Demonic Castle,Evil Mountain,Burnt House,Menacing Church,Graveyard,Gallows,Torture Chamber,Portal[Landmarks you'd find in a fairy land]Fairy Castle,Bubblegum House,Edible Manor,Spacious Witch's Hut,Magical Garden,Unicorn Stables,Fairy Queen's Abode,Whimsical Alley,[Landmarks you'd find in a " + world.name + "]",random.int(6,8))
    for (var i = 0; i < landmarks.length; i++) {
        world.nodes.push(await generateNode(sanitise(landmarks[i]), 'landmark', 500, 2500, world.name, null))
    }

    // Generate description of world
    world.description = await generateDescription(world)

    console.log(world)
    return world
}