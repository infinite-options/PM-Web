import React from 'react';
import {Button} from 'react-bootstrap';
import File from '../icons/File.svg';
import {get} from '../utils/api';
import {smallPillButton, mediumBold} from '../utils/styles';

function ManagerLeaseDocs(props) {

    const {addDocument, property, selectAgreement} = props;
    const [agreements, setAgreements] = React.useState([]);

    React.useEffect(async () => {
        const response = await get(`/rentals?rental_property_id=${property.property_uid}`);
        setAgreements(response.result);
    }, [])

    return (
        <div>
            {agreements.length > 0 ?
                <div className='d-flex flex-column gap-2'>
                    {agreements.map((agreement, i) => (
                        <div key={i} onClick={() => selectAgreement(agreement)}>
                            <div className='d-flex justify-content-between align-items-end'>
                                <h6 style={mediumBold}>Lease {i+1}</h6>
                                <img src={File}/>
                            </div>
                            <hr style={{opacity: 1}} className='mb-0 mt-2'/>
                        </div>
                    ))}
                    <div>
                        <Button variant='outline-primary' style={smallPillButton} onClick={addDocument} hidden={true}>
                            Add Document
                        </Button>
                    </div>
                </div>
                :
                <div className='mb-4'>No Tenant Agreements to view</div>}
        </div>
    );

}

export default ManagerLeaseDocs;
