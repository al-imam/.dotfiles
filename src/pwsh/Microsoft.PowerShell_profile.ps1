$env:MISE_PWSH_CHPWD_WARNING = 0

if ([Environment]::CommandLine -notmatch '-NonI' -and (Get-Command mise -ErrorAction SilentlyContinue)) {
  mise activate pwsh | Out-String | Invoke-Expression
}
