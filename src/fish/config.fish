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

alias rm="trash_or_rm"


starship init fish | source
