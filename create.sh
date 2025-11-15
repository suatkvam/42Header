#!/bin/bash

# Path to the .zshrc file to be configured
ZSHRC_FILE=~/.zshrc

echo "Setup script starting..."

# --- Variable Checks ---

# 1. USER Variable
# Only run this block if "export USER" is not found in Zshrc
if ! grep -q "export USER" "$ZSHRC_FILE"; then
    echo "Setting USER..."
    echo "USER=`/usr/bin/whoami`" >> "$ZSHRC_FILE"
    echo "export USER" >> "$ZSHRC_FILE"
fi

# 2. GROUP Variable
# Only run this block if "export GROUP" is not found in Zshrc
if ! grep -q "export GROUP" "$ZSHRC_FILE"; then
    echo "Setting GROUP..."
    # Bug fix: Used $USER instead of $user and added escaping
    echo 'GROUP=`/usr/bin/id -gn $USER`' >> "$ZSHRC_FILE"
    echo "export GROUP" >> "$ZSHRC_FILE"
fi

# 3. MAIL Variable
# Only run this block if "export MAIL" is not found in Zshrc
if ! grep -q "export MAIL" "$ZSHRC_FILE"; then
    echo "Setting MAIL..."
    # Bug fix: Added escaping for $USER
    echo 'MAIL="$USER@student.42istanbul.com.tr"' >> "$ZSHRC_FILE"
    echo "export MAIL" >> "$ZSHRC_FILE"
fi

# --- Plugin Installation ---

# 4. Create the Vim plugin directory
echo "Creating Vim plugin directory: ~/.vim/plugin"
mkdir -p ~/.vim/plugin

# 5. Copy the plugin
# We assume header42.vim is in the same directory as this script
# Get the directory where the script is located
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
PLUGIN_SOURCE="$SCRIPT_DIR/header42.vim"
PLUGIN_DEST="$HOME/.vim/plugin/header42.vim"

if [ -f "$PLUGIN_SOURCE" ]; then
    echo "Copying plugin: $PLUGIN_SOURCE -> $PLUGIN_DEST"
    cp "$PLUGIN_SOURCE" "$PLUGIN_DEST"
else
    echo "ERROR: $PLUGIN_SOURCE not found. Make sure it's in the same directory as the script."
    exit 1
fi

# 6. Apply the changes
echo "Reloading settings..."
source "$ZSHRC_FILE"

echo "Setup completed successfully!"