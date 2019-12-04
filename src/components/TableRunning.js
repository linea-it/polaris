import * as React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import {
  PagingState,
  SortingState,
  CustomPaging,
  SearchState,
  SelectionState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  PagingPanel,
  TableColumnResizing,
  Toolbar,
  SearchPanel,
  TableSelection,
  TableColumnVisibility,
} from '@devexpress/dx-react-grid-material-ui';

import CircularProgress from '@material-ui/core/CircularProgress';

import Centaurus from '../api';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TableDataset from './TableDataset';
import CustomColumnChooser from './CustomColumnChooser';
import CustomTableHeaderRowCell from './CustomTableHeaderRowCell';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AccessAlarm from '@material-ui/icons/AccessAlarm';
import SettingsIcon from '@material-ui/icons/Settings';
import TimeProfile from './TimeProfile';
import convert from 'xml-js';
import ProcessConfiguration from './ProcessConfiguration';

const styles = {
  wrapPaper: {
    position: 'relative',
    paddingTop: '10px',
  },
  btn: {
    textTransform: 'none',
    padding: '1px 5px',
    width: '5em',
    minHeight: '1em',
    display: 'block',
    textAlign: 'center',
    lineHeight: '2',
    boxShadow:
      '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  btnSuccess: {
    backgroundColor: 'green',
    color: '#fff',
  },
  btnFailure: {
    backgroundColor: 'red',
    color: '#fff',
  },
  btnRunning: {
    backgroundColor: '#ffba01',
    color: '#000',
  },
  iconCheck: {
    color: 'green',
  },
  itemLink: {
    color: 'blue',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  formControl: {
    width: '180px',
    position: 'absolute',
    top: '8px',
    left: '24px',
    zIndex: '999',
  },
  processIdBtn: {
    color: 'blue',
    fontWeight: 'normal',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
};

class TableMyProcesses extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      columns: [
        { name: 'processes_process_id', title: 'Process ID' },
        { name: 'processes_start_time', title: 'Start Date' },
        { name: 'duration', title: 'Duration' },
        { name: 'processes_name', title: 'Pipeline' },
        { name: 'time_profile', title: 'Time Profile' },
        { name: 'execution_detail', title: 'Execution Detail' },
        { name: 'processes_instance', title: 'Instance' },
        { name: 'releasetag_release_display_name', title: 'Release' },
        { name: 'fields_display_name', title: 'Dataset' },
        { name: 'tguser_display_name', title: 'Owner' },
        { name: 'processstatus_display_name', title: 'Status' },
        { name: 'saved', title: 'Saved' },
        { name: 'processes_published_date', title: 'Published' },
      ],
      defaultColumnWidths: [
        { columnName: 'processes_process_id', width: 140 },
        { columnName: 'processes_start_time', width: 120 },
        { columnName: 'processes_start_date', width: 120 },
        { columnName: 'duration', width: 110 },
        { columnName: 'processes_name', width: 140 },
        { columnName: 'time_profile', width: 140 },
        { columnName: 'execution_detail', width: 140 },
        { columnName: 'processes_instance', width: 140 },
        { columnName: 'releasetag_release_display_name', width: 110 },
        { columnName: 'fields_display_name', width: 140 },
        { columnName: 'tguser_display_name', width: 180 },
        { columnName: 'processstatus_display_name', width: 110 },
        { columnName: 'saved', width: 100 },
        { columnName: 'processes_published_date', width: 130 },
      ],
      data: [],
      sorting: [{ columnName: 'processes_process_id', direction: 'desc' }],
      totalCount: 0,
      pageSize: 10,
      pageSizes: [5, 10, 15],
      currentPage: 0,
      loading: true,
      after: '',
      selection: [],
      filter: 'all',
      searchValue: '',
      visible: false,
      modalType: '',
      rowsDatasetRunning: [],
      chooserAllChecked: true,
      timeProfileData: [],
      isProcessConfigurationVisible: false,
      processConfiguration: {},
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.loadData();
  }

  changeSorting = sorting => {
    this.setState(
      {
        loading: true,
        sorting,
      },
      () => this.loadData()
    );
  };

  changeCurrentPage = currentPage => {
    var offset = currentPage * this.state.pageSize;

    const after = window.btoa('arrayconnection:' + (offset - 1));
    this.setState(
      {
        loading: true,
        currentPage,
        after: after,
      },
      () => this.loadData()
    );
  };

  changePageSize = pageSize => {
    const { totalCount, currentPage: stateCurrentPage } = this.state;
    const totalPages = Math.ceil(totalCount / pageSize);
    const currentPage = Math.min(stateCurrentPage, totalPages - 1);

    this.setState(
      {
        loading: true,
        pageSize,
        currentPage,
      },
      () => this.loadData()
    );
  };

  changeSearchValue = searchValue => {
    this.clearData();
    this.setState(
      {
        loading: true,
        searchValue,
      },
      () => this.loadData()
    );
  };

  handleSelection = selected => {
    this.setState({ selected: selected });
  };

  changeSelection = selection => {
    // Neste caso a selecao e para uma linha apenas,
    var selected_id, selectedRow;
    if (selection.length > 0) {
      // comparar a selecao atual com a anterior para descobrir qual
      // linha foi selecionado por ultimo
      const diff = selection.filter(x => !this.state.selection.includes(x));

      selection = diff;
      selected_id = diff[0];
      selectedRow = this.state.data[selected_id];
    } else {
      selection = [];
      selectedRow = null;
    }

    this.setState(
      {
        selection,
        selectedRow,
      },
      this.handleSelection(selectedRow)
    );
  };

  clearData = () => {
    this.setState({
      data: [],
      loading: false,
      currentPage: 0,
      after: '',
    });
  };

  loadData = async () => {
    const { sorting, pageSize, after, filter, searchValue } = this.state;

    const processesList = await Centaurus.getAllProcessesList(
      sorting,
      pageSize,
      after,
      filter,
      searchValue
    );

    if (
      processesList &&
      processesList.processesList &&
      processesList.processesList.edges
    ) {
      const processesListLocal = processesList.processesList.edges.map(row => {
        const startDateSplit = row.node.startTime
          ? row.node.startTime.split('T')[1]
          : null;
        const startTimeSplit = row.node.startTime
          ? row.node.startTime.split('T')[0]
          : null;
        const startTime = moment(row.node.startTime);
        const endTime = moment(row.node.endTime);
        const diff = endTime.diff(startTime);
        const duration = moment.utc(diff).format('HH:mm:ss');

        return {
          processes_process_id: row.node.processId,
          processes_start_date: startDateSplit,
          processes_start_time: startTimeSplit,
          duration:
            row.node.startTime && row.node.endTime !== null ? duration : '-',
          processes_name: row.node.name,
          processes_instance: row.node.instance,
          releasetag_release_display_name:
            row.node.fields.edges.length !== 0
              ? row.node.fields.edges.map(edge => {
                  return edge.node.releaseTag.releaseDisplayName;
                })
              : '-',
          fields_display_name:
            row.node.fields.edges.length !== 0
              ? row.node.fields.edges.map(edge => {
                  return edge.node.displayName;
                })
              : '-',
          tguser_display_name: row.node.session.user.displayName,
          processstatus_display_name: row.node.processStatus.name,
          saved: row.node.savedProcesses,
          processes_published_date: row.node.publishedDate,
          xmlConfig: row.node.xmlConfig,
        };
      });
      this.setState({
        data: processesListLocal,
        totalCount: parseInt(processesList.processesList.totalCount),
        cursor: processesList.processesList.pageInfo,
        loading: false,
      });
    } else {
      this.clearData();
    }
  };

  handleChangeFilter = evt => {
    const filter = evt.target.value;
    const filterOld = this.state.filterOld;
    const totalCount = this.state.totalCount;

    const initialState = this.initialState;
    initialState.loading = true;
    initialState.filter = filter;
    initialState.filterOld = filterOld;
    initialState.totalCount = parseInt(totalCount);

    this.setState(initialState, () => this.loadData());
  };

  handleExecutionDetailClick = rowData => {
    const configuration = JSON.parse(
      convert.xml2json(rowData.xmlConfig, { compact: true })
    );

    this.setState({
      isProcessConfigurationVisible: true,
      processConfiguration: configuration,
    });
  };

  handleProcessConfigurationClose = () => {
    this.setState({
      isProcessConfigurationVisible: false,
      processConfiguration: {},
    });
  };

  renderProcessesId = rowData => {
    if (rowData.processes_process_id) {
      return (
        <span title={rowData.processes_process_id}>
          {rowData.processes_process_id}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderExecutionDetail = rowData => {
    if (rowData.processes_process_id) {
      return (
        <React.Fragment>
          <Button
            style={styles.btnIco}
            onClick={() => this.handleExecutionDetailClick(rowData)}
          >
            <SettingsIcon />
          </Button>
        </React.Fragment>
      );
    }
    return '-';
  };

  renderStartTime = rowData => {
    if (rowData.processes_start_time) {
      return (
        <span title={rowData.processes_start_date}>
          {rowData.processes_start_time}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderDuration = rowData => {
    if (rowData.duration) {
      return <span title={rowData.duration}>{rowData.duration}</span>;
    } else {
      return '-';
    }
  };

  renderName = rowData => {
    if (rowData.processes_name) {
      return (
        <span title={rowData.processes_name}>{rowData.processes_name}</span>
      );
    } else {
      return '-';
    }
  };

  renderInstance = rowData => {
    if (rowData.processes_instance) {
      return (
        <span title={rowData.processes_instance}>
          {rowData.processes_instance}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderTimeProfile = rowData => {
    if (rowData.processes_process_id) {
      return (
        <React.Fragment>
          <Button
            style={styles.btnIco}
            onClick={() => this.onShowProcessPlot(rowData.processes_process_id)}
          >
            <AccessAlarm />
          </Button>
        </React.Fragment>
      );
    } else {
      return '-';
    }
  };

  renderModal = () => {
    if (this.state.modalType === 'Datasets') {
      return (
        <Dialog
          onClose={this.onHideModal}
          open={this.state.visible}
          aria-labelledby={this.state.modalType}
          maxWidth={this.state.modalType === 'Profile' ? 'lg' : 'sm'}
        >
          <TableDataset
            rowsDatasetRunning={this.state.rowsDatasetRunning}
            loadData={this.loadData}
          />
        </Dialog>
      );
    } else if (this.state.modalType === 'Profile') {
      if (this.state.timeProfileData && this.state.timeProfileData.length > 0) {
        return (
          <Dialog
            onClose={this.onHideModal}
            open={this.state.visible}
            aria-labelledby={this.state.modalType}
            maxWidth={this.state.modalType === 'Profile' ? 'lg' : 'sm'}
          >
            <TimeProfile data={this.state.timeProfileData} />
          </Dialog>
        );
      }
      return (
        <Dialog
          onClose={this.onHideModal}
          open={this.state.visible}
          aria-labelledby={this.state.modalType}
          maxWidth={this.state.modalType === 'Profile' ? 'lg' : 'sm'}
        >
          <DialogTitle>Time Profiler</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Unable to generate plot due to a lack of data!
              <br />
              Please, verify the status of the process you are trying to
              analyze.
            </DialogContentText>
          </DialogContent>
        </Dialog>
      );
    }
  };

  onShowDatasets = rows => {
    this.onClickModal(rows, 'Datasets');
    this.setState({
      rowsDatasetRunning: rows,
    });
  };

  onShowProcessPlot = process => {
    this.onClickModal(process, 'Profile');
  };

  renderRelease = rowData => {
    if (rowData.releasetag_release_display_name) {
      return (
        <span title={rowData.releasetag_release_display_name}>
          {rowData.releasetag_release_display_name}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderDataset = rowData => {
    if (rowData.fields_display_name) {
      const releases = rowData.releasetag_release_display_name;
      const datasets = rowData.fields_display_name;
      if (datasets.length > 1) {
        const rows = datasets.map((el, i) => {
          return {
            dataset: el,
            release: releases[i],
          };
        });

        return (
          <React.Fragment>
            <Button
              style={styles.btnIco}
              onClick={() => this.onShowDatasets(rows)}
            >
              <Icon>format_list_bulleted</Icon>
            </Button>
          </React.Fragment>
        );
      }

      return (
        <span title={rowData.fields_display_name}>
          {rowData.fields_display_name}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderOwner = rowData => {
    if (rowData.tguser_display_name) {
      return (
        <span title={rowData.tguser_display_name}>
          {rowData.tguser_display_name}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderStatus = rowData => {
    const { classes } = this.props;
    if (rowData.processstatus_display_name === 'failure') {
      return (
        <span
          className={classes.btn}
          style={styles.btnFailure}
          title={rowData.processstatus_display_name}
        >
          Failure
        </span>
      );
    } else if (rowData.processstatus_display_name === 'running') {
      return (
        <span
          className={classes.btn}
          style={styles.btnRunning}
          title={rowData.processstatus_display_name}
        >
          Running
        </span>
      );
    } else {
      return (
        <span
          className={classes.btn}
          style={styles.btnSuccess}
          title={rowData.processstatus_display_name}
        >
          Success
        </span>
      );
    }
  };

  renderSaved = rowData => {
    const { classes } = this.props;
    if (rowData.saved && rowData.saved.savedDateEnd) {
      const tooltDate = moment
        .utc(rowData.saved.savedDateEnd)
        .format('YYYY-MM-DD');
      if (rowData.saved.savedDateEnd === null) {
        return (
          <CircularProgress
            disableShrink
            style={{ width: '25px', height: '25px' }}
          />
        );
      } else {
        return (
          <Icon title={tooltDate} className={classes.iconCheck}>
            check
          </Icon>
        );
      }
    } else if (rowData.saved === null) {
      return '-';
    }
  };

  renderCheck = rowData => {
    const { classes } = this.props;
    if (rowData.processes_published_date) {
      const publishedDate = moment
        .utc(rowData.processes_published_date)
        .format('YYYY-MM-DD');
      return (
        <Icon title={publishedDate} className={classes.iconCheck}>
          check
        </Icon>
      );
    } else {
      return '-';
    }
  };
  renderLoading = () => {
    return (
      <CircularProgress
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          margin: '-30px 0 0 -20px',
          zIndex: '99',
        }}
      />
    );
  };

  renderFilter = () => {
    const { classes } = this.props;
    return (
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="filter-label-placeholder">
          Filter
        </InputLabel>
        <Select
          value={this.state.filter}
          onChange={this.handleChangeFilter}
          input={<Input name="filter" id="filter-label-placeholder" />}
          displayEmpty
          name="filter"
        >
          <MenuItem value={'all'}>All</MenuItem>
          <MenuItem value={'running'}>Running</MenuItem>
        </Select>
      </FormControl>
    );
  };

  onHideModal = () => {
    this.setState({ visible: false });
  };

  onClickModal = (data, modalType) => {
    if (modalType === 'Datasets') {
      this.setState({
        visible: true,
        modalType: modalType,
        rowsDatasetRunning: data,
      });
    } else if (modalType === 'Profile') {
      const timeProfile = Centaurus.getTimeProfile(data);
      timeProfile.then(res =>
        this.setState({
          visible: true,
          modalType: modalType,
          timeProfileData: res,
        })
      );
    }
  };

  renderTable = rows => {
    const {
      columns,
      sorting,
      pageSize,
      pageSizes,
      currentPage,
      totalCount,
      defaultColumnWidths,
      selection,
    } = this.state;

    return (
      <React.Fragment>
        <Grid rows={rows} columns={columns}>
          <SearchState onValueChange={this.changeSearchValue} />
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
            columnExtensions={[
              // { columnName: 'processes_start_date', sortingEnabled: false },
              { columnName: 'duration', sortingEnabled: false },
              { columnName: 'saved', sortingEnabled: false },
              { columnName: 'time_profile', sortingEnabled: false },
              // Temporary sorting disabled:
              // { columnName: 'processes_name', sortingEnabled: false },
              // { columnName: 'fields_display_name', sortingEnabled: false },
              // {
              //   columnName: 'processstatus_display_name',
              //   sortingEnabled: false,
              // },
            ]}
          />
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />
          <CustomPaging totalCount={totalCount} />
          <SelectionState
            selection={selection}
            onSelectionChange={this.changeSelection}
          />
          <Table
            columnExtensions={[
              {
                columnName: 'time_profile',
                align: 'center',
              },
              {
                columnName: 'execution_detail',
                align: 'center',
              },
            ]}
          />
          <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
          <CustomTableHeaderRowCell />
          <TableColumnVisibility />
          <TableSelection
            selectByRowClick
            highlightRow
            showSelectionColumn={false}
          />
          <PagingPanel pageSizes={pageSizes} />
          <Toolbar />
          <SearchPanel />
          <CustomColumnChooser />
        </Grid>
        {this.renderModal()}
        <ProcessConfiguration
          open={this.state.isProcessConfigurationVisible}
          onClose={this.handleProcessConfigurationClose}
          configuration={this.state.processConfiguration}
        />
      </React.Fragment>
    );
  };

  render() {
    const { loading, data } = this.state;
    const { classes } = this.props;

    const rows = data.map(row => ({
      time_profile: this.renderTimeProfile(row),
      processes_process_id: this.renderProcessesId(row),
      processes_start_time: this.renderStartTime(row),
      duration: this.renderDuration(row),
      processes_name: this.renderName(row),
      processes_instance: this.renderInstance(row),
      fields_display_name: this.renderDataset(row),
      releasetag_release_display_name: this.renderRelease(row),
      tguser_display_name: this.renderOwner(row),
      processstatus_display_name: this.renderStatus(row),
      saved: this.renderSaved(row),
      processes_published_date: this.renderCheck(row),
      execution_detail: this.renderExecutionDetail(row),
    }));

    return (
      <Paper className={classes.wrapPaper}>
        {this.renderFilter()}
        {this.renderTable(rows)}
        {loading && this.renderLoading()}
      </Paper>
    );
  }
}

export default withStyles(styles)(TableMyProcesses);
