import React from 'react';
import { css } from '@emotion/core';
// First way to import
import { PacmanLoader } from 'react-spinners';

const override = css`
    display: block;
    margin: 100px auto;
    vertical-align: middle;
`;

export class UploadSpinner extends React.Component {
  render() {
    return (
      <div className='sweet-loading overlay' style={{ display: this.props.loading ? "block" : "none" }}>
        <div style={{margin: "40vh auto"}}>
        <PacmanLoader
          css={override}
          sizeUnit={"px"}
          size={50}
          color={'#36D7B7'}
          loading={this.props.loading}
        />
        <h3 style={{color: '#FFE404', textAlign: "center"}}> {"Please wait, we are uploading the file...."}</h3>
        </div>
      </div>
    )
  }
}