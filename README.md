# osu-packfetch
## What is this?
This is a very basic webscraper for downloading beatmap packs in bulk.
You'll never again need to suffer through downloading 50 packs manually.
## Usage
1. set your session cookie in a file named `.env` (see `.env.EXAMPLE` for template)
2. run `npm install`
3. run `npm start`
4. specify the page interval and pack name regex, this should create a `links.txt` file
5. download `mega-cmd` if you haven't already, and start `mega-cmd-server` in a separate shell
6. run `dl-links.ps1` and your packs should appear in the newly created `mega-out` directory
7. enjoy your thousands of beatmaps you're probably never gonna all play
## License
Do what the hell you want