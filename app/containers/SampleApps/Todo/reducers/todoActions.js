import * as types from './todoConstants';

export const fetchTasksAction = tasks => ({
  type: types.LOAD_TASKS_DATA,
  tasks
});

export const createTaskAction = title => ({
  type: types.ADD_TASK,
  task: { title, completed: false }
});

export const removeTaskAction = task => ({
  type: types.DELETE_TASK,
  task
});

export const updateTaskAction = (task, changes) => {
  const updatedData = { ...task, ...changes };
  return {
    type: types.EDIT_TASK,
    task: updatedData
  };
};

export const filterTasksAction = filterType => ({
  type: types.FILTER_TASKS_DATA,
  filterType
});
