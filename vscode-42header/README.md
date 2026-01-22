# 42 Header for VS Code

Automatically insert and update the standard 42 school header in your C/C++ files.

## Features

- ✨ **Automatic Header Insertion** - Insert 42 header with a single command or keyboard shortcut
- 🔄 **Auto-Update on Save** - Automatically updates the "Updated:" timestamp when you save the file
- 🎯 **Command Palette Integration** - Easy access through VS Code command palette
- ⚙️ **Configurable Settings** - Set your username and email in VS Code settings
- 📁 **Batch Processing** - Update all headers in your workspace at once
- ⌨️ **Ctrl+Alt+H Shortcut** - Press Ctrl+Alt+H to insert/update header (just like in Vim!)

## Installation

### From Source (Development)

1. Clone this repository
2. Open the folder in VS Code
3. Run `npm install` to install dependencies
4. Press `F5` to open a new VS Code window with the extension loaded

### From VSIX (After Building)

1. Build the extension: `npm run compile`
2. Package it: `npx vsce package`
3. Install the .vsix file in VS Code: Extensions → ... → Install from VSIX

## Configuration

Open VS Code settings (File → Preferences → Settings) and search for "42 Header":

```json
{
  "42header.username": "your42login",
  "42header.email": "your42login@student.42istanbul.com.tr",
  "42header.autoUpdate": true
}
```

### Settings:

- **42header.username**: Your 42 intra username (default: system username)
- **42header.email**: Your 42 email address (default: username@student.42istanbul.com.tr)
- **42header.autoUpdate**: Automatically update header on file save (default: true)

## Usage

### Insert/Update Header

1. Open a C/C++ file (`.c`, `.h`, `.cpp`, `.hpp`, etc.)
2. Use one of these methods:
   - Press **Ctrl+Alt+H** (keyboard shortcut)
   - Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
   - Type: `42: Insert/Update Header`

### Insert/Update All Headers in Workspace

To update all existing headers in your workspace:

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type: `42: Insert/Update All Headers in Workspace`
3. All C/C++ files with existing headers will be updated

### Auto-Update on Save

By default, the extension automatically updates the "Updated:" line every time you save a file that has a 42 header. You can disable this in settings.

## Supported File Types

- `.c` - C source files
- `.h` - C header files
- `.cpp`, `.cc` - C++ source files
- `.hpp`, `.hh` - C++ header files

## Example Header

```c
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   example.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: username <username@student.42istanbul.c>  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/01/22 12:34:56 by username          #+#    #+#             */
/*   Updated: 2026/01/22 15:45:23 by username         ###   ########.tr       */
/*                                                                            */
/* ************************************************************************** */
```

## Commands

| Command | Description | Shortcut |
|---------|-------------|----------|
| `42: Insert/Update Header` | Insert a new header or update existing one | Ctrl+Alt+H |
| `42: Insert/Update All Headers in Workspace` | Update all headers in workspace files | - |

## Requirements

- VS Code version 1.85.0 or higher

## Known Issues

None at the moment. Please report issues on GitHub.

## Release Notes

### 1.0.0

Initial release of 42 Header for VS Code

- Insert/update 42 header
- Auto-update on save
- Batch workspace processing
- Configurable username and email

## Credits

Based on the original [vim-42header](https://github.com/akifdora/42header) by akifdora.

Adapted for VS Code by suatkvam.

## License

MIT
