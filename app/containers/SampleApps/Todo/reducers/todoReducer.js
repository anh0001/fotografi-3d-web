import produce from 'immer';
import {
  ADD_TASK,
  FILTER_TASKS_DATA,
  LOAD_TASKS_DATA,
  DELETE_TASK,
  EDIT_TASK
} from './todoConstants';

const initialState = {
  filter: '',
  list: []
};

/* eslint-disable default-case, no-param-reassign */
const todoReducer = (state = initialState, action = {}) => produce(state, draft => {
  switch (action.type) {
    case LOAD_TASKS_DATA:
      draft.list = action.tasks.reverse();
      break;
    case ADD_TASK:
      draft.list.unshift(action.task);
      break;
    case DELETE_TASK: {
      const index = draft.list.findIndex((obj) => obj.key === action.task.key);
      if (index !== -1) {
        draft.list.splice(index, 1);
      }
      break;
    }
    case EDIT_TASK: {
      const index = draft.list.findIndex((obj) => obj.key === action.task.key);
      if (index !== -1) {
        draft.list[index] = action.task;
      }
      break;
    }
    case FILTER_TASKS_DATA:
      draft.filter = action.filterType;
      break;
    default:
      break;
  }
});

export default todoReducer;
