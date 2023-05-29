# osu-packfetch
## What is this?
This is a very basic webscraper for downloading beatmap packs in bulk.
You'll never again need to suffer through downloading 50 packs manually.
## Usage
1. set your session cookie in a file named `.env` (see `.env.EXAMPLE` for template)
2. run `npm install`
3. run `npm start`
4. specify the page interval and pack name regex, this should create a `links.txt` file
5. run .\dl.ps1 (or write your own downloader)
6. profit
## License
Do what the hell you want