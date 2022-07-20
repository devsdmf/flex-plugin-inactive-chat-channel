import onReservationAcceptedEventHandler from './onReservationAcceptedEventHandler';
import onReservationWrapUpEventHandler from './onReservationWrapUpEventHandler';
import onMessageAddedEventHandler from './onMessageAddedEventHandler';
import onTaskUpdatedEventHandler from './onTaskUpdatedEventHandler';

import { Actions } from '../states/WorkerTasksState';

import { getTaskFromReservationEvent } from '../services/WorkerTasks';

import { PLUGIN_NAME } from '../FlexInactiveChatChannelPlugin';

const registerEventHandlers = (flex, manager) => {

  const existingReservations = [...manager.workerClient.reservations].map(([ key, value ]) => ({ key, value }));
  existingReservations.map(({ key: reservationSid, value: reservation }) => {
    reservation.on('accepted', onReservationAcceptedEventHandler(manager));
    reservation.on('wrapup', onReservationWrapUpEventHandler(manager));
    reservation.task.on('updated', onTaskUpdatedEventHandler(manager, reservation));
  });

  const existingChannels = [...manager.chatClient.channels.channels].map(([ key, value ]) => ({ key, value }));
  existingChannels.map(({ key: channelSid, value: channel }) => {
    channel.on('messageAdded', onMessageAddedEventHandler(manager));
  });

  manager.workerClient.on('reservationCreated', reservation => {
    reservation.on('accepted', onReservationAcceptedEventHandler(manager));
    reservation.on('wrapup', onReservationWrapUpEventHandler(manager));
    reservation.task.on('updated', onTaskUpdatedEventHandler(manager, reservation));
  });

  manager.chatClient.on('channelAdded', channel => {
    channel.on('messageAdded', onMessageAddedEventHandler(manager));
  });
};

export default registerEventHandlers;
