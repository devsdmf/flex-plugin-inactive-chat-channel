
const ACTION_INIT_WORKER_TASKS = 'INIT_WORKER_TASKS';
const ACTION_ADD_TASK = 'ADD_NEW_TASK';
const ACTION_UPDATE_TASK = 'UPDATE_TASK';
const ACTION_REMOVE_TASK = 'REMOVE_TASK';
const ACTION_SET_INACTIVATION_SCHEDULER = 'SET_INACTIVATION_SCHEDULER';
const ACTION_CLEAR_INACTIVATION_SCHEDULER = 'CLEAR_INACTIVATION_SCHEDULE';

const DEFAULT_INACTIVATION_TIMEOUT = 5000;

const initialState = {
  tasks: [],
};

export const Actions = {
  initWorkerTasks: tasks => ({
    type: ACTION_INIT_WORKER_TASKS,
    payload: tasks,
  }),
  addTask: task => ({
    type: ACTION_ADD_TASK,
    payload: task,
  }),
  updateTask: task => ({
    type: ACTION_UPDATE_TASK,
    payload: task
  }),
  removeTask: taskSid => ({
    type: ACTION_REMOVE_TASK,
    payload: taskSid,
  }),
  setInactivationScheduler: (channelSid, handler) => ({
    type: ACTION_SET_INACTIVATION_SCHEDULER,
    payload: { channelSid, handler },
  }),
  removeInactivationScheduler: channelSid => ({
    type: ACTION_CLEAR_INACTIVATION_SCHEDULER,
    payload: { channelSid },
  }),
};

export const reduce = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_INIT_WORKER_TASKS:
      return { ...state, tasks: action.payload };
    case ACTION_ADD_TASK:
      return { ...state, tasks: state.tasks.concat([action.payload]) };
    case ACTION_UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task => task.taskSid === action.payload.taskSid ? action.payload : task),
      };
    case ACTION_REMOVE_TASK:
      return { ...state, tasks: state.tasks.filter(t => t.sid !== action.payload) };
    case ACTION_SET_INACTIVATION_SCHEDULER:
      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.inactivateAt) {
            clearTimeout(task.inactivateAt);
          }

          if (task.attributes.channelSid === action.payload.channelSid) {
            return {
              ...task,
              inactivateAt: setTimeout(action.payload.handler, DEFAULT_INACTIVATION_TIMEOUT, task),
            };
          }

          return task;
        }),
      };
    case ACTION_CLEAR_INACTIVATION_SCHEDULER:
      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.attributes.channelSid === action.payload.channelSid &&
            task.inactivateAt !== undefined
          ) {
            clearTimeout(task.inactivateAt);

            return {
              ...task,
              inactivateAt: undefined,
            };
          }

          return task;
        }),
      };
    default:
      return state;
  }
};
