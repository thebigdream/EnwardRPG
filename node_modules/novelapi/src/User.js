import fetch from 'node-fetch';

export class User
{
    auth;
    constructor(auth)
    {
        this.auth = auth;
    }
    /**
     * 
     * @param {String} accessKey 64 character string.
     * @returns JSON: authToken on successful login
     */
    async Login(accessKey)
    {
        return await ULogin(this.auth, accessKey)
    }
    /**
     * Gets user account information.
     * @returns JSON: User Account Information
     */
    async GetUser()
    {
        return await UGetUser(this.auth)
    }
    /**
     * Gets priority info.
     * @returns JSON: User Priority Information
     */
    async GetPriority()
    {
        return await UPriority(this.auth)
    }
    /**
     * Gets subscription info for account.
     * @returns JSON: User Subscription Information
     */
    async GetSubscription()
    {
        return await UUserSubscription(this.auth)
    }
    /**
     * Unsure of use.
     * @returns JSON: Keystore, Index
     */
    async GetKeystore()
    {
        return await UGetKeystore(this.auth)
    }
    /**
     * Changes the keystore and the index. Unsure of use.
     * @param {String} keystore
     * @param {Number} index
     * @returns HTTPS Status 200
    */
    async SetKeystore(keystore, index)
    {
        return await UPutKeystore(this.auth, keystore, index)
    }
    /**
     * Retrieves user client settings.
     * @returns JSON: User Settings
     */
    async GetClientSettings()
    {
        return await UGetSettings(this.auth)
    }
    /**
     * This is a weird one. Doesn't accept JSON body, just a single string. ¯\_(ツ)_/¯
     * @param {String} settings 
     * @returns HTTPS Status 200
     */
    async SetClientSettings(settings)
    {
        return await UPutSettings(this.auth, settings)
    }
}

async function ULogin(authToken, accessKey)
{
    const response = await fetch('https://api.novelai.net/user/login', 
        {
        method: 'POST', 
        headers: {'Authorization': 'Bearer ' + authToken, 'Content-Type': 'application/json'}, 
        body: JSON.stringify({'key': accessKey})
    });
    return await response.json();
}

async function UGetUser(authToken)
{
    const response = await fetch('https://api.novelai.net/user/information', 
        {
        method: 'GET', 
        headers: {'Authorization': 'Bearer ' + authToken, 'Content-Type': 'application/json'}
    });
    return await response.json();
}

async function UPriority(authToken)
{
    const response = await fetch('https://api.novelai.net/user/priority', 
        {
        method: 'GET', 
        headers: {'Authorization': 'Bearer ' + authToken, 'Content-Type': 'application/json'}
    });
    return await response.json();
}

async function UUserSubscription(authToken)
{
    const response = await fetch('https://api.novelai.net/user/subscription', 
        {
        method: 'GET', 
        headers: {'Authorization': 'Bearer ' + authToken, 'Content-Type': 'application/json'} 
    });
    return await response.json();
}

async function UGetKeystore(authToken)
{
    const response = await fetch('https://api.novelai.net/user/keystore', 
        {
        method: 'GET', 
        headers: {'Authorization': 'Bearer ' + authToken, 'Content-Type': 'application/json'}
    });
    return await response.json();
}

async function UPutKeystore(authToken, keystore, index)
{
     const response = await fetch('https://api.novelai.net/user/keystore', 
         {
         method: 'PUT', 
         headers: {'Authorization': 'Bearer ' + authToken, 'Content-Type': 'application/json'},
         body: JSON.stringify({'keystore': keystore, 'changeIndex': index})
     });
     return await response;
}

async function UGetSettings(authToken)
{
    const response = await fetch('https://api.novelai.net/user/clientsettings', 
        {
        method: 'GET', 
        headers: {'Authorization': 'Bearer ' + authToken, 'Content-Type': 'application/json'}
    });
    return await response.json();
}

async function UPutSettings(authToken, settings)
{
    const response = await fetch('https://api.novelai.net/user/clientsettings', 
        {
        method: 'PUT', 
        headers: {'Authorization': 'Bearer ' + authToken, 'Content-Type': 'application/json'},
        body: {settings}
    });
    return await response;
}