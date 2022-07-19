import { Actions } from '../states/WorkerTasksState';

import { getTaskFromReservationEvent } from '../services/WorkerTasks';

const afterAcceptTaskEventHandler = (manager) => (payload) => {
  console.log('afterAcceptTask called!', payload);
  console.log('Adding new task to worker task store...');
  manager.store.dispatch(Actions.addTask(getTaskFromReservationEvent(payload)));
};

export default afterAcceptTaskEventHandler;
