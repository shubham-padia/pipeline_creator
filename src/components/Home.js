import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'

export class Home extends Component {
  render() {
    return (
      <div>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}> Create Pipeline </h1>
        <Form>
          <Form.Group widths='equal'>
            <Form.Input
              fluid
              id='form-subcomponent-shorthand-input-version'
              label='Version'
              placeholder='Version'
            />
            <Form.Input
              fluid
              type='date'
              id='form-subcomponent-shorthand-input-recording-date'
              label='Recording Date'
              placeholder='Recording Date'
            />
          </Form.Group>
        </Form>
      </div>
    )
  }
}

export default Home

