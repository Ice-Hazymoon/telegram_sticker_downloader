# Telegram sticker downloader

## Installation

```bash
$ npm install telegram_sticker_downloader -g
```

or

```bash
$ yarn global add telegram_sticker_downloader
```

## Usage

### Nodejs

```javascript
const tsd = require('telegram_sticker_downloader');

tsd({
    token: 'your token', // telegram token
    sticker: ['what_what_time_is_it', 'sobdimg'] // sticker name
}).then(console.log).catch(console.log)

// Output 
// [
//     {
//         name: 'what_what_time_is_it',
//         links: [...Buffer]
//     },
//     {
//         name: 'sobdimg',
//         links: [...Buffer]
//     }
// ]
```

### CLI

```bash
$ tsd --help

    Usage: tsd [options]

    Options:
    -v, --version             output the version number
    -t, --token [token]       Your telegram token, apply for token here at https://t.me/BotFather
    -s, --sticker <items...>  Telegram sticker link or name (default: [])
    -c, --compression [type]  Compression method {tar|gzip|tgz|zip} (default: false)
    -o, --output [path]       Sticker saved folder (default: "./")
    -w, --webp                Use webp format
    -h, --help                output usage information
```

## Online use

[https://miku.tools/tools/telegram_sticker](https://miku.tools/tools/telegram_sticker)

## Author

telegram_sticker_downloader © [Ice-Hazymoon](https://imiku.me), Released under the MIT License.