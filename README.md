# Flex Plugin - Inactive Chat Channel Handler

This is a Flex Plugin to allow developers to manually handle and deactivate chat channels using a secondary task channel. The idea behind this plugin is to free up worker's capacity so workers can handle more tasks while customers are not activelly chatting with them. The plugin works with a pair of TaskChannels for active and inactive tasks, moving "inactive" tasks to the secondary Task Channel and moving it back to the "active" task channel when the user answers the conversation.

## Requirements

- Flex UI 1.31+
- Node 14+
- NPM 6.14+
- [Twilio CLI 3.14+](https://www.twilio.com/docs/twilio-cli/quickstart#install-twilio-cli)
- [Flex Plugin for Twilio CLI](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins)
- [Serverless Plugin for Twilio CLI](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins)
- [Twilio CLI Profile configured with your account credentials](https://www.twilio.com/docs/twilio-cli/general-usage#profiles)

## Setup

### Cloning the repository

First things first, you need to clone this repository using the following command: 

```bash
$ git clone https://github.com/devsdmf/flex-plugin-inactive-chat-channel.git
$ cd flex-plugin-inactive-chat-channel
```

### Installing dependencies

Now, you need to install the dependencies for both the plugin and the serverless functions:

```bash
$ cd functions/ && npm install
$ cd ../ && npm install
```

### Configuring and Deploying Serverless Functions

On the `/functions` folder, we have our backend services developed using Twilio Functions, these functions are responsible to inactivate and activate a given task, moving it between different Task Channels. We need to setup a few things prior to deploy the functions.

First, make a copy on the `.env.sample` file that is located under the `/functions` folder, and update the parameters accordingly to the following list:

- *ACCOUNT_SID*: Your account SID which can be found on your Twilio Console's dashboard
- *AUTH_TOKEN*: Your account authenticatio token, which can be found on your Twilio Console's dashboard
- *TASKROUTER_WORKSPACE_SID*: Your TaskRouter's Workspace, which can be found on Twilio Console -> TaskRouter -> Workspaces, and has the format `WSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

Now, we need to setup the Task Channels, under `/functions/assets/` open the file called `taskChannels.private.js` and replace the default values with the corresponding values:

- *activeChannelSid*: The SID of your current chat channel, which can be found on Twilio Console -> TaskRouter -> Workspaces -> Flex Task Assignment -> Task Channels. This channel will be the channel Programmable Chat, copy The SID and paste it on the configuration file.
- *inactiveChannelSid*: The SID of the inactivated tasks Task Channel, in this case, you will need to create a new Task Channel on TaskRouter and copy the new SID into the configuration file.

Now, under the `/functions` folder, run the following command to deploy the functions on your Twilio account:

```bash
$ cd /functions
$ twilio serverless:deploy 
```

The output of this command will print the service domain, save it in a safe place because we will need it in the following steps, the output will be something like this:

```
Deploying functions & assets to the Twilio Runtime

Username        SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Password        SHXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Service Name    plugin-inactive-chat-channel
Environment     dev
Root Directory  /path/to/flex-plugin-inactive-chat-channel/functions
Dependencies    @twilio/runtime-handler, twilio, twilio-flex-token-validator
Env Variables   TASKROUTER_WORKSPACE_SID
Runtime         node14

✔ Serverless project successfully deployed

Deployment Details
Domain: plugin-inactive-chat-channel-XXXX-dev.twil.io
Service:
   plugin-inactive-chat-channel (ZSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX)
Environment:
   dev (ZEXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX)
Build SID:
   ZBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Runtime:
   node14
View Live Logs:
   https://www.twilio.com/console/functions/editor/ZSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/environment/ZEXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Functions:
   https://plugin-inactive-chat-channel-XXXX-dev.twil.io/set-chat-to-active
   https://plugin-inactive-chat-channel-XXXX-dev.twil.io/set-chat-to-inactive
Assets:
   [private] Runtime.getAssets()['/taskChannels.js']
```

### Configuring and Deploying Flex Plugin

After completed the serverless functions setup, we need to deploy the Flex Plugin that will actually control the channel activation/deactivation through the use of Redux stores and events triggered from Flex.

On the root folder of this project, we have the plugin code with a few event listeners that will be triggered whenever one of the following actions happens: reservationAccepted, reservationWrapup, onMessageAdded, onTaskUpdated. These event listeners will store in Redux the worker's tasks and will manage any channel that needs to be deactivated or reactivated accordingly to the specified rules.

The only configuration that is needed on the plugin side is the URL for the serveless functions that will be called during the channel manager logic, so make a copy of the `.env.sample` file to a `.env` file in the root of the project directory and update the following variable as described below:

- *FLEX_APP_TWILIO_SERVERLESS_DOMAIN*: The URL of your serverless service created in the previous step, it has the format https://plugin-inactive-chat-channel-XXXX-dev.twil.io

With the configuration done, you can move forwrad to the deployment of the plugin using the following command:

```bash
$ twilio flex:plugins:deploy --changelog="First version"
```

The output of this command will be something like the following example, also, it has a _Next steps_ section that you need to execute after executing the deployment, so just copy it, paste and run in your terminal:

```
Using profile lucas-cc (ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX)

✔ Validating deployment of plugin flex-plugin-inactive-chat-channel
✔ Compiling a production build of flex-plugin-inactive-chat-channel
✔ Uploading flex-plugin-inactive-chat-channel
✔ Registering plugin flex-plugin-inactive-chat-channel with Plugins API
✔ Registering version v0.0.1 with Plugins API

🚀 Plugin (private) flex-plugin-inactive-chat-channel@0.0.1 was successfully deployed using Plugins API

Next Steps:
Run $ twilio flex:plugins:release --plugin flex-plugin-inactive-chat-channel@0.0.1 --name "Autogenerated Release 1658790094281" --description "The description of this Flex Plugin Configuration." to enable this plugin on your Flex application
```

After running the `twilio flex:plugins:release` command, we are ready to go!

### Configuring the Inactivation Timeout

The inactivation timeout is set by default for 10 seconds, that means, 10 seconds after the worker send the last message, the chat channel will be deactivated unless the counterpart sends a new message and cancel the scheduler. In case a chat channel is deactivated, it will reactivate as soon as the user sends a new message. To configure a higher timeout, you just need to update the constant `DEFAULT_INACTIVATION_TIMEOUT` on the file `states/WorkerTasksState.js`, like in the following example:

```
states/WorkerTasksState.js

[...]

const ACTION_SET_INACTIVATION_SCHEDULER = 'SET_INACTIVATION_SCHEDULER';
const ACTION_CLEAR_INACTIVATION_SCHEDULER = 'CLEAR_INACTIVATION_SCHEDULE';

export const DEFAULT_INACTIVATION_TIMEOUT = 600000; // 10-min timeout example

const initialState = {
  tasks: [],
};

[...]
```

After updating the timeout, remember the follow the deployment steps again.

## Disclaimer

This software is to be considered "sample code", a Type B Deliverable, and is delivered "as-is" to the user. Twilio bears no responsibility to support the use or implementation of this software.

## License

This project is licensed under the [MIT License](LICENSE), that means that is free to use, copy and modified for your own intents.
