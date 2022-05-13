import produce from 'immer';
import {
  CREATE_TASK_FULFILLED,
  FILTER_TASKS,
  LOAD_TASKS_FULFILLED,
  REMOVE_TASK_FULFILLED,
  UPDATE_TASK_FULFILLED
} from './todoConstants';

const initialState = {
  filter: '',
  list: [],
  loading: true,
};

/* eslint-disable default-case, no-param-reassign */
const todoReducer = (state = initialState, action = {}) => produce(state, draft => {
  switch (action.type) {
    case LOAD_TASKS_FULFILLED:
      draft.list = action.payload.tasks.reverse();
      draft.loading = false;
      break;
    case CREATE_TASK_FULFILLED:
      draft.list.unshift(action.payload.task);
      break;
    case FILTER_TASKS:
      draft.filter = action.payload.filterType || '';
      break;
    case REMOVE_TASK_FULFILLED: {
      const index = draft.list.findIndex((obj) => obj.key === action.payload.task.key);
      if (index !== -1) {
        draft.list.splice(index, 1);
      }
      break;
    }
    case UPDATE_TASK_FULFILLED: {
      const index = draft.list.findIndex((obj) => obj.key === action.payload.task.key);
      if (index !== -1) {
        draft.list[index] = action.payload.task;
      }
      break;
    }
    default:
      break;
  }
});

export default todoReducer;
