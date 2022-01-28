import React from 'react';
import {Button} from 'react-bootstrap';
import {smallPillButton} from '../utils/styles';

function ManagerDocs(props) {

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
          Add Property Manager
        </Button>
      </div>
      <div>
        <Button variant='outline-primary' style={smallPillButton}>
          Add Contact Person
        </Button>
      </div>
    </div>
  );

}

export default ManagerDocs;
