import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import {
  ContactList,
  ContactDetail,
  AddContact,
  Notification
} from 'enl-components';
import styles from 'enl-components/Contact/contact-jss';
import {
  createAction,
  updateAction,
  deleteAction,
  showDetailAction,
  hideDetailAction,
  editAction,
  addAction,
  closeAction,
  searchAction,
  closeNotifAction
} from './reducers/contactActions';
import uploadImg from './helpers/uploadImg';

class Contact extends React.Component {
  state = {
    uploadSubmiting: false
  };

  submitContact = (item, avatar) => {
    const {
      create, update,
      dataContact, itemSelected, selectedId,
    } = this.props;

    const value = item.toJS();
    this.setState({ uploadSubmiting: true });
    console.log(avatar);
    if (value.key === selectedId) { // Update contact
      const contact = dataContact.get(itemSelected);
      uploadImg(avatar, async (url) => {
        value.avatar = url || null;
        update(contact, value);
        this.setState({ uploadSubmiting: false });
      });
    } else { // Create new contact
      uploadImg(avatar, async (url) => {
        value.avatar = url || null;
        create(value);
        this.setState({ uploadSubmiting: false });
      });
    }
  }

  render() {
    const title = brand.name + ' - Contact';
    const description = brand.desc;
    const {
      classes,
      dataContact, itemSelected,
      showDetail, hideDetail,
      avatarInit,
      open, showMobileDetail,
      add, edit, close,
      remove, update,
      keyword, search, loading,
      closeNotif, messageNotif
    } = this.props;
    const { uploadSubmiting } = this.state;
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
        <Notification close={() => closeNotif()} message={messageNotif} />
        <div className={classNames(classes.root, classes.padding)}>
          <ContactList
            addFn
            total={dataContact.size}
            addContact={add}
            clippedRight
            itemSelected={itemSelected}
            dataContact={dataContact}
            showDetail={showDetail}
            search={search}
            keyword={keyword}
            loading={loading}
          />
          <ContactDetail
            showMobileDetail={showMobileDetail}
            hideDetail={hideDetail}
            dataContact={dataContact}
            itemSelected={itemSelected}
            edit={edit}
            remove={remove}
            favorite={update}
            loading={loading}
          />
        </div>
        <AddContact
          addContact={add}
          openForm={open}
          closeForm={close}
          submit={this.submitContact}
          avatarInit={avatarInit}
          processing={uploadSubmiting}
        />
      </div>
    );
  }
}

Contact.propTypes = {
  classes: PropTypes.object.isRequired,
  dataContact: PropTypes.object.isRequired,
  create: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  selectedId: PropTypes.string.isRequired,
  avatarInit: PropTypes.string.isRequired,
  showDetail: PropTypes.func.isRequired,
  hideDetail: PropTypes.func.isRequired,
  keyword: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  showMobileDetail: PropTypes.bool.isRequired,
  add: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  itemSelected: PropTypes.number.isRequired,
  closeNotif: PropTypes.func.isRequired,
  messageNotif: PropTypes.string.isRequired,
};

Contact.defaultProps = {
  loading: false
};

const reducer = 'contactFullstack';
const mapStateToProps = state => ({
  selectedId: state.getIn([reducer, 'selectedId']),
  avatarInit: state.getIn([reducer, 'avatarInit']),
  dataContact: state.getIn([reducer, 'contactList']),
  itemSelected: state.getIn([reducer, 'selectedIndex']),
  keyword: state.getIn([reducer, 'keywordValue']),
  loading: state.getIn([reducer, 'loading']),
  open: state.getIn([reducer, 'openFrm']),
  showMobileDetail: state.getIn([reducer, 'showMobileDetail']),
  messageNotif: state.getIn([reducer, 'notifMsg']),
  ...state
});

const constDispatchToProps = dispatch => ({
  create: bindActionCreators(createAction, dispatch),
  update: bindActionCreators(updateAction, dispatch),
  remove: bindActionCreators(deleteAction, dispatch),
  hideDetail: () => dispatch(hideDetailAction),
  showDetail: bindActionCreators(showDetailAction, dispatch),
  edit: bindActionCreators(editAction, dispatch),
  add: () => dispatch(addAction),
  close: () => dispatch(closeAction),
  search: bindActionCreators(searchAction, dispatch),
  closeNotif: () => dispatch(closeNotifAction),
});

const ContactMapped = connect(
  mapStateToProps,
  constDispatchToProps
)(Contact);

export default withStyles(styles)(ContactMapped);
