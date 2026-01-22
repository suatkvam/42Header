# Installation & Usage Guide

## Quick Start

### 1. Install Dependencies

```bash
cd vscode-42header
npm install
```

### 2. Test the Extension

```bash
# Compile TypeScript
npm run compile

# Open VS Code with the extension loaded
code .
```

Then press **F5** to open a new VS Code window with the extension running.

### 3. Try It Out

In the new VS Code window:

1. Create a new file: `test.c`
2. Press **F1** to insert the header
3. Check the header is inserted
4. Modify the file and save - the "Updated:" line should update automatically

## Build and Package

To create a .vsix file for distribution:

```bash
# Install vsce (if not already installed)
npm install -g @vscode/vsce

# Package the extension
npx vsce package
```

This will create a `42header-1.0.0.vsix` file.

## Install from VSIX

1. Open VS Code
2. Go to Extensions view (Ctrl+Shift+X)
3. Click the "..." menu at the top
4. Select "Install from VSIX..."
5. Choose the `42header-1.0.0.vsix` file

## Configure Settings

After installation, configure your username and email:

1. Open Settings (File → Preferences → Settings)
2. Search for "42 Header"
3. Set:
   - `42header.username`: Your 42 username
   - `42header.email`: Your 42 email (e.g., username@student.42istanbul.com.tr)

Or edit `settings.json` directly:

```json
{
  "42header.username": "your42login",
  "42header.email": "your42login@student.42istanbul.com.tr",
  "42header.autoUpdate": true
}
```

## Testing

Create a test file to verify:

```bash
# Create test directory
mkdir test-workspace
cd test-workspace

# Create a C file
echo "int main(void) { return 0; }" > main.c

# Open in VS Code
code main.c
```

Press **F1** in the editor to insert the header.

## Troubleshooting

### Extension not activating

- Make sure you have opened a C/C++ file (.c, .h, .cpp, .hpp)
- Check the Output panel (View → Output → "42 Header")

### Header not updating on save

- Check that `42header.autoUpdate` is set to `true` in settings
- Make sure the file has a valid 42 header (11 lines)

### Compilation errors

```bash
# Clean and rebuild
rm -rf out/
npm run compile
```

## Publishing to VS Code Marketplace (Optional)

If you want to publish the extension:

1. Create a publisher account at https://marketplace.visualstudio.com/
2. Get a Personal Access Token (PAT) from Azure DevOps
3. Login with vsce:

```bash
npx vsce login your-publisher-name
```

4. Publish:

```bash
npx vsce publish
```

## Development

### File Structure

```
vscode-42header/
├── src/
│   ├── extension.ts       # Main extension entry point
│   └── header42.ts        # Header logic
├── out/                   # Compiled JavaScript (generated)
├── package.json           # Extension manifest
├── tsconfig.json          # TypeScript configuration
└── README.md             # Extension documentation
```

### Making Changes

1. Edit TypeScript files in `src/`
2. Run `npm run compile` or `npm run watch`
3. Press F5 to test in a new VS Code window
4. Reload the extension window (Ctrl+R) after changes

### Debugging

- Set breakpoints in TypeScript files
- Press F5 to start debugging
- Use Debug Console to see logs
