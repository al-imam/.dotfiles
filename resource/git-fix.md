### Solution: Git Fatal Error "Failed to Resolve HEAD as a Valid Reference"

1. get backup from your .git directory
2. open file **.git/logs/refs/heads/\<branch name>** with your editor
3. copy second hash of your **last line** end of file
4. open file **.git/refs/heads/\<branch name>** and **delete** everything in this file
5. past that hash to **.git/refs/heads/\<branch name>**
