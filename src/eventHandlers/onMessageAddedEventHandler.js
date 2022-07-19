import { Actions } from '../states/WorkerTasksState';

const onMessageAddedEventHandler = manager => message => {
  console.log('onMessageAdded called!', message);

  const isFromMe = message.author === manager.chatClient.user.identity;
  console.log('isFromMe => ', isFromMe);

  const channelSid = message.channel.sid;

  if (isFromMe) {
    const handler = () => console.log('CHANNEL MUST BE DEACTIVATED!!!!');
    manager.store.dispatch(Actions.setInactivationScheduler(channelSid, handler));
  } else {
    manager.store.dispatch(Actions.removeInactivationScheduler(channelSid));
  }
};

export default onMessageAddedEventHandler;
