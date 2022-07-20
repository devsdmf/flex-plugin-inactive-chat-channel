import { Actions } from '../states/WorkerTasksState';

import { setTaskToInactive } from '../services/WorkerTasks';

const onMessageAddedEventHandler = manager => message => {
  console.log('onMessageAdded called!', message);

  const isFromMe = message.author === manager.chatClient.user.identity;
  console.log('isFromMe => ', isFromMe);

  const channelSid = message.channel.sid;

  if (isFromMe) {
    const handler = setTaskToInactive(manager);
    manager.store.dispatch(Actions.setInactivationScheduler(channelSid, handler));
  } else {
    manager.store.dispatch(Actions.removeInactivationScheduler(channelSid));
  }
};

export default onMessageAddedEventHandler;
