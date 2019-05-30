'use strict';

const rp = require('request-promise');
const sharp = require('sharp');
const compressing = require('compressing');
const fs = require('fs');
const path = require('path');

function DownloadSticker(options){
    const logger = require('./logger')(options.cli);
    return Promise.all(
        options.sticker.map(async name => {
            logger.info(`Start getting "${name}" information...`);
            const StickerSet = await rp.get(`https://api.telegram.org/bot${options.token}/getStickerSet`, {
                json: true,
                qs: {
                    name: name
                }
            })
    
            if (!StickerSet.ok) return logger.error('Failed to get stickers: ' + JSON.stringify(StickerSet));
    
            logger.info(`Get "${name}" information successfully, start downloading Sticker...`);
            const links = await Promise.all(
                StickerSet.result.stickers.map(async (item, index) => {
                    logger.info(`Downloading "${name}" [${index+1}/${StickerSet.result.stickers.length}]`);
                    const pathResponse = await rp.get(
                        `https://api.telegram.org/bot${options.token}/getFile`,
                        {
                            qs: {
                                file_id: item.file_id
                            },
                            json: true
                        }
                    );
                    const path = pathResponse.result.file_path;
                    const fileResponse = await rp.get(
                        `https://api.telegram.org/file/bot${options.token}/${path}`,
                        {
                            encoding: null
                        }
                    );
                    if(!options.webp){
                        let fileBuffer = await sharp(fileResponse)
                            .png()
                            .toBuffer();
                        return Promise.resolve(fileBuffer);
                    } else {
                        return Promise.resolve(fileResponse);
                    }
                })
            );
            if (!options.cli) {
                return Promise.resolve({
                    name,
                    links
                });
            }
            if (options.compression){
                logger.info(`Download "${name}" successfully, compressing...`);
                const savePath = path.resolve(process.cwd(), options.output, `telegram_sticker_${name}.zip`);
                let tarStream = new compressing[options.compression].Stream();
                links.forEach((buffer, index) => {
                    tarStream.addEntry(buffer, {
                        relativePath: `${name}_${index + 1}.${options.webp ? 'webp' : 'png'}`
                    });
                });
                tarStream.pipe(fs.createWriteStream(savePath));
                logger.info(`Compress "${name}" to complete`);
                return Promise.resolve(savePath)
            } else {
                logger.info(`Download "${name}" successfully, saving...`);
                const savePath = path.resolve(process.cwd(), options.output, `telegram_sticker_${name}`);
                if (!fs.existsSync(savePath)) {
                    fs.mkdirSync(`telegram_sticker_${name}`);
                }
                links.forEach((buffer, index) => {
                    fs.writeFileSync(path.join(savePath, `${name}_${index + 1}.${options.webp ? 'webp' : 'png'}`), buffer);
                });
                logger.info(`Save "${name}" to complete`);
                return Promise.resolve(savePath)
            }
        })
    )
}

module.exports = DownloadSticker;
