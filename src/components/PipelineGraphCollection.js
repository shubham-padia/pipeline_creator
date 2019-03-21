import React, { Component } from 'react'
import PipelineGraph from './PipelineGraph'
import Popup from 'reactjs-popup'
import { validate_parents_exist, validate_predecessor_tasks } from './Validate'

export class PipelineGraphCollection extends Component {
  stepsForEachSession = (pipelineData) => {
    var GraphArray = []
    var pipelineDataSteps = pipelineData.steps

    /*if (!validate_parents_exist(pipelineDataSteps)){
      return <h1>The parents of some of the steps do not exist.</h1>
    }
    if (!validate_predecessor_tasks(pipelineDataSteps)){
      return <h1>The predecessor tasks are invalid.</h1>
    }*/
    
    for (var session_num in pipelineDataSteps) {
        let header = "Session #" + session_num;
        let steps_for_session = pipelineDataSteps[session_num]
        GraphArray.push(<PipelineGraph key={"session_" + session_num} header={header} steps={steps_for_session}></PipelineGraph>)
      }
    return GraphArray
  }

  render() {
    return (
      <Popup
        trigger={<span> View graphs </span>}
        modal
        lockScroll={true}
        contentStyle={{ height: "90%", overflowY: "scroll" }}
        closeOnDocumentClick>
        {this.stepsForEachSession(this.props.steps)}
      </Popup>
    )
  }
}

export default PipelineGraphCollection
