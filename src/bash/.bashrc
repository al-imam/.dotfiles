# ~/.bashrc

trash_or_rm() {
  message_warning="\033[0;31mWarning: 'trash' command not found. Files will be permanently deleted.\033[0m"
  message_confirmation="Are you sure you want to permanently delete the file(s)? (y/n): "
  message_canceled="Operation canceled."

  if command -v trash > /dev/null 2>&1; then
    command trash "$@"
  else
    echo -e "$message_warning"
    read -p "$message_confirmation" answer

    if [ "${answer,,}" = "y" ] || [ "${answer,,}" = "yes" ]; then
      command rm -v "$@"
    else
      echo "$message_canceled"
    fi
  fi
}

if ! command -v open >/dev/null 2>&1; then
  open() {
    if command -v explorer.exe >/dev/null 2>&1; then
      if [ -z "$1" ]; then
        explorer.exe .
      else
        explorer.exe "$@"
      fi
      return 0
    fi

    if command -v xdg-open >/dev/null 2>&1; then
      if [ -z "$1" ]; then
        xdg-open .
      else
        xdg-open "$@"
      fi
      return 0
    fi

    if command -v open >/dev/null 2>&1; then
      command open "$@"
      return $?
    fi

    echo "open: no supported opener found" >&2
    return 127
  }
fi

export _ZO_DOCTOR=0

lsIgnoreRegex="{'[Nn][Tt][Uu][Ss][Ee][Rr]*',*'.BIN',*'.Bin','desktop.'*,'System Volume Information',*'.log.'*}"

alias ls="ls $@ --format=vertical --group-directories-first -s --color=tty --ignore=$lsIgnoreRegex"
alias reload="source ~/.bashrc"
alias dotfiles="cd ~/.dotfiles"
alias rm="trash_or_rm"
alias cb='builtin cd'
alias cd="z"

alias glm='claude --settings ~/.claude/settings.glm.json'
alias claude='claude --dangerously-skip-permissions'



# mise: `mise activate bash --shims` emits Windows paths (C:\...) which break
# bash's ':'-separated PATH on Git Bash, so add the shims dir ourselves.
if command -v cygpath >/dev/null 2>&1 && [[ -n $LOCALAPPDATA ]]; then
  _mise_root="$(cygpath -u "$LOCALAPPDATA")/mise"
  export PATH="$_mise_root/shims:$_mise_root/installs/make/latest/Library/bin:$_mise_root/installs/sqlite/latest/Library/bin:$PATH"
  unset _mise_root
fi

eval "$(starship init bash)"
# zoxide 0.10.0 on Windows emits `cygpath -w "\builtin pwd -L"` (missing $(...)); patch it.
eval "$(zoxide init bash | sed 's|"\\builtin pwd -L"|"$(\\builtin pwd -L)"|')"
