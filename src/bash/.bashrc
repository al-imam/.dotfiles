# ~/.bashrc

eval "$(starship init bash)"

lsIgnoreRegex="{'[Nn][Tt][Uu][Ss][Ee][Rr]*',*'.BIN',*'.Bin','desktop.'*,'System Volume Information',*'.log.'*}"

# format output in vertical order and ignore some system files and directories
alias ls="ls $@ --format=vertical --group-directories-first -s --color=tty --ignore=$lsIgnoreRegex"

# reload bash without exiting
alias reload="source ~/.bashrc"

# count daily git commit's track work
alias count="zx /w/zx/git-commit-count-by-day/script.mjs $@"

# go to dotfiles folder
alias dotfiles="cd ~/dotfiles"
