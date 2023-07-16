# NovelAPI
A [NovelAI](https://novelai.net/) API written in Javascript and usable as a Node.JS module. A first venture in many aspects, if any issues are encountered post them on the issues page.

## Installation
`npm i novelapi`

## Configuration
The only configuration required to use the module is finding the authorization token for NovelAI. 
On the NovelAI website with a logged in account, go to `Inspect Element > Application > Storage > Local Storage > https://novelai.net/`. There will be a list of keys, one of them labeled `session`. It will have a 205 character value called `auth_token`.

## Usage Example
```
import { Client } from 'novelapi';

const auth = 'authToken';

const NovelAI = new Client(auth);
NovelAI.APIStatus().then(e => {console.log(e.status)});
NovelAI.Generator.Generate("Hello world! It's me, an AI!").then(e => {
    console.log(e)
});
```

## TODO
Generate Text Stream support.

Optimize the class/function structure.

Input Sanitization