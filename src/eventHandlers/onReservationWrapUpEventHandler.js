import { Actions } from '../states/WorkerTasksState';

import {
  getWorkerTasksFromState,
  updateWorkerTasks,
} from '../services/WorkerTasks';

const onReservationWrapUpEventHandler = manager => reservation => {
  console.log('onReservationWrapup called!', reservation);

  const activeTasks = getWorkerTasksFromState(manager).length - 1;

  updateWorkerTasks(manager)(activeTasks);
  manager.store.dispatch(Actions.removeTask(reservation.sid));
};

export default onReservationWrapUpEventHandler;
