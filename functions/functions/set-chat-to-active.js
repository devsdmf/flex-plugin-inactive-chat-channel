const TokenValidator = require('twilio-flex-token-validator').functionValidator;

const assets = Runtime.getAssets();
const channelMapper = require(assets['/taskChannels.js'].path);

exports.handler = TokenValidator((context, event, callback) => {
  const res = new Twilio.Response();

  res.appendHeader('Access-Control-Allow-Origin', '*');
  res.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
  res.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const {
    taskSid,
    taskChannelSid,
  } = event;

  const taskChannels = channelMapper.filter(i => i.inactiveChannelSid === taskChannelSid).pop();

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
          taskChannel: taskChannels.activeChannelSid,
          attributes: JSON.stringify({
            ...taskAttributes,
            inactive: 0,
          })
        })
        .then(updatedTask => {
          res.setBody({ success: true });
          return callback(null, res);
        })
        .catch(err => {
          console.error('[set-task-to-active] An error occurred => ', err);
          res.setStatusCode(400);
          res.setBody({ success: false });

          return callback(null, res);
        });
    });
});
