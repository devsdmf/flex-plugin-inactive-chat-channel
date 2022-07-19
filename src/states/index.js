import { combineReducers } from 'redux';

import { reduce as WorkerTasksReducer } from './WorkerTasksState';

// Register your redux store under a unique namespace
export const namespace = 'flex-inactive-chat-channel';

// Combine the reducers
export default combineReducers({
  workerTasks: WorkerTasksReducer,
});
