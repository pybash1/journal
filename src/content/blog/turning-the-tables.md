---
title: Turning the Tables
description: Test
pubDate: 'Jan 8 2024'
---
I've been trying to get my life in order for a while now, either by building tools or by finding. In one such adventure, I recently discovered [Matter](https://getmatter.com). If you know me, you know I use Obsidian for taking notes. So, obviously I wanted to connect Matter with Obsidian, and get my highlights and other data synced, but there was one problem, Matter doesn't have an android app, and the Obsidian plugin, needs you to scan a QR code to login. 

For those wondering why that is a problem, it isn't. The problem is I am not rich enough to buy an iPhone(my parents wouldn't buy me one, even if I was). So, the question arises - how do I sign in? Well, let's see options we have -

- ~~Buy an iPhone~~
- ~~Wait for Android app~~
- ~~Ask someone with an iPhone to do it for me - works but I'm too impatient~~

Not many options, but I've to figure something out, maybe just settle with the last option? Or, wait, there is one more option.

- Break open the plugin's source, and bypass the login mechanism

Yeah, that sounds much more like me. Let's give it a try.

## Breaking it Open

Wasn't super easy, but not too hard either. I started off, cloning their plugin from [GitHub](https://github.com/getmatterapp/obsidian-matter). Thankfully, the code was very well structured and not very complex. Going through the code I discovered these constants in the `src/api.ts` file.

```ts title="src/api.ts" {7,8}
export const CLIENT_TYPE = 'integration';
export const MATTER_API_VERSION = 'v11';
export const MATTER_API_DOMAIN = 'api.getmatter.app';
export const MATTER_API_HOST = 
  `https://${MATTER_API_DOMAIN}/api/${MATTER_API_VERSION}`;
export const ENDPOINTS = {
  QR_LOGIN_TRIGGER: `${MATTER_API_HOST}/qr_login/trigger/`,
  QR_LOGIN_EXCHANGE: `${MATTER_API_HOST}/qr_login/exchange/`,
  REFRESH_TOKEN_EXCHANGE: `${MATTER_API_HOST}/token/refresh/`,
  HIGHLIGHTS_FEED: `${MATTER_API_HOST}/library_items/highlights_feed/`
}
```

And right then, I visited the `QR_LOGIN_TRIGGER` endpoint in my browser, and stumbled onto this:

![[Pasted image 20231225222752.png]]

Did the same with the `QR_LOGIN_EXCHANGE` and the same result followed. So, now it was time to just reverse engineer the code and login(or bypass the login). My initial attempt was to get the QR session token this code was generating and try to login by sending that through the Django API.

```ts title="src/settings.ts" showLineNumbers{93}
const headers = new Headers();
headers.set('Content-Type', 'application/json');

const triggerResponse = await fetch(ENDPOINTS.QR_LOGIN_TRIGGER, {
  method: "POST",
  body: JSON.stringify({ client_type: CLIENT_TYPE }),
  headers,
});
this.plugin.settings.qrSessionToken = 
  (await triggerResponse.json()).session_token;
```

This too was unsuccessful, as the API kept returning the `access_token` and `refresh_token` as `null`. And hence, as a last resort, I had to modify a bunch of the code. Firstly, I fetched my `access_token` and `refresh_token` from the Matter Web cookies. I, then modified the default settings to use these tokens instead of `null`.

```ts title="src/settings.ts" showLineNumbers{47} {2-3,9}
export const DEFAULT_SETTINGS: MatterSettings = {
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  qrSessionToken: null,
  dataDir: "Matter",
  syncInterval: 60,
  syncOnLaunch: true,
  notifyOnSync: SyncNotificationPreference.ALWAYS,
  hasCompletedInitialSetup: true,
  lastSync: null,
  isSyncing: false,
  contentMap: {},
  recreateIfMissing: true,
  metadataTemplate: null,
  highlightTemplate: null,
}
```

I also changed the `hasCompletedInitialSetup` value to true for obvious reasons, and reran the plugin, but had no luck. I was confused too, since I had changed the token, and couldn't find anything else.

After spending a bunch of time, using `console.log`s and other logging methods, I figured the problem, the tokens I specified in the default settings, were somehow being overwritten. But, still I was not sure where, and so I kept on digging, and found this code in a bunch of places `await this.loadSettings()`. Upon examining the function, this is what it was doing:

```ts title="src/main.ts" showLineNumbers{69} {2}
async loadSettings() {
  this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
}
```

and the `this.loadData` function was pulling in the real saved configuration of the extension from somewhere[^1]. So, I simply, removed that part, and restarted the plugin. And, who would've thought, it started syncing! And within a couple of seconds, my Articles directory was populated with articles and their highlights.

[1]: The function was not defined in any of the files of the extension, so likely defined in the base Obsidian extension `Plugin` class. I did try to go to its definition but it took me to a typescript definition only.

## Final touches
After I bypassed the basic login mechanism, as I had disabled the `loadSettings`, other settings too would need to be directly changed in the file, and not in the obsidian settings panel. After cleaning up the `console.log`s and other changes I made, and updating the settings as per my requirements, I was done.

That's it! I turned the tables. Maybe I should break more plugins and extensions like the Flow ChatGPT plugin, but that's a story for another day.