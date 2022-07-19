import { Actions } from '../states/WorkerTasksState';

const beforeCompleteTaskEventHandler = manager => payload => {
  console.log('beforeCompleteTask called!', payload);
  console.log(`Removing task from worker task store`);

  manager.store.dispatch(Actions.removeTask(payload.sid));
};

export default beforeCompleteTaskEventHandler;
