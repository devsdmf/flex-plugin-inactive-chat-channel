import { Actions } from '../states/WorkerTasksState';

import { getTaskFromReservationEvent } from '../services/WorkerTasks';

const onReservationAcceptedEventHandler = manager => reservation => {
  console.log('onReservationAccepted called!', reservation);

  manager.store.dispatch(Actions.addTask(getTaskFromReservationEvent(reservation)));
};

export default onReservationAcceptedEventHandler;
