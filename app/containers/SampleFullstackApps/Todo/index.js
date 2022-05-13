import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import brand from 'enl-api/dummy/brand';
import { Helmet } from 'react-helmet';
import {
  TaskFilters,
  TaskForm,
  TaskList,
  PapperBlock
} from 'enl-components';
import styles from 'enl-components/TodoList/todo-jss';
import { injectIntl } from 'react-intl';
import messages from 'enl-components/TodoList/messages';
import { getVisibleTasks } from './reducers/selectors';
import {
  createTaskAction,
  filterTasksAction,
  removeTaskAction,
  updateTaskAction
} from './reducers/todoActions';

function Todo(props) {
  const { classes, intl } = props;
  const title = brand.name + ' - Todo App';
  const description = brand.desc;

  // Redux State
  const tasks = useSelector(state => getVisibleTasks(state.todoFullstack));
  const filterType = useSelector(state => state.todoFullstack.filter);
  const loading = useSelector(state => state.todoFullstack.loading);

  // Dispatcher
  const createTask = useDispatch();
  const filterTasks = useDispatch();
  const removeTask = useDispatch();
  const updateTask = useDispatch();

  const handleUpdate = (todo, change) => {
    updateTask(updateTaskAction(todo, change));
  };

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      <PapperBlock
        title={intl.formatMessage(messages.title)}
        icon="playlist_add_check"
        noMargin
        whiteBg
        colorMode="light"
        desc={intl.formatMessage(messages.subtitle)}
        className={classes.root}
      >
        <TaskForm handleSubmit={(payload) => createTask(createTaskAction(payload))} />
        <div className="g-col">
          <TaskFilters filter={(payload) => filterTasks(filterTasksAction(payload))} type={filterType} />
          <TaskList
            loading={loading}
            removeTask={(payload) => removeTask(removeTaskAction(payload))}
            tasks={tasks}
            updateTask={handleUpdate}
          />
        </div>
      </PapperBlock>
    </div>
  );
}

Todo.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired
};

export default withStyles(styles)(injectIntl(Todo));
