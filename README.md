# Dynamic Web Dashboards by Debugger King

## Installation

### Prerequisites

[You need to have Node.js (at least v16.14) to be installed on your system.](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

You can check if you already have Node.js and npm installed by running the following commands:

```
node -v
npm -v
```

It's important to note that you need to set Node.js to your PATH using the Windows installer. Using other methods to install Node.js may skip that step and require additional setup after.

[This project also uses pnpm, not npm (but npm is still needed).](https://pnpm.io/installation)

You can check if you already have pnpm or successfully installed pnpm by running the following command:

```
pnpm version
```

**Action required: If your project previously used npm, you need to delete all currently installed packages in the node_modules folders.**

You will also need .NET (dotnet) 7 and 8 to run the backend API. [It's important you use the latest release of either version.](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)

## Installing

To install the project, run the following commands:

```
pnpm install
```

## Dev environment setup

To start all microfrontend services with hot-reloads for development, run the following command:

```
pnpm run start:all
```

To also start all backend services with hot-reloads for development, run the following command in another terminal or command prompt:

```
pnpm run backend
```

## Running tests

To run tests on the apps, run the following command:

```
pnpm run test:all
```

## Running with Docker

[To run with Docker, you will first need to install Docker for your respective operating system.](https://docs.docker.com/engine/install/)

It's important to note that Docker runs differently on Windows compared to GNU/Linux and macOS, so expect performance issues even on high end machines.

To run with Docker, you do not need to run any pnpm commands as the Docker script will pull the appropriate images and run the pnpm scripts inside of a container.

### Build with Docker

The first step is to build the Docker container by running the following command:

```
docker compose build
```

### Run with Docker

The next step is to run the Docker containers by running the following command:

```
docker compose up
```

While the containers are running, you can either leave your terminal as is or add the `-d` flag to detach the console to the background. If you want to quit the containers you you can use the CTRL + C (or CTRL^C) to stop all running containers. If you detached the console to the background, use the following command to stop the containers:

```
docker compose stop
```

If you encounter an issue that your changes are not appearing after running the compose commands, you should try and clear the cache and rebuild with the following command:

```
docker ps -a -q
```


