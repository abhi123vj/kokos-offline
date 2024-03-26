import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { spawn } from 'child_process'
import log from 'electron-log/main'

import express, { Request, Response } from 'express'
import { existsSync } from 'fs'

// @ts-ignore (define in dts)

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  mainWindow.on('close', () => {
    console.log('Visual code window is closing.')
  })
}
function createServer(): void {
  log.log(`[createServer] ${__dirname.toString()}`)
  const filePath = join(__dirname, '..', '..', 'resources', 'code', 'visual_code', 'game.html')
  log.log(`[createPythonIdeGameWindow] path ${filePath}`)

  // Check if the file exists
  if (existsSync(filePath)) {
    log.log(`[createServer] filePath exists}`)
  } else {
    log.log(`[createServer] filePath not exists}`)
  }
  const app = express()

  // @ts-ignore (define in dts)
  const port = import.meta.env.MAIN_VITE_PORT0

  // Serve static files from the 'public' directory
  app.use(express.static(join(__dirname, '..', '..', 'resources', 'code', 'visual_code')))
  app.use(express.static(join(__dirname, '..', '..', 'resources', 'code', 'scratch')))
  // Route for serving the index.html file
  app.get('/visualcode', (_req: Request, res: Response) => {
    res.sendFile(join(__dirname, '..', '..', 'resources', 'code', 'visual_code', 'game.html'))
  })
  app.get('/scratch', (_req: Request, res: Response) => {
    res.sendFile(join(__dirname, '..', '..', 'resources', 'code', 'scratch', 'index.html'))
  })
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/visualcode`)
  })
}

function createChildWindow(uri: string): void {
  // @ts-ignore (define in dts)
  const port = import.meta.env.MAIN_VITE_PORT0
  const visualCodeWindow = new BrowserWindow({
    width: 1080,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  visualCodeWindow.on('ready-to-show', () => {
    visualCodeWindow.show()
  })
  visualCodeWindow.loadURL(`http://localhost:${port}/${uri}`)
}
function createPythonIdeGameWindow(): void {
  log.log(`[createPythonIdeGameWindow] ${__dirname.toString()}`)
  let executablePath: string = join(
    __dirname,
    '..',
    '..',
    '..',
    'app.asar.unpacked',
    'resources',
    'executable',
    'Thonny',
    'thonny.exe'
  )
  log.log(`[createPythonIdeGameWindow] path ${executablePath}`)

  // Check if the file exists
  if (!existsSync(executablePath)) {
    executablePath = join(__dirname, '..', '..', 'resources', 'executable', 'Thonny', 'thonny.exe')
  }

  const childProcess = spawn(executablePath)

  childProcess.stdout.on('data', (data: Buffer) => {
    log.log(data.toString())
  })

  childProcess.stderr.on('data', (data: Buffer) => {
    log.error(data.toString())
  })

  childProcess.on('error', (err: Error) => {
    log.error('Child process error:', err)
  })

  childProcess.on('close', (code: number) => {
    log.log('Child process exited with code', code)
  })

  // Handle process termination in the parent
  process.on('exit', () => {
    if (!childProcess.killed) {
      childProcess.kill()
    }
  })
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  createServer()
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('VisualCode', () => {
    console.log('VisualCode Activated')
    createChildWindow('visualcode')
  })
  ipcMain.on('Scratch', () => {
    console.log('Scratch Activated')
    createChildWindow('scratch')
  })
  ipcMain.on('PythonIde', () => {
    console.log('PythonIde Activated')
    createPythonIdeGameWindow()
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
