# xtemp

Temp mail client for [akunlama.com](https://akunlama.com) — check availability, list inbox, read messages. Zero config, just works.

## Install

```bash
npm install xtemp
```

## Usage

```js
import { akunlama } from 'xtemp';

// Check if an address is available
const check = await akunlama.cekEmail('myname123');
// { status: 'available', email: 'myname123@akunlama.com' }

// List inbox messages
const messages = await akunlama.inbox('myname123');
// [{ region, key, timestamp, sender, subject, from }]

// Read a message (plain text + links)
const msg = await akunlama.getInbox(messages[0].region, messages[0].key);
// { plainText: '...', links: [{ href, text }] }
```

## API

### `cekEmail(recipient)`

Check if a recipient name is available (inbox empty).

- Returns `{ status: 'available', email: '<recipient>@akunlama.com' }` when free.
- Returns `{ status: 'already taken', message: '...' }` when the inbox already has messages.

### `inbox(recipient)`

List messages in an inbox. Returns `[]` when empty, otherwise an array of:

```js
{ region, key, timestamp, sender, subject, from }
```

### `getInbox(region, key)`

Read one message. Returns `{ plainText, links }` where `links` is an array of `{ href, text }`. Throws on invalid region/key (API returns 404), so wrap in try/catch.

## License

MIT
