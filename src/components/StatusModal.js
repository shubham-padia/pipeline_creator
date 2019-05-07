import React, { Component } from 'react'
import { Modal, Button, Icon } from 'semantic-ui-react'

export class StatusModal extends Component {
  render() {
    const successMessage = "Your request was successfully submitted";
    const failureMessage = "There was an error submitting your request";
    
    return (
      <div>
        <Modal open={this.props.isModalOpen} onClose={this.props.onClose} basic size='small'>
          <Modal.Content>
            <p>
              {this.props.responseOk ? successMessage : failureMessage}
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button color='green' onClick={this.props.onClose} inverted>
              <Icon name='checkmark' /> Got it
          </Button>
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default StatusModal