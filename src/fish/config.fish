# count daily git commit's track work
alias gc="zx /home/al-imam/work/zx/git-commit-count-by-day/index.mjs"

# go to dotfiles folder
alias dotfiles="cd ~/.dotfiles"

starship init fish | source

function fish_greeting
  if test -e $HOME/.dotfiles/resource/device-information-ubuntu
    cat $HOME/.dotfiles/resource/device-information-ubuntu
  end
end
