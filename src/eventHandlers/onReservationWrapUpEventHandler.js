import { Actions } from '../states/WorkerTasksState';

const onReservationWrapUpEventHandler = manager => reservation => {
  console.log('onReservationWrapup called!', reservation);

  manager.store.dispatch(Actions.removeTask(reservation.sid));
};

export default onReservationWrapUpEventHandler;
