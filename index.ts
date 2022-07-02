import { config as dotenv } from 'dotenv'
import prompt from 'prompt'

type Pack = {
    id: number,
    name: string
}

dotenv()
main()

const sleep = (time: number) => new Promise(res => setTimeout(res, time))

async function main() {
    const SESSION_ID = process.env.SESSION_ID
    if (!SESSION_ID) throw 'You need to set your SESSION_ID in the .env file.'
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
                default: 83,
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
    let str = ""
    for (let i = from; i <= to; i++) {
        console.log(i);
        const packs = await getPacksForPage(i)
        for (const pack of packs) {
            if (!packRegex.test(pack.name)) continue;
            console.log(pack.name)
            str += await getLinkForPackId(pack.id, SESSION_ID) + '\n'
            await sleep(1000)
        }
        await sleep(1000)
    }
    console.log(str)
}


async function getPacksForPage(page: number) {
    let html = await fetch(`https://osu.ppy.sh/beatmaps/packs?page=${page}`).then(x => x.text())
    const packs: Pack[] = []
    const regex = /packs\/(\d+)"\s+class="beatmap-pack__header\s+js-accordion__item-header">\s+<div\s+class="beatmap-pack__name">(.*?Beatmap Pack.*?#\d+)/gm
    for (const match of html.matchAll(regex)) {
        let pack: Pack = {
            id: parseInt(match[1]),
            name: match[2]
        }
        packs.push(pack)
    }
    return packs
}

async function getLinkForPackId(id: number, token: string) {
    let html = await fetch(`https://osu.ppy.sh/beatmaps/packs/${id}/raw`, {
        headers: {
            cookie: `osu_session=${token}`
        }
    }).then(x => x.text())
    const regex = /href="(.+?)"\s+class="beatmap-pack-download__link"/g
    try {
        return regex.exec(html)![1]
    } catch (error) {
        throw "Can't get download links. Maybe you're being rate limited"
    }
}
