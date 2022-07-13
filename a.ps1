foreach($line in Get-Content .\taiko-links.txt) {
    echo $line
    mega-get -q $line ./mega-taiko
}