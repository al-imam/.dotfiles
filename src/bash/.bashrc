# ~/.bashrc

lsIgnoreRegex="{'[Nn][Tt][Uu][Ss][Ee][Rr]*',*'.BIN',*'.Bin','desktop.'*,'System Volume Information',*'.log.'*}"

# format output in vertical order and ignore some system files and directories
alias ls="ls $@ --format=vertical --group-directories-first -s --color=tty --ignore=$lsIgnoreRegex"

# reload bash without exiting
alias reload="source ~/.bashrc"

# count daily git commit's track work
alias gc="zx /home/al-imam/work/zx/git-commit-count-by-day/index.mjs $@"

# go to dotfiles folder
alias dotfiles="cd ~/.dotfiles"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  

eval "$(starship init bash)"
