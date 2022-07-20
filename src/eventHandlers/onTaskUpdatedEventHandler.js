import { Actions } from '../states/WorkerTasksState';

import { getTaskFromReservationEvent } from '../services/WorkerTasks';

const onTaskUpdatedEventHandler = (manager, reservation) => updatedTask => {
  console.log('onTaskUpdated called!', reservation);

  manager.store.dispatch(Actions.updateTask(getTaskFromReservationEvent({ ...reservation, task: updatedTask })));
};

export default onTaskUpdatedEventHandler;
