# Count daily git commit's track work
alias gc="zx ~/git-commit-count-by-day/index.mjs"

# Go to dotfiles folder
alias dotfiles="cd ~/.dotfiles"

# Update static
alias update-static="screenfetch > ~/.dotfiles/resource/device-information-ubuntu"

# rm command with trush
alias rm='trash_or_rm'

function trash_or_rm
    if which trash >/dev/null
        trash $argv
    else
        rm $argv
    end
end

set PATH ~/.nvm/versions/node/v21.0.0/bin $PATH

starship init fish | source

function fish_greeting
  if test -e ~/.dotfiles/resource/device-information-ubuntu
    cat ~/.dotfiles/resource/device-information-ubuntu
  end
end
