import './ownerstab.css';

import LOGO1 from './OwnerImages/eye.webp';
import LOGO2 from './OwnerImages/chatbubble.webp';
import LOGO3 from './OwnerImages/heart.webp';
import LOGO4 from './OwnerImages/house.webp';
import LOGO5 from './OwnerImages/reporting.webp';
import LOGO6 from './OwnerImages/requests.webp';


export default function OwnersTab () {
    return (
        <div style={{backgroundColor: "#fafafa"}}>
            <div style={{textAlign: "center"}}>
            <h1 style={{marginTop: '100px'}, {fontSize: "60px"}}>Property Ownership Simplified</h1>
            </div>

            <div className='topcontainer'>
                <div className='content'>
                    <h2 className='firstpara'>From helping you purchase your first investment property to moving in tenants, 
                        Manifest provides you with the tools you need to successfully manage your properties 
                        quickly and easily.</h2>
                    <h2 className='firstpara'>Our Portal makes it easy to:
                        <ul>
                            <li>Monitor Rent Payments</li>
                            <li>Track Maintenance Requests</li>
                            <li>View/Edit Property Details</li>
                            <li>See Property Cash Flow</li>
                        </ul>
                    </h2>
                    <h2 className='firstpara'>Our software simplifies Property Ownership and Management. 
                    Our Dashboard helps you focus on what's important so you can identify what needs to be addressed 
                    and see how profitable each unit is.</h2>

                    <h2 className='firstpara'>Manifest is your partner in the property business. Contact us for a 
                    Free Demo to see how Manifest can work for you.</h2>
                </div>
                
            </div>
            <div className='bottomcontainer'>
                <div className='bottomcontent'>
                    <img src={LOGO1} style={{width:"10vw"}} />
                    <h2>Improve Visibility</h2>
                    <h2 className='bottomcaptions'>Get an overview of your property portfolio and dive into any details you want</h2>
                    <img src={LOGO6} style={{width:"10vw"}} />
                    <h2>Track Maintenance Requests</h2>
                    <h2 className='bottomcaptions'>See all Maintenance requests and track cost and resolution time.</h2>
                </div>
                <div className='bottomcontent'>
                    <img src={LOGO2} style={{width:"10vw"}} />
                    <h2>Quick Customer Support</h2>
                    <h2 className='bottomcaptions'>Responses in less than 2 business hours for owners, less than 4 business hours for residents.</h2>
                    <img src={LOGO3} style={{width:"10vw"}} />
                    <h2>Improve Residential Satisfaction</h2>
                    <h2 className='bottomcaptions'>Residents will be more likely to renew leases and pay bills on time with Manifest</h2>
                </div>
                <div className='bottomcontent'>
                    <img src={LOGO5} style={{width:"10vw"}} />
                    <h2>Easy Reporting</h2>
                    <h2 className='bottomcaptions'>See each property's cash flow in your dashboard and easy access to finances, bills, invoices and more.</h2>
                    <img src={LOGO4} style={{width:"10vw"}} />
                    <h2>Monitor Rent Payments</h2>
                    <h2 className='bottomcaptions'>See who has paid and who hasn't.  Track late fees and bill payment</h2>
                </div>
                
            </div>
            

        </div>
    )
}