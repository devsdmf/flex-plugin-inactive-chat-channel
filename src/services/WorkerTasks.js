
const extractTaskInfo = task => ({
  taskSid: task.sid,
  channel: task.taskChannelUniqueName,
  channelSid: task.taskChannelSid,
  attributes: task.attributes,
});

export const getWorkerTasksFromState = (state) => 
  [...state.flex.worker.tasks].map(([ key, value ]) => ({ key, value }))
    .map(({ key: sid, value: task }) => ({
      sid,
      ...extractTaskInfo(task),
    }));

export const getTaskFromReservationEvent = reservation => ({
  sid: reservation.sid,
  ...extractTaskInfo(reservation.task),
});

