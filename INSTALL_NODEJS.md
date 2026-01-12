# Installing Node.js on Windows

Node.js is required to run both the frontend and backend of DriveFlow. Follow these steps to install it.

## Option 1: Official Installer (Recommended)

1. **Download Node.js:**
   - Go to https://nodejs.org/
   - Download the **LTS (Long Term Support)** version (recommended)
   - Choose the Windows Installer (.msi) for your system (64-bit or 32-bit)

2. **Run the Installer:**
   - Double-click the downloaded `.msi` file
   - Follow the installation wizard
   - **Important:** Make sure to check "Add to PATH" during installation
   - Click "Next" through all steps
   - Click "Install" (you may need administrator privileges)

3. **Verify Installation:**
   - Close and reopen your terminal/command prompt
   - Run these commands to verify:
     ```bash
     node --version
     npm --version
     ```
   - You should see version numbers (e.g., `v18.17.0` and `9.6.7`)

## Option 2: Using Chocolatey (If you have it)

If you have Chocolatey package manager installed:

```bash
choco install nodejs-lts
```

## Option 3: Using Winget (Windows 11/10)

If you have Windows 11 or Windows 10 with winget:

```bash
winget install OpenJS.NodeJS.LTS
```

## Troubleshooting

### "npm: command not found" after installation

1. **Restart your terminal:**
   - Close ALL terminal/command prompt windows
   - Open a new terminal window
   - Try `npm --version` again

2. **Check if Node.js is in PATH:**
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Go to "Advanced" tab → "Environment Variables"
   - Under "System variables", find "Path" and click "Edit"
   - Look for entries like:
     - `C:\Program Files\nodejs\`
     - `C:\Program Files (x86)\nodejs\`
   - If not present, add: `C:\Program Files\nodejs\`
   - Click OK on all dialogs
   - Restart your terminal

3. **Verify installation location:**
   - Check if Node.js is installed: `C:\Program Files\nodejs\node.exe`
   - If it exists, add that folder to your PATH (see step 2)

4. **Manual PATH addition:**
   - Open PowerShell as Administrator
   - Run:
     ```powershell
     [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\nodejs\", [EnvironmentVariableTarget]::Machine)
     ```
   - Restart your terminal

## After Installation

Once Node.js is installed, you can proceed with the DriveFlow setup:

1. **Verify installation:**
   ```bash
   node --version
   npm --version
   ```

2. **Continue with DriveFlow setup:**
   - Follow the instructions in `SETUP.md`
   - Start with backend setup: `cd backend && npm install`

## Need Help?

If you continue to have issues:
1. Make sure you downloaded the correct installer for your system (64-bit vs 32-bit)
2. Try uninstalling and reinstalling Node.js
3. Check Windows Event Viewer for installation errors
4. Ensure you have administrator privileges when installing
