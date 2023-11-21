# Count daily git commit's track work
alias gc="zx ~/git-commit-count-by-day/index.mjs"


# Go to dotfiles folder
alias dotfiles="cd ~/.dotfiles"


# Update static
alias update-static="screenfetch > ~/.dotfiles/resource/device-information-ubuntu"


# npm install --global trash-cli
function trash_or_rm
    set message_warning "\e[0;31mWarning: 'trash' command not found. Files will be permanently deleted.\e[0m"
    set message_confirmation "Are you sure you want to permanently delete the file(s)? (y/n): "
    set message_canceled "Operation canceled."

    if command -v trash >/dev/null 
        command trash $argv
    else
        echo -e $message_warning
        read -P $message_confirmation answer

        if test (string tolower $answer) = "y" -o (string tolower $answer) = "yes"
            command rm -v $argv
        else
            echo $message_canceled
        end
    end
end

# rm command with trash_or_rm
alias rm="trash_or_rm"


set PATH ~/.nvm/versions/node/v21.0.0/bin $PATH

starship init fish | source

function fish_greeting
  if test -e ~/.dotfiles/resource/device-information-ubuntu
    cat ~/.dotfiles/resource/device-information-ubuntu
  end
end
