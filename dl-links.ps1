$path = "./mega-out"
If(!(Test-Path -PathType container $path))
{
    New-Item -ItemType Directory -Path $path
}
foreach($line in Get-Content .\links.txt) {
    echo $line
    mega-get -q $line ./mega-out
}