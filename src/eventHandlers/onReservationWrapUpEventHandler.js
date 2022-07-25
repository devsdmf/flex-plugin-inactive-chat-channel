import { Actions } from '../states/WorkerTasksState';

import {
  getWorkerTasksFromState,
} from '../services/WorkerTasks';

const onReservationWrapUpEventHandler = manager => reservation => {
  console.log('onReservationWrapup called!', reservation);

  manager.store.dispatch(Actions.removeTask(reservation.sid));
};

export default onReservationWrapUpEventHandler;
