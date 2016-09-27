/**
 * Created by haunguyen on 9/25/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Thumbnail, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {extend, map, each, isArray} from 'underscore';
import ReactDOM from 'react-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import SlideComponent from './SlideComponent.js';

class BarGraphComponent extends SlideComponent {
  constructor(props) {
    super(props);

    this.rowGetter = this.rowGetter.bind(this);
    this.handleRowUpdated = this.handleRowUpdated.bind(this);
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    this.beforeSaveCell = this.beforeSaveCell.bind(this);
    this.convertJSONDataToRows = this.convertJSONDataToRows.bind(this);
    this.convertRowsToJSONData = this.convertRowsToJSONData.bind(this);
    this.onUpdateComponent = this.onBarGraphUpdate.bind(this);

    this.state = extend({
      rows: this.convertJSONDataToRows(),
      cellEditProp: {
        mode: "click",
        blurToSave: true,
        beforeSaveCell: this.beforeSaveCell,
        afterSaveCell: this.onAfterSaveCell
      }
    }, this.state);
  }

  onBarGraphUpdate(){
    // Update single component
    const {selectedSlide, keyId, deckId} = this.props;

    if(selectedSlide.components && selectedSlide.components[keyId]){
      let component = selectedSlide.components[keyId];
      const JSONData = this.convertRowsToJSONData();
      component = extend(component, JSONData);

      let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + selectedSlide.keyId + '/components/' + keyId);
      deckDataRef.set(component);
    }
  }

  convertJSONDataToRows(){
    const {componentData} = this.props;
    if(componentData){
      let rows = map(componentData.groups, (row, rowIdx) => {
        let rowData = {
          id: rowIdx + 1,
          yAxis: row
        };

        each(componentData.sets, (col, colIdx) => {
          const fieldName = `xAxis${colIdx + 1}`;
          const arrayValue = col.values.split(",");
          let colVal = "";
          if(arrayValue && arrayValue[rowIdx])
            colVal = arrayValue[rowIdx];
          rowData[fieldName] = colVal;
        });

        return rowData;
      });
      const firstRow = {
        id: 0,
        yAxis: "",
        xAxis1: componentData.sets[0].name,
        xAxis2: componentData.sets[1].name
      };
      rows.unshift(firstRow);
      return rows;
    }else{
      return this.props.defaultRows;
    }

  }

  convertRowsToJSONData(){
    const {rows} = this.state;
    let JSONData = {
      xMax: rows.length - 1,
      yMax: "240",
      groups: [],
      sets: [
        {values: [], name: "Data 1"},
        {values: [], name: "Data 2"}
      ]
    };

    each(rows, (row, rowIdx) => {
      if(rowIdx > 0){
        JSONData.groups.push(row.yAxis);
        JSONData.sets[0].values.push(row.xAxis1);
        JSONData.sets[1].values.push(row.xAxis2);
      }else{
        JSONData.sets[0].name = row.xAxis1;
        JSONData.sets[1].name = row.xAxis2;
      }
    });
    JSONData.sets[0].values = JSONData.sets[0].values.join();
    JSONData.sets[1].values = JSONData.sets[1].values.join();
    return JSONData;
  }

  rowGetter (rowIdx){
    return this.state.rows[rowIdx];
  }

  handleRowUpdated(e){
    //merge updated row with current row and rerender by setting state
    const rows = this.state.rows;
    Object.assign(rows[e.rowIdx], e.updated);
    this.setState({rows:rows});
  }

  beforeSaveCell(row, cellName, cellValue){
    console.log("Save cell '"+cellName+"' with value '"+cellValue+"'");
    console.log("Thw whole row :");
    console.log(row);
    return true;
  }

  onAfterSaveCell(row, cellName, cellValue){
    this.onUpdateComponent();
  }

  columnClassNameFormat(fieldValue, row, rowIdx, colIdx){
    if(colIdx == 1 && rowIdx == 0){
      return "first-cell";
    }

    if(colIdx == 1 && fieldValue == ""){
      return "yAxis-placeholder";
    }

    if(rowIdx == 0 && fieldValue == ""){
      return "xAxis-placeholder";
    }

    return "";
  }

  componentDidMount(){
    $(this.refs.bootstrapTableRoot).find(".first-cell").click((e) => {
      e.stopPropagation();
    })
  }

  render(){
    const {keyId} = this.props;
    const {rows, cellEditProp} = this.state;
    return (
      <div className="slide-component bar-graph-component row">
        <Col sm={12}>
          <FormGroup controlId={"componentBarGraph-" + keyId}>
            <ControlLabel>BAR GRAPH</ControlLabel>
            {this.renderConfirmDeleteComponent()}

            <div className="bar-graph-table-root hidden-header" ref="bootstrapTableRoot">
              <BootstrapTable ref="bootstrapTable" data={rows} striped={true} hover={true} cellEdit={cellEditProp}>
                <TableHeaderColumn dataField="id" editable={true} hidden={true} isKey={true} columnClassName="hidden-cell"></TableHeaderColumn>
                <TableHeaderColumn columnClassName={this.columnClassNameFormat} dataField="yAxis" hiddenOnInsert={true}></TableHeaderColumn>
                <TableHeaderColumn columnClassName={this.columnClassNameFormat} dataField="xAxis1">Data 1</TableHeaderColumn>
                <TableHeaderColumn columnClassName={this.columnClassNameFormat} dataField="xAxis2">Data 2</TableHeaderColumn>
              </BootstrapTable>
            </div>

            <FormControl.Feedback />
          </FormGroup>
        </Col>
      </div>
    )
  }
}

BarGraphComponent.proppTypes = {
  defaultRows: React.PropTypes.array
};

BarGraphComponent.defaultProps = {
  defaultRows: [
    {
      id: 1,
      yAxis: '',
      xAxis1: "Data 1",
      xAxis2: "Data 2"
    },
    {
      id: 2,
      yAxis: 'Label 1',
      xAxis1: "Data Label 1",
      xAxis2: "Data Label 2"
    },
    {
      id: 3,
      yAxis: 'Label 2',
      xAxis1: "Data Label 1",
      xAxis2: "Data Label 2"
    }
  ]
};

export default BarGraphComponent;