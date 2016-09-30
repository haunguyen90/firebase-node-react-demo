/**
 * Created by haunguyen on 9/25/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Thumbnail, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {extend, map, each, isArray} from 'underscore';
import ReactDOM from 'react-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import GraphComponent from '../graphComponent/GraphComponent.js';

class BarGraphComponent extends GraphComponent {
  constructor(props) {
    super(props);

    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    this.beforeSaveCell = this.beforeSaveCell.bind(this);
    this.convertJSONDataToRows = this.convertJSONDataToRows.bind(this);
    this.convertRowsToJSONData = this.convertRowsToJSONData.bind(this);
    this.onUpdateComponent = this.onBarGraphUpdate.bind(this);
    this.removeEmptyRow = this.removeEmptyRow.bind(this);

    this.state = extend({
      xLabel: props.componentData.xLabel,
      yLabel: props.componentData.yLabel,
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
      delete component.init;
      let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + selectedSlide.keyId + '/components/' + keyId);
      deckDataRef.set(component);
    }
  }

  convertJSONDataToRows(){
    const {componentData} = this.props;
    if(componentData && componentData.sets && typeof componentData.sets == "string"){
      const setsRows = componentData.sets.split(",");
      let rows = map(setsRows, (row, rowIdx) => {
        let rowData = {
          id: rowIdx + 1,
          yAxis: row
        };

        each(componentData.groups, (col, colIdx) => {
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
        xAxis1: componentData.groups[0].name,
        xAxis2: componentData.groups[1].name
      };
      rows.unshift(firstRow);

      const lastRow = {
        id: rows.length,
        yAxis: "",
        xAxis1: "",
        xAxis2: ""
      };
      rows.push(lastRow);

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
      groups: [
        {values: [], name: "Data 1"},
        {values: [], name: "Data 2"}
      ],
      sets: []
    };

    each(rows, (row, rowIdx) => {
      if(rowIdx == (rows.length - 1)){
        if(!row.yAxis && !row.xAxis1 && !row.xAxis2){
          return;
        }
      }

      if(rowIdx > 0){
        JSONData.sets.push(row.yAxis);
        JSONData.groups[0].values.push(row.xAxis1);
        JSONData.groups[1].values.push(row.xAxis2);
      }else if(rowIdx == 0){
        JSONData.groups[0].name = row.xAxis1;
        JSONData.groups[1].name = row.xAxis2;
      }
    });
    JSONData.groups[0].values = JSONData.groups[0].values.join();
    JSONData.groups[1].values = JSONData.groups[1].values.join();
    JSONData.sets = JSONData.sets.join();
    return JSONData;
  }

  beforeSaveCell(row, cellName, cellValue){
    const {rows} = this.state;

    let arrayCellValue = [];
    each(Object.keys(row), (cell) => {
      if(cell != "id" && row[cell] != ""){
        arrayCellValue.push(row[cell]);
      }
    });

    //if(arrayCellValue.length == 0 && row.id == 0)
    //  return false;
    //if(arrayCellValue.length == 0 && rows.length == 2)
    //  return false;

    return true;
    //let allowSave = false;
    //let arrayCellValue = [];
    //each(Object.keys(row), (cell) => {
    //  if(cell != "id" && row[cell] != ""){
    //    arrayCellValue.push(row[cell]);
    //  }
    //});
    //
    //if(arrayCellValue.length > 0)
    //  allowSave = true;
    //
    //return allowSave;
  }

  onAfterSaveCell(row, cellName, cellValue){
    const {rows} = this.state;
    const {componentData} = this.props;
    let arrayCellValue = [];
    each(Object.keys(row), (cell) => {
      if(cell != "id" && row[cell] != ""){
        arrayCellValue.push(row[cell]);
      }
    });

    if(arrayCellValue.length == 0 && rows.length == 2)
      return false;

    if(arrayCellValue.length > 0 || (arrayCellValue.length == 0 && row.id == 0)){
      this.onUpdateComponent();
    }else if(arrayCellValue.length == 0 && row.id < rows.length){
      if(!componentData.init)
        this.removeEmptyRow(row.id);
    }
  }

  removeEmptyRow(index){
    let {rows} = this.state;
    rows.splice(index, 1);
    rows = map(rows, (row, index) => {
      row.id = index;
      return row;
    });

    this.setState({rows: rows});
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

  onXLabelChange(event){
    event.preventDefault();
    this.setState({xLabel: event.target.value});
  }

  onYLabelChange(event){
    event.preventDefault();
    this.setState({yLabel: event.target.value});
  }

  onLabelUpdate(event){
    event.preventDefault();
    const value = event.target.value;
    const label = event.target.name;

    // Update single component
    const {selectedSlide, keyId, deckId} = this.props;

    if(selectedSlide.components && selectedSlide.components[keyId]){
      let component = selectedSlide.components[keyId];
      component[label] = value;

      let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + selectedSlide.keyId + '/components/' + keyId);
      deckDataRef.set(component);
    }

  }

  componentDidMount(){
    $(this.refs.bootstrapTableRoot).find(".first-cell").click((e) => {
      e.stopPropagation();
    })
  }

  componentDidUpdate(prevProps, prevState){
    if(JSON.stringify(prevProps.componentData) != JSON.stringify(this.props.componentData)){
      const rows = this.convertJSONDataToRows();
      this.setState({rows: rows});
    }

    if(JSON.stringify(prevState.rows) != JSON.stringify(this.state.rows)){
      this.onUpdateComponent();
    }
  }

  render(){
    const {keyId} = this.props;
    const {rows, cellEditProp, xLabel, yLabel} = this.state;
    return (
      <div className="slide-component bar-graph-component row">
        <Col sm={12}>
          <FormGroup controlId={"componentBarGraph-" + keyId}>
            <ControlLabel>BAR GRAPH</ControlLabel>
            {this.renderConfirmDeleteComponent()}

            <div className="bar-graph-table-root hidden-header" ref="bootstrapTableRoot">
              <BootstrapTable tableBodyClass="bar-graph-table-bootstrap" ref="bootstrapTable" data={rows} striped={true} hover={true} cellEdit={cellEditProp}>
                <TableHeaderColumn dataField="id" hidden={true} isKey={true}></TableHeaderColumn>
                <TableHeaderColumn columnClassName={this.columnClassNameFormat} dataField="yAxis" ></TableHeaderColumn>
                <TableHeaderColumn columnClassName={this.columnClassNameFormat} dataField="xAxis1">Data 1</TableHeaderColumn>
                <TableHeaderColumn columnClassName={this.columnClassNameFormat} dataField="xAxis2">Data 2</TableHeaderColumn>
              </BootstrapTable>
            </div>

            <FormControl.Feedback />
          </FormGroup>
        </Col>

        <Col sm={6}>
          <FormGroup controlId={"xAxis-title-" + keyId}>
            <ControlLabel>X AXIS TITLE</ControlLabel>
            <FormControl
              type="text"
              value={xLabel}
              name="xLabel"
              onChange={this.onXLabelChange.bind(this)}
              onBlur={this.onLabelUpdate.bind(this)}
            />

            <FormControl.Feedback />
          </FormGroup>
        </Col>
        <Col sm={6}>
          <FormGroup controlId={"yAxis-title-" + keyId}>
            <ControlLabel>Y AXIS TITLE</ControlLabel>
            <FormControl
              type="text"
              value={yLabel}
              name="yLabel"
              onChange={this.onYLabelChange.bind(this)}
              onBlur={this.onLabelUpdate.bind(this)}
            />

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