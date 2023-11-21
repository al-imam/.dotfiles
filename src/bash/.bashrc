# ~/.bashrc

if [ -f ~/.dotfiles/resource/device-information-ubuntu ] 
then
  cat ~/.dotfiles/resource/device-information-ubuntu
fi


lsIgnoreRegex="{'[Nn][Tt][Uu][Ss][Ee][Rr]*',*'.BIN',*'.Bin','desktop.'*,'System Volume Information',*'.log.'*}"

# format output in vertical order and ignore some system files and directories
alias ls="ls $@ --format=vertical --group-directories-first -s --color=tty --ignore=$lsIgnoreRegex"

# reload bash without exiting
alias reload="source ~/.bashrc"

# count daily git commit's track work
alias gc="zx ~/git-commit-count-by-day/index.mjs $@"

# go to dotfiles folder
alias dotfiles="cd ~/.dotfiles"


# npm install --global trash-cli
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


# rm command with trush
alias rm="trash_or_rm"


export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  

eval "$(starship init bash)"
