# 42 Header Vim Plugin (vim-42header)

> **Note:** This is a modified version of the original [vim-42header](https://github.com/akifdora/42header) by akifdora, adapted for personal preferences and automated setup.

This plugin allows 42 school students to automatically insert and update the standard 42 header in their files using the Vim editor.

It is designed for C/C++ files like `.c`, `.h`, `.cc`, and `.hpp`.

## Features

* **Fully Automatic:** Automatically inserts the header when you type `vim *.c` or `vim new_file.c`.
* **Auto-Correction:** Automatically fixes incorrect filenames (`Filename: ...`) in files that were copied and pasted.
* **Auto-Update:** Automatically updates the `Updated: ...` line every time you save (`:w`) or reopen the file.
* **Batch Processing:** When opening multiple files (e.g., `vim *.c`), it processes, updates, and saves all files in one go.
  - For manual batch processing, use: `:Header42All` or `:argdo execute "Header42" | update`
* **Manual Trigger:** You can manually insert/update the header at any time using the `:Header42` command or the `<F1>` key.

## Installation

The easiest way to install this plugin is by using the `setup.sh` script.

```bash
# 1. Clone your repo
git clone https://github.com/suatkvam/42Header.git 42header

# 2. Navigate to the cloned directory
cd 42header

# 3. Give execution permission to the script
chmod +x create.sh

# 4. Run the setup script
./create.sh
