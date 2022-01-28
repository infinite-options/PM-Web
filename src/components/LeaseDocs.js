import React from 'react';
import {Button} from 'react-bootstrap';
import {smallPillButton} from '../utils/styles';

function LeaseDocs(props) {

  const {addDocument} = props;

  return (
    <div className='d-flex flex-column gap-2'>
      <div>
        <Button variant='outline-primary' style={smallPillButton} onClick={addDocument}>
          Add Document
        </Button>
      </div>
      <div>
        <Button variant='outline-primary' style={smallPillButton}>
          Add Tenant Contact
        </Button>
      </div>
    </div>
  );

}

export default LeaseDocs;
