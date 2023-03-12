# ~/.bashrc

eval "$(starship init bash)"

alias ls="ls $@ --format=vertical --group-directories-first -s --color=tty --ignore={'[Nn][Tt][Uu][Ss][Ee][Rr]*',*'.BIN',*'.Bin','desktop.'*,'System Volume Information',*'.log.'*}"