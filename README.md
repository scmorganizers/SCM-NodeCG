# What does this project do?
SCM-NodeCG combines NodeCG and SpeedControl in order to control marathons ran by the SoulsSpeedrunning community, as well as providing custom layouts for OBS Studio.

This configuration is primarily being used for the Souls Charity Marathons, but has also been adapted for smaller events like the Dark Souls 2 and Bloodborne birthday parties. 

# How to setup
There are two main ways to setup SCM-NodeCG, either building directly with Node, or by using Docker.
The manual approach is preferred. If you are both building and broadcasting on a Windows system, you can zip the entire nodecg folder and transfer it to the other system. No additional dependencies will be required.
Alternatively you can build SCM-NodeCG in Docker using the provided Dockerfile. As this does not bundle all the runtime dependencies (due to building on Linux), it is not frequently tested and you may experience issues.

Before you do either method, ensure you have downloaded the additional bundles and configuration files. Place the "bundles" and "cfg" folders inside the "nodecg" folder.
For SCM these are located in a private Google Drive Folder.
If you are using SCM-NodeCG as a foundation for your own marathon, you can grab the nodecg-speedcontrol bundle (https://github.com/speedcontrol/nodecg-speedcontrol) and copy the example configs from nodecg/cfg/examples to nodecg/cfg.

## Manual configuration

Make sure you have Node.js v22 installed. If you are not already using NVM to manage your Node installations, see the below section on Node version management.
From the root of this repository (where this README is located) run the following commands to install the dependencies and build the layouts.

```npm install```

```npm run build```

Built files will now be located in the "nodecg" folder. Due to limitations with NodeCG we also have to install it in this folder. So navigate into the nodecg folder, and again run:

```npm install```

Optional: If you are a hackermans and want to save some space, you could alternatively symlink the node_modules folder from one level up. Do note that this is not an option if you want to create a portable setup.

You are now ready to launch the NodeCG server with:

```npm run start```

### Node Version Manager
If you require a different version of Node.js for another project, or already have another version installed, we recommend you manage them through NVM.
NVM for Windows (https://github.com/coreybutler/nvm-windows) will allow you to install and switch between multiple versions of Node.
After installing NVM, install Node v24 using ```nvm install 22``` and select it using ```nvm use 22```.

## Docker configuration
Start by setting up Docker Desktop (https://www.docker.com/products/docker-desktop/). You should be able to accept all the default options during the installation process.

Once Docker Desktop is installed, make sure the application is running in the background.

Open a new terminal in the same folder as this README and run the following command to build a new Docker image:

```docker build -t scm-nodecg:latest .```

Once the build is done, start the Docker container with the following command:

```docker run -it -p 9090:9090 -v ./nodecg:/mnt -e OBS_WS_ADDRESS="ws://host.docker.internal:4444" scm-nodecg```

The docker container will now mount all the required folders from the volume and launch the NodeCG server.

# Docker inside WSL
If you are familiar with WSL, or use it for other purposes you might be better off setting up Docker or Podman inside WSL.

The process will be much the same, but binding the volume will require the full path to the nodecg folder, so replace the run command with:

```docker run -it -p 9090:9090 -v $(pwd)/nodecg:/mnt -e OBS_WS_ADDRESS="ws://host.docker.internal:4444" scm-nodecg```

## Updating the layouts
The layouts can be updated while nodecg is already running, but will require a rebuild.

Afterwards, refresh the browser source in OBS to reload the layout.

When running in Docker you have to restart the container after rebuilding.

# Configuration
Configuration files need to be added under nodecg/cfg.
There are example files under nodecg/cfg/examples, but as the actual config files may contain values that should not be made public, they have to be manually copied to the folder above.

## Twitch integration
The nodecg-speedcontrol.json file inside nodecg/cfg/example has Twitch integration enabled, but lacks clientId and clientSecret. Obtain these from the Twitch developer console (https://dev.twitch.tv/console).

# OBS configuration
Under tools > websocket server settings make sure the port is set to 4444 (same as cfg/scm-nodecg.json) and disable authorization (or ensure the passwords match).

After launching nodecg with "npm run start" you should see websocket connection being successful.

If you are not seeing the layout in OBS, try to refresh the browser sources manually. Restarting OBS can also sometimes fix the issue. Otherwise verify the correct scene collection is selected and that all install and build steps for nodecg have been completed.
