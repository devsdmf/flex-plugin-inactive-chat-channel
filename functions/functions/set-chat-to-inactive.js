const TokenValidator = require('twilio-flex-token-validator').functionValidator;

const assets = Runtime.getAssets();
const channelMapper = require(assets['/taskChannels.js'].path);

exports.handler = TokenValidator((context, event, callback) => {
  const response = new Twilio.Response();

  response.setStatusCode(200);
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  const {
    taskSid,
    taskChannelSid,
  } = event;

  const taskChannels = channelMapper.filter(i => i.activeChannelSid === taskChannelSid).pop();

  if (taskChannels === undefined) {
    response.setStatusCode(400);
    response.setBody({ error: 'TaskChannel is not mapped' });

    return callback(null, response);
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
          response.setBody({ success: true });
          return callback(null, response);
        });
    })
    .catch(err => {
      console.error('[set-task-to-inactive] An error has occurred => ', err);
      response.setStatusCode(404);
      response.setBody({ success: false });

      return callback(null, response);
    });
});
