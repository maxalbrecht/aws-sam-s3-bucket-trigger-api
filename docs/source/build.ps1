# Activate Virtual Environment
Set-Location .\..\..
Write-Output "*** Changed location to: "
Write-Output $(get-location).Path
Write-Output "*** Activating the virtual environment..."
.venv\Scripts\Activate.ps1

# Clean Sphinx Build
Set-Location .\docs\source
Write-Output "*** Changed location to: "
Write-Output $(get-location).Path
$CurrentDir = $(get-location).Path + "\"
$parentDir = $CurrentDir + "..\..\AWS\Services\Lambda\"
Write-Output "*** Cleaning Sphinx's build..."
.\..\make.bat clean

<# foreach($folder in get-ChildItem $parentDir){
    sphinx-apidoc.exe -o . $folder.FullName
} #>

# Make html
Set-Location .\..
Write-Output "*** Changed location to: "
Write-Output $(get-location).Path
Write-Output "*** Making html output with Sphinx..."
.\make.bat html

# Open in Chrome
Set-Location .\source
Write-Output "*** Changed location to: "
Write-Output $(get-location).Path
Write-Output "*** Opening in Chrome..."
chrome .\..\build\html\index.html