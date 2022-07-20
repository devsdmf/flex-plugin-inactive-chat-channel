
const DEFAULT_TASK_CHANNEL_NAME = 'inactive-chat';

export const registerTaskChannel = flex => {
  const channelDefinition = flex.DefaultTaskChannels.createChatTaskChannel(
    DEFAULT_TASK_CHANNEL_NAME,
    task => task.attributes.inactive == 1,
  );

  flex.TaskChannels.register(channelDefinition);
};
