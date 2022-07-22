import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import { registerTaskChannel } from './taskChannel/InactiveTaskTaskChannel';

import { Actions as WorkerTasksActions } from './states/WorkerTasksState';
import reducers, { namespace } from './states';

import registerEventHandlers from './eventHandlers';

import {
  getWorkerTasksFromReservations,
  updateWorkerTasks,
} from './services/WorkerTasks';

export const PLUGIN_NAME = 'FlexInactiveChatChannelPlugin';

export default class FlexInactiveChatChannelPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    this.registerReducers(manager);

    registerTaskChannel(flex);
    registerEventHandlers(flex, manager);

    // initializing worker tasks
    const workerTasks = getWorkerTasksFromReservations(manager.store.getState());

    updateWorkerTasks(manager)(workerTasks.length);
    manager.store.dispatch(WorkerTasksActions.initWorkerTasks(workerTasks));
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
