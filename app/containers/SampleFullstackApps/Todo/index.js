import React from 'react';
import { List } from 'immutable';
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
import { injectIntl, intlShape } from 'react-intl';
import messages from 'enl-components/TodoList/messages';
import { getVisibleTasks } from './reducers/selectors';
import {
  createTaskAction,
  filterTasksAction,
  removeTaskAction,
  updateTaskAction
} from './reducers/todoActions';


class Todo extends React.Component {
  render() {
    const {
      createTask,
      removeTask,
      tasks,
      updateTask,
      filterTasks,
      filterType,
      loading,
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
        >
          <TaskForm handleSubmit={createTask} />
          <div className="g-col">
            <TaskFilters filter={filterTasks} type={filterType} />
            <TaskList
              loading={loading}
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
  createTask: PropTypes.func.isRequired,
  removeTask: PropTypes.func.isRequired,
  tasks: PropTypes.instanceOf(List),
  updateTask: PropTypes.func.isRequired,
  filterTasks: PropTypes.func.isRequired,
  filterType: PropTypes.string,
  loading: PropTypes.bool,
  intl: intlShape.isRequired
};


Todo.defaultProps = {
  tasks: null,
  loading: false,
  filterType: ''
};

const reducerTodo = 'todoFullstack';
const mapStateToProps = state => ({
  tasks: getVisibleTasks(state.get(reducerTodo)),
  filterType: state.getIn([reducerTodo, 'filter']),
  loading: state.getIn([reducerTodo, 'loading']),
});

const mapDispatchToProps = dispatch => ({
  createTask: bindActionCreators(createTaskAction, dispatch),
  filterTasks: bindActionCreators(filterTasksAction, dispatch),
  removeTask: bindActionCreators(removeTaskAction, dispatch),
  updateTask: bindActionCreators(updateTaskAction, dispatch),
});

const TodoMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Todo);

export default injectIntl(TodoMapped);
