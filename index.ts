import { config as dotenv } from 'dotenv'
import fs from 'fs/promises'
import prompt from 'prompt'

type Pack = {
    id: string,
    name: string
}

dotenv()
main().catch(r => console.error("Error: " + r));

const sleep = (time: number) => new Promise(res => setTimeout(res, time))

async function main() {
    const SESSION_ID = process.env.SESSION_ID
    if (!SESSION_ID) throw 'You need to set your SESSION_ID in the `.env` file. See rename `.env.EXAMPLE` to `.env` and paste in your osu session cookie'
    prompt.start({ message: "osu-packfetch" })
    const pres = await prompt.get({
        properties: {
            pageFrom: {
                description: 'From page',
                type: 'number',
                minimum: 1,
                default: 1,
                required: true
            },
            pageTo: {
                description: 'To page',
                type: 'number',
                default: 20,
                required: true,
                conform: val => parseInt(val) >= parseInt(prompt.history('pageFrom')!.value)
            },
            packRegex: {
                description: 'Pack regex',
                type: 'string',
                default: 'Taiko',
                required: true,
                conform: val => {
                    try {
                        new RegExp(val)
                        return true
                    }
                    catch {
                        return false;
                    }
                }
            }
        }
    })
    const from = parseInt(pres.pageFrom.toString())
    const to = parseInt(pres.pageTo.toString())
    const packRegex = new RegExp(pres.packRegex.toString())
    fs.writeFile("./links.txt", "")
    for (let i = from; i <= to; i++) {
        console.log(i);
        const packs = await getPacksForPage(i)
        for (const pack of packs) {
            if (!packRegex.test(pack.name)) continue;
            console.log(pack.name)
            let link = encodeURI(`https://packs.ppy.sh/${pack.id} - ${pack.name}.7z`).replaceAll('#','%23')
            console.log(link);
            await fs.appendFile("./links.txt", link + '\n')
        }
        await sleep(1000)
    }
    console.log("links.txt created")
}


async function getPacksForPage(page: number) {
    let html = await fetch(`https://osu.ppy.sh/beatmaps/packs?page=${page}`).then(x => x.text())
    const packs: Pack[] = []
    const regex = /packs\/(.+?)"\s+class="beatmap-pack__header\s+js-accordion__item-header">\s+<div\s+class="beatmap-pack__name">(.*?Beatmap Pack.*?#\d+)/gm
    for (const match of html.matchAll(regex)) {
        let pack: Pack = {
            id: match[1],
            name: match[2]
        }
        packs.push(pack)
    }
    return packs
}