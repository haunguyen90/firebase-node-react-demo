/**
 * Created by haunguyen on 9/29/16.
 */
import React from 'react';
import {Link, withRouter} from 'react-router';
import {Image, PageHeader, Row, Thumbnail, Col, Panel, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonGroup, Button} from 'react-bootstrap';
import {extend, map, each, isArray, findIndex} from 'underscore';
import ReactDOM from 'react-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import GraphComponent from '../graphComponent/GraphComponent.js';
import SlideComponent from './SlideComponent.js';

class PieGraphComponent extends GraphComponent {
  constructor(props) {
    super(props);

    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    this.beforeSaveCell = this.beforeSaveCell.bind(this);
    this.convertJSONDataToRows = this.convertJSONDataToRows.bind(this);
    this.convertRowsToJSONData = this.convertRowsToJSONData.bind(this);
    this.onUpdateComponent = this.onPieGraphUpdate.bind(this);
    this.removeEmptyRow = this.removeEmptyRow.bind(this);

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

  beforeSaveCell(row, cellName, cellValue){
    console.log(cellValue);
    const pattern = /^\d+$/;
    if(cellValue && cellName == "yData" && !pattern.test(cellValue)){
      //const rowsRollback = this.convertJSONDataToRows();
      //this.setState({rows: rowsRollback});
      return false;
    }
  }

  onAfterSaveCell(row, cellName, cellValue){
    const {rows} = this.state;
    const {componentData} = this.props;

    if(!row.xData && !row.yData && row.id < rows.length - 1){
      if(!componentData.init)
        this.removeEmptyRow(row.id);
    }else{
      this.onUpdateComponent();
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

  onPieGraphUpdate(){
    // Update single component
    const {selectedSlide, keyId, deckId, getSlides} = this.props;

    if(selectedSlide.components && selectedSlide.components[keyId]){
      const slides = getSlides();
      const currentSlideIndex = findIndex(slides, (slide) => {
        return slide.slideId == selectedSlide.slideId
      });

      if(currentSlideIndex >= 0){
        let component = selectedSlide.components[keyId];
        const JSONData = this.convertRowsToJSONData();
        component = extend(component, JSONData);
        delete component.init;
        let deckDataRef = firebase.database().ref('deckData/' + deckId + '/slides/' + currentSlideIndex + '/components/' + keyId);
        deckDataRef.set(component);
      }
    }
  }

  convertJSONDataToRows(){
    const {componentData} = this.props;
    if(componentData) {
      const xData = componentData.xData.split(",");
      const yData = componentData.yData.split(",");
      let rows = map(xData, (row, rowIdx) => {
        return {
          id: rowIdx,
          xData: row,
          yData: yData[rowIdx]
        }
      });

      const lastRow = {
        id: rows.length,
        xData: "",
        yData: ""
      };

      rows.push(lastRow);

      return rows;
    }else{
      return [
        {
          id: 0,
          xData: "",
          yData: ""
        }
      ]
    }
  }

  convertRowsToJSONData(){
    const {rows} = this.state;
    let JSONData = {
      xData: [],
      yData: []
    };

    each(rows, (row, rowIdx) => {
      if(rowIdx == (rows.length - 1)){
        if(!row.xData && !row.yData){
          return;
        }
      }

      JSONData.xData.push(row.xData);
      JSONData.yData.push(row.yData);
    });
    JSONData.xData = JSONData.xData.join();
    JSONData.yData = JSONData.yData.join();

    return JSONData;
  }

  columnClassNameFormat(fieldValue, row, rowIdx, colIdx){
    if(colIdx == 1 && fieldValue == ""){
      return "xData-placeholder";
    }

    if(colIdx == 2 && fieldValue == ""){
      return "yData-placeholder";
    }

    return "";
  }

  yDataValidator(value){
    if(isNaN(parseInt(value))){
      return "yData only allow number";
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState){
    const rows = this.convertJSONDataToRows();
    if(JSON.stringify(this.state.rows) != JSON.stringify(rows)){
      this.setState({rows: rows});
    }

    //if(JSON.stringify(prevState.rows) != JSON.stringify(this.state.rows)){
    //  this.onUpdateComponent();
    //}
  }

  render(){
    const {keyId} = this.props;
    const {rows, cellEditProp} = this.state;
    return (
      <div className="slide-component pie-graph-component row">
        <Col sm={12}>
          <FormGroup controlId={"componentBarGraph-" + keyId}>
            <ControlLabel>PIE GRAPH</ControlLabel>
            {this.renderConfirmDeleteComponent()}

            <div className="bar-graph-table-root hidden-header" ref="bootstrapTableRoot">
              <BootstrapTable tableBodyClass="bar-graph-table-bootstrap" ref="bootstrapTable" data={rows} striped={true} hover={true} cellEdit={cellEditProp}>
                <TableHeaderColumn columnClassName={this.columnClassNameFormat} dataField="id" hidden={true} isKey={true} ></TableHeaderColumn>
                <TableHeaderColumn columnClassName={this.columnClassNameFormat} dataField="xData"></TableHeaderColumn>
                <TableHeaderColumn columnClassName={this.columnClassNameFormat} dataField="yData">Data 1</TableHeaderColumn>
              </BootstrapTable>
            </div>

            <FormControl.Feedback />
          </FormGroup>
        </Col>
      </div>
    )
  }
};

export default PieGraphComponent;
