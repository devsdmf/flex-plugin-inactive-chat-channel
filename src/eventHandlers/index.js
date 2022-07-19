import afterAcceptTaskEventHandler from './afterAcceptTaskEventHandler';
import beforeCompleteTaskEventHandler from './beforeCompleteTaskEventHandler';
import onMessageAddedEventHandler from './onMessageAddedEventHandler';

import { PLUGIN_NAME } from '../FlexInactiveChatChannelPlugin';

const registerEventHandlers = (flex, manager) => {
  flex.Actions.addListener('afterAcceptTask', afterAcceptTaskEventHandler(manager));
  flex.Actions.addListener('beforeCompleteTask', beforeCompleteTaskEventHandler(manager));

  const existingChannels = [...manager.chatClient.channels.channels].map(([ key, value ]) => ({ key, value }));
  existingChannels.map(({ key: channelSid, value: channel }) => {
    channel.on('messageAdded', onMessageAddedEventHandler(manager));
  });

  manager.workerClient.on('reservationCreated', reservation => {
    console.log(`${PLUGIN_NAME} RESERVATION CREATED => `, reservation);
    
    reservation.on('accepted', reservation => {
      console.log(`${PLUGIN_NAME} RESERVATION ACCEPTED => `, reservation);

      manager.chatClient.on('channelAdded', channel => {
        console.log(`${PLUGIN_NAME} CHANNEL ADDED ===> `, channel);
        channel.on('messageAdded', onMessageAddedEventHandler(manager));
      });
    });
  });
};

export default registerEventHandlers;
