import { checkAPI } from './Utils.js';
import { User } from './User.js';
import { Generator } from './Generation.js';

/**
 * The base NovelAI Client.
 */
export class Client {
    auth;
    User;
    Generator;
    /**
     * Initializes the NovelAI client.
     * @param {String} auth Can be found in browser local storage as auth_token.
     */
    constructor(auth)
    {
        //TODO: Check token validity through basic length check. Seems to be 205, need key another to verify.
        if(auth.length == 205)
        {
            this.auth = auth;
            this.User = new User(auth);
            this.Generator = new Generator(auth);
        } else {console.error('ERROR: Invalid Authentication Token')}
    }
    /**
     * Returns current status of API.
     * @returns HTTPS Status Code
     */
    async APIStatus()
    {
        return await checkAPI();
    }
}