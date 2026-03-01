# What does this project do?
SCM-NodeCG combines NodeCG and SpeedControl in order to control marathons ran by the SoulsSpeedrunning community, as well as providing custom layouts for OBS Studio. Commonly, this is being used for the Souls Charity Marathons, but has also been adapted for smaller events like the Dark Souls 2 and Bloodborne birthday parties. 

# How to setup
There are two tested ways to setup and SCM-NodeCG, either using Docker or by manually setting up Node.js.
The Docker way is preferred, especially for inexperienced users, as it avoids potential version conflicts for required software like Node and NPM.
The manual way might be easier to work with if you are a developer.

## Docker configuration (REWRITE NEEDED)
Start by setting up Docker Desktop (https://www.docker.com/products/docker-desktop/). You should be able to accept all the default options during the installation process.

Once Docker Desktop is installed, make sure the application is running in the background.

Open a new terminal in the same folder as this README and run the following command to build a new Docker image:

```docker build -t nodecg:latest .```

Once the build is done, start the Docker container with the following command:

```docker run -it -p 9090:9090 -v ./bundles:/app/bundles -v ./cfg:/app/cfg -v ./db:/app/db -v ./logs:/app/logs -v ./scripts:/app/scripts -e OBS_WS_ADDRESS="ws://host.docker.internal:4444" nodecg```

You should now find yourself in a Bash terminal inside the Docker container.
From here you can initialize the project by running the command:

```bash scripts/init.sh```

Everything is now set up to run the app using the following command:

```bash scripts/serve.sh```

By default serve.sh also rebuilds the layout bundle. If no changes have been made since the last build this can be skipped using the --skip-build flag.

## Manual configuration

Make sure you have Node.js v24 installed. If you are not already using NVM to manage your Node installations, see the below section on Node version management.

Open a new terminal in the same folder as this README and run the following command to install the NodeCG CLI (https://www.nodecg.dev/docs/installing/):

```npm install --global nodecg-cli@latest```

Run the following command to install SpeedControl (https://github.com/soulsspeedruns/nodecg-speedcontrol):

```nodecg install soulsspeedruns/nodecg-speedcontrol```

Navigate back to the folder this README is located in and run the following commands to build and launch the NodeCG dashboard:

```npm install```

```npm run build```

```npm run start```

### Node Version Manager
If you require a different version of Node.js for another project, or already have another version installed, we recommend you manage them through NVM.
NVM for Windows (https://github.com/coreybutler/nvm-windows) will allow you to install and switch between multiple versions of Node.
After installing NVM, install Node v24 using ```nvm install 24``` and select it using ```nvm use 24```.

## Updating the layouts
The layouts can be updated while nodecg is already running, but will require a rebuild.

After changes have been made to the sources, navigate to bundles/scm-2019 and run ```npm run build```. If running in Docker you can simply rerun the serve.sh script.

Afterwards, refresh the browser source in OBS to reload the layout.

## Twitch integration
The nodecg-speedcontrol.json file inside has Twitch integration enabled, but lacks clientId and clientSecret. Obtain these from the Twitch developer console (https://dev.twitch.tv/console).

# OBS configuration
Click scene collection > import on the toolbar at the top and import the included scene collection.

Under tools > websocket server settings make sure the port is set to 4444 (same as cfg/scm-nodecg.json) and disable authorization.

After launching nodecg with "npm run start" you should see websocket connection being successful.

If you are not seeing the layout in OBS, try to refresh the browser sources manually. Restarting OBS can also sometimes fix the issue. Otherwise verify the correct scene collection is selected and that all install and build steps for nodecg have been completed.
