import { Actions } from '../states/WorkerTasksState';

import { 
  getTaskFromReservationEvent,
  getWorkerTasksFromState,
  updateWorkerTasks,
} from '../services/WorkerTasks';

const onReservationAcceptedEventHandler = manager => reservation => {
  console.log('onReservationAccepted called!', reservation);
  
  const activeTasks = getWorkerTasksFromState(manager).length + 1;

  updateWorkerTasks(manager)(activeTasks).then(res => console.log('WORKER UPDATED!'));
  manager.store.dispatch(Actions.addTask(getTaskFromReservationEvent(reservation)));
};

export default onReservationAcceptedEventHandler;
