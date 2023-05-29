$list = Get-Content .\links.txt

$clnt = New-Object System.Net.WebClient

New-Item -Path '.\packs' -ItemType Directory

foreach($url in $list) 
{ 

	$filename = [System.IO.Path]::GetFileName($url) 
	$file = [System.IO.Path]::Combine($pwd.Path, 'packs', $filename) 
	Write-Host -NoNewline "Getting ""$url""... "
	$clnt.DownloadFile($url, $file) 
	Write-Host "done." 
}