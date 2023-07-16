// IMPORTS
import { Client } from 'novelapi'
import { novelAPIKey } from "../../NovelAPI/config.mjs"

// GET RESPONSE FROM API
const NovelAI = new Client(novelAPIKey);
export async function generateMessage(prompt, model, preset) {
    NovelAI.APIStatus().then(e => {console.log(e.status)});
    var response;
    if (prompt == null) return 'No prompt :nobitches:'
    try {
        await NovelAI.Generator.Generate(prompt, model, preset).then(e => {
            if (e != null) { 
                response = e.output
            } else response = 'No response from novelAI :nobitches:', console.log('Error generating message.')
        }) 
        return response
    } catch {
        console.log('Error generating message.')
        return 'There was an error'
    }
}
