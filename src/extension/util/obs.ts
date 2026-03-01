import { Configschema } from '@src/types/schemas';
import obsWebsocketJs from 'obs-websocket-js';
import { get } from './nodecg';
import { currentOBSScene } from './replicants';

const nodecg = get();
const config = (nodecg.bundleConfig as Configschema).obs;

// Extending the OBS library with some of our own functions.
class OBSUtility extends obsWebsocketJs {
  /**
   * Change to this OBS scene.
   * @param name Name of the scene.
   */
  async changeScene(name: string): Promise<void> {
    try {
      await this.call('SetCurrentProgramScene', { sceneName: name });
    } catch (err: any) {
      nodecg.log.warn(`Cannot change OBS scene [${name}]: ${err.error}`);
      throw err;
    }
  }

  /**
   * Change to the intermission based on name in config.
   */
  async changeToIntermission(): Promise<void> {
    try {
      await this.changeScene(config.names.scenes.intermission);
    } catch (err) {
      // err
    }
  }

  /**
   * Mute or unmute the named OBS source.
   * @param source Name of the source.
   */
  async toggleSourceAudio(source: string, mute = true): Promise<void> {
    try {
      await this.call('SetInputMute', { inputName: source, inputMuted: mute });
    } catch (err: any) {
      nodecg.log.warn(`Cannot mute OBS source [${source}]: ${err.error}`);
      throw err;
    }
  }

  /**
   * Mute all audio sources listed in the config.
   */
  async muteAudio(): Promise<void> {
    config.names.audioToMute.forEach((source) => {
      this.toggleSourceAudio(source, true).catch(() => {});
    });
  }

  /**
   * Unmute all audio sources listed in the config.
   */
  async unmuteAudio(): Promise<void> {
    config.names.audioToUnmute.forEach((source) => {
      this.toggleSourceAudio(source, false).catch(() => {});
    });
  }
}

const obs = new OBSUtility();

function connect() {
  // Allows OBS WebSocket address to be overriden with environment variable. Helpful when running NodeCG inside Docker.
  const address = process.env.OBS_WS_ADDRESS || config.address;

  obs
    .connect(address, config.password)
    .then(() => {
      nodecg.log.info('OBS connection successful.');
    })
    .catch((err) => {
      nodecg.log.warn('OBS connection error:', err);
    });
}

if (config.enable) {
  nodecg.log.info('Setting up OBS connection.');
  connect();
  obs.on('ConnectionClosed', () => {
    nodecg.log.warn('OBS connection lost, retrying in 5 seconds.');
    setTimeout(connect, 5000);
  });

  obs.on('ConnectionError', (err) => {
    nodecg.log.warn('OBS connection error:', err);
  });

  obs.on('CurrentProgramSceneChanged', (data) => {
    currentOBSScene.value = data.sceneName;
  });
}

export default obs;
