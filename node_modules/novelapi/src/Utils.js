import fetch from 'node-fetch';

export async function checkAPI()
{
    const response = await fetch('https://api.novelai.net/');
    return response;
}