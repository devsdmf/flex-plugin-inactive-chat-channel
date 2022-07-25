import { Actions, DEFAULT_INACTIVATION_TIMEOUT } from '../states/WorkerTasksState';

import { INACTIVE_CHAT_TASK_CHANNEL_NAME } from '../taskChannel/InactiveTaskTaskChannel';

import { 
  getWorkerTasksFromState,
  setTaskToActive,
  setTaskToInactive
} from '../services/WorkerTasks';

const onMessageAddedEventHandler = manager => message => {
  console.log('onMessageAdded called!', message);
  const channelSid = message.channel.sid;

  const task = getWorkerTasksFromState(manager.store.getState())
    .filter(t => t.attributes.channelSid === channelSid)
    .pop();

  const isInactiveTask = task.attributes.inactive === 1;
  const isFromMe = message.author === manager.chatClient.user.identity;

  if (isInactiveTask && !isFromMe) {
    return tryToSetTaskToActive(manager, task);
  }

  if (!isInactiveTask && isFromMe) {
    const handler = setTaskToInactive(manager);
    manager.store.dispatch(Actions.setInactivationScheduler(task.sid, handler));
  } else {
    manager.store.dispatch(Actions.removeInactivationScheduler(channelSid));
  }
};

const tryToSetTaskToActive = (manager, task) => {
  setTaskToActive(manager)(task)
    .then(result => {
      if (!result) {
        setTimeout(() => tryToSetTaskToActive(manager, task), DEFAULT_INACTIVATION_TIMEOUT);
      }
    });
};

export default onMessageAddedEventHandler;
