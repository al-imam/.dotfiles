$env:MISE_PWSH_CHPWD_WARNING = 0

$gitBashBin = "$env:ProgramFiles\Git\bin"
if (Test-Path "$gitBashBin\bash.exe") {
  $env:PATH = "$gitBashBin;$env:PATH"
}

if ([Environment]::CommandLine -notmatch '-NonI' -and (Get-Command mise -ErrorAction SilentlyContinue)) {
  mise activate pwsh | Out-String | Invoke-Expression
  $env:PATH = "$env:LOCALAPPDATA\mise\shims;$env:PATH"
  $env:PATH += ";$env:LOCALAPPDATA\mise\installs\make\latest\Library\bin;$env:LOCALAPPDATA\mise\installs\sqlite\latest\Library\bin"
}
