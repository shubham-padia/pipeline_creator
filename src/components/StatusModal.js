import React, { Component } from 'react'
import { Modal, Button, Icon } from 'semantic-ui-react'

export class StatusModal extends Component {
  render() {
    return (
      <div>
        <Modal open={this.props.isModalOpen} onClose={this.props.onClose} basic size='small'>
          <Modal.Content>
            <p>
              {this.props.statusMessage}
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