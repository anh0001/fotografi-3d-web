import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import css from 'enl-styles/Table.scss';

const styles = {
  dateButton: {
    '& button': {
      top: 2
    }
  }
};

class DatePickerCell extends React.Component {
  state = {
    event: {
      target: {
        name: this.props.cellData.type, // eslint-disable-line
        value: this.props.cellData.value, // eslint-disable-line
      }
    }
  }

  handleDateChange = date => {
    const { event } = this.state;
    const { branch, updateRow } = this.props;
    event.target.value = date;
    updateRow(event, branch);
  }

  render() {
    const {
      edited,
      cellData,
      theme,
      classes
    } = this.props;
    const { event } = this.state;
    return (
      <TableCell padding="none" className={classNames('text-center', classes.dateButton)} textalign="center">
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <KeyboardDatePicker
            clearable
            name={cellData.type}
            className={classNames(css.crudInput, theme.palette.type === 'dark' ? css.lightTxt : css.darkTxt)}
            format="DD/MM/YYYY"
            placeholder="10/10/2018"
            value={event.target.value}
            disabled={!edited}
            onChange={this.handleDateChange}
            animateYearScrolling={false}
          />
        </MuiPickersUtilsProvider>
      </TableCell>
    );
  }
}

DatePickerCell.propTypes = {
  cellData: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  updateRow: PropTypes.func.isRequired,
  edited: PropTypes.bool.isRequired,
  branch: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(DatePickerCell);
