
const SERVERLESS_DOMAIN = `${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}`;

const DEFAULT_REQUEST_HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
};

const extractTaskInfo = task => ({
  taskSid: task.taskSid ?? task.sid,
  taskChannel: task.taskChannelUniqueName,
  taskChannelSid: task.taskChannelSid,
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

export const setTaskToInactive = manager => async task => {
  const url = `${SERVERLESS_DOMAIN}/set-chat-to-inactive`;

  const options = {
    method: 'POST',
    body: new URLSearchParams({
      taskSid: task.taskSid,
      taskChannelSid: task.taskChannelSid,
      Token: manager.store.getState().flex.session.ssoTokenPayload.token,
    }),
    headers: DEFAULT_REQUEST_HEADERS,
  };

  return fetch(url, options)
    .then(res => res.json())
    .then(data => data.success)
    .catch(err => {
      console.error('[setTaskToInactive] An error ocurred when trying to set task as inactive', err);
      return false;
    });
};

