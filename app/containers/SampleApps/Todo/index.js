import React from 'react';
import { List } from 'immutable';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import brand from 'enl-api/dummy/brand';
import { Helmet } from 'react-helmet';
import { bindActionCreators } from 'redux';
import {
  TaskFilters,
  TaskForm,
  TaskList,
  PapperBlock
} from 'enl-components';
import styles from 'enl-components/TodoList/todo-jss';
import { injectIntl, intlShape } from 'react-intl';
import messages from 'enl-components/TodoList/messages';
import { getVisibleTasks } from './reducers/selectors';
import {
  createTaskAction,
  filterTasksAction,
  removeTaskAction,
  updateTaskAction,
  fetchTasksAction
} from './reducers/todoActions';
import data from './api/todoData';

class Todo extends React.Component {
  componentDidMount() {
    const { fetchData } = this.props;
    fetchData(data);
  }

  render() {
    const {
      classes,
      createTask,
      removeTask,
      tasks,
      updateTask,
      filterTasks,
      filterType,
      intl
    } = this.props;
    const title = brand.name + ' - Todo App';
    const description = brand.desc;
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
          <TaskForm handleSubmit={createTask} />
          <div className="g-col">
            <TaskFilters filter={filterTasks} type={filterType} />
            <TaskList
              removeTask={removeTask}
              tasks={tasks}
              updateTask={updateTask}
            />
          </div>
        </PapperBlock>
      </div>
    );
  }
}

Todo.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
  createTask: PropTypes.func.isRequired,
  removeTask: PropTypes.func.isRequired,
  tasks: PropTypes.instanceOf(List),
  updateTask: PropTypes.func.isRequired,
  filterTasks: PropTypes.func.isRequired,
  filterType: PropTypes.string.isRequired,
  intl: intlShape.isRequired
};


Todo.defaultProps = {
  tasks: null
};

const reducerTodo = 'todo';
const mapStateToProps = state => ({
  tasks: getVisibleTasks(state.get(reducerTodo)),
  filterType: state.getIn([reducerTodo, 'filter'])
});

const mapDispatchToProps = dispatch => ({
  fetchData: bindActionCreators(fetchTasksAction, dispatch),
  createTask: bindActionCreators(createTaskAction, dispatch),
  filterTasks: bindActionCreators(filterTasksAction, dispatch),
  removeTask: bindActionCreators(removeTaskAction, dispatch),
  updateTask: bindActionCreators(updateTaskAction, dispatch),
});

const TodoMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Todo);

export default withStyles(styles)(injectIntl(TodoMapped));
