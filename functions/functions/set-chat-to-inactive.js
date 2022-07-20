const TokenValidator = require('twilio-flex-token-validator').functionValidator;

const assets = Runtime.getAssets();
const channelMapper = assets['taskChannels.js'];

exports.handler = TokenValidator((context, event, callback) => {
  const res = new Twilio.Response();

  res.appendHeader('Access-Control-Allow-Origin', '*');
  res.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
  res.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const {
    taskSid,
    taskChannelSid,
  } = event;

  const taskChannels = channelMapper.filter(i => i.activeChannelSid === taskChannelSid).pop();

  if (taskChannels === undefined) {
    res.setStatusCode(400);
    res.setBody({ error: 'TaskChannel is not mapped' });

    return callback(null, res);
  }

  const client = context.getTwilioClient();

  return client.taskrouter.v1.workspaces(context.TASKROUTER_WORKSPACE_SID)
    .tasks(taskSid)
    .fetch()
    .then(task => {
      const taskAttributes = JSON.parse(task.attributes);
      
      return client.taskrouter.v1.workspaces(context.TASKROUTER_WORKSPACE_SID)
        .tasks(taskSid)
        .update({
          taskChannel: taskChannels.inactiveChannelSid,
          attributes: JSON.stringify({
            ...taskAttributes,
            inactive: 1,
          })
        })
        .then(updatedTask => {
          res.setBody({ success: true });
          return callback(null, res);
        });
    });
});
