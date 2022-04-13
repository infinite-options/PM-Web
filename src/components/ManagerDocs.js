import React from 'react';
import {Button, Form} from 'react-bootstrap';
import File from '../icons/File.svg';
import {get, put} from '../utils/api';
import {pillButton, smallPillButton, mediumBold, squareForm} from '../utils/styles';

function ManagerDocs(props) {

  const {addDocument, property, selectContract, reload} = props;
  const [contracts, setContracts] = React.useState([]);
  const [businesses, setBusinesses] = React.useState([]);
  const [selectedBusiness, setSelectedBusiness] = React.useState(null);
  const [addPropertyManager, setAddPropertyManager] = React.useState(false);

  const updateBusiness = async () => {
    const files = JSON.parse(property.images);
    const business_uid = JSON.parse(selectedBusiness).business_uid;
    const newProperty = {
      property_uid: property.property_uid,
      manager_id: business_uid,
      management_status: "FORWARDED"
    }
    for (let i = -1; i < files.length-1; i++) {
      let key = `img_${i}`;
      if (i === -1) {
        key = 'img_cover';
      }
      newProperty[key] = files[i+1];
    }
    const response = await put('/properties', newProperty, null, files);
    setAddPropertyManager(false);
    reload();
  }

  React.useEffect(async () => {
    const response = await get(`/contracts?property_uid=${property.property_uid}`);
    setContracts(response.result);
  }, []);
  React.useEffect(async () => {
    const response = await get(`/businesses?business_type=MANAGEMENT`);
    setBusinesses(response.result);
    setSelectedBusiness(JSON.stringify(response.result[0]));
  }, []);

  return (
    <div className='d-flex flex-column gap-2'>
      {property.manager_business_name ? (
        <div className='d-flex flex-column gap-2'>
          {contracts.map((contract, i) => (
            <div key={i} onClick={() => selectContract(contract)}>
              <div className='d-flex justify-content-between align-items-end'>
                <h6 style={mediumBold}>Contract {i+1}</h6>
                <img src={File}/>
              </div>
              <hr style={{opacity: 1}} className='mb-0 mt-2'/>
            </div>
          ))}
          <div>
            <Button variant='outline-primary' style={smallPillButton} onClick={addDocument}>
              Add Document
            </Button>
          </div>
        </div>
      ) : (
        addPropertyManager ? (
          <div>
            <Form.Group>
              <Form.Select style={squareForm} value={selectedBusiness} onChange={e => setSelectedBusiness(e.target.value)}>
                {businesses.map((business, i) => (
                  <option key={i} value={JSON.stringify(business)}>
                    {business.business_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className='mt-2 text-center'>
              <Button variant='outline-primary' style={pillButton} className='mx-1'
              onClick={() => setAddPropertyManager(false)}>
                Cancel
              </Button>
              <Button variant='outline-primary' style={pillButton} className='mx-1'
              onClick={updateBusiness}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Button variant='outline-primary' style={smallPillButton}
            onClick={() => setAddPropertyManager(true)}>
              Add Property Manager
            </Button>
          </div>
        )
      )}
    </div>
  );

}

export default ManagerDocs;
