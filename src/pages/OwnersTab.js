import "../components/ownerComponents/ownerstab.css";

import LOGO1 from "./OwnerImages/eye.webp";
import LOGO2 from "./OwnerImages/chatbubble.webp";
import LOGO3 from "./OwnerImages/heart.webp";
import LOGO4 from "./OwnerImages/house.webp";
import LOGO5 from "./OwnerImages/reporting.webp";
import LOGO6 from "./OwnerImages/requests.webp";
import FormComponent from "../components/FormComponent";
import { Grid, Paper } from "@material-ui/core";
import { ListItem } from "@material-ui/core";

export default function OwnersTab() {
  return (
    <div style={{ backgroundColor: "#fafafa" }}>
      <div style={{ textAlign: "center" }}>
        <h1 className="propertydescription">Property Ownership Simplified</h1>
      </div>

      <div className="topcontainer">
        <div className="content">
          <h2 className="firstpara">
            From helping you purchase your first investment property to moving
            in tenants, Manifest provides you with the tools you need to
            successfully manage your properties quickly and easily.
          </h2>
          <h2 className="firstpara">
            Our Portal makes it easy to:
            <ul>
              <li>Monitor Rent Payments</li>
              <li>Track Maintenance Requests</li>
              <li>View/Edit Property Details</li>
              <li>See Property Cash Flow</li>
            </ul>
          </h2>
          <h2 className="firstpara">
            Our software simplifies Property Ownership and Management. Our
            Dashboard helps you focus on what's important so you can identify
            what needs to be addressed and see how profitable each unit is.
          </h2>

          <h2 className="firstpara" style={{ paddingBottom: "30px" }}>
            Manifest is your partner in the property business. Contact us for a
            Free Demo to see how Manifest can work for you.
          </h2>
        </div>
      </div>
      <div className="grids">
        <Grid container spacing={1}>
          <Grid className="aligned" item xs={4}>
            <img src={LOGO1} className="bottomimages" />
            <h4 className="texts">Improve Visibility</h4>
            <h2 className="bottomcaptions">
              Get a complete overview of your property portfolio and dive into
              any specific details you want.
            </h2>
          </Grid>
          <Grid className="aligned" item xs={4}>
            <img src={LOGO2} className="bottomimages" />
            <h4 className="texts">Quick Customer Support</h4>
            <h2 className="bottomcaptions">
              Responses in less than 2 business hours for owners, less than 4
              business hours for residents.
            </h2>
          </Grid>
          <Grid className="aligned" item xs={4}>
            <img src={LOGO5} className="bottomimages" />
            <h4 className="texts">Easy Reporting</h4>
            <h2 className="bottomcaptions">
              See each property's cash flow in your dashboard and easy access to
              finances, bills, invoices and more.
            </h2>
          </Grid>
          <Grid className="aligned" item xs={4}>
            <img src={LOGO6} className="bottomimages" />
            <h2 className="texts">Track Maintenance Requests</h2>
            <h2 className="bottomcaptions">
              See all Maintenance requests and track cost and resolution time.
            </h2>
          </Grid>
          <Grid className="aligned" item xs={4}>
            <img src={LOGO3} className="bottomimages" />
            <h2 className="texts">Improve Residential Satisfaction</h2>
            <h2 className="bottomcaptions">
              Residents will be more likely to renew leases and pay bills on
              time with Manifest.
            </h2>
          </Grid>
          <Grid className="aligned" item xs={4}>
            <img src={LOGO4} className="bottomimages" />
            <h2 className="texts">Monitor Rent Payments</h2>
            <h2 className="bottomcaptions">
              See who has paid and who hasn't. Track late fees and bill
              payments.
            </h2>
          </Grid>
        </Grid>
      </div>
      {/* <div className='bottomcontainer'>
                <div className='bottomcontent'>
                    <div className='embeddedcontainer'>
                        <img src={LOGO1} className='bottomimages' />
                        <h2 style={{textAlign:"center"}}>Improve Visibility</h2>
                        <h2 className='bottomcaptions'>Get a complete overview of your property portfolio and dive into any details you want.</h2>
                    </div>
                    <div className='embeddedcontainer'>
                        <img src={LOGO6} className='bottomimages' />
                        <h2 style={{textAlign:"center"}}>Track Maintenance Requests</h2>
                        <h2 className='bottomcaptions'>See all Maintenance requests and track cost and resolution time.</h2>
                    </div>
                    <div className='embeddedcontainer'>
                        <img src={LOGO1} className='bottomimages' />
                        <h2 style={{textAlign:"center"}}>Improve Visibility</h2>
                        <h2 className='bottomcaptions'>Get a complete overview of your property portfolio and dive into any details you want.</h2>
                    </div>
                    <div className='embeddedcontainer'>
                        <img src={LOGO6} className='bottomimages' />
                        <h2 style={{textAlign:"center"}}>Track Maintenance Requests</h2>
                        <h2 className='bottomcaptions'>See all Maintenance requests and track cost and resolution time.</h2>
                    </div>
                    <div className='embeddedcontainer'>
                        <img src={LOGO1} className='bottomimages' />
                        <h2 style={{textAlign:"center"}}>Improve Visibility</h2>
                        <h2 className='bottomcaptions'>Get a complete overview of your property portfolio and dive into any details you want.</h2>
                    </div>
                    <div className='embeddedcontainer'>
                        <img src={LOGO6} className='bottomimages' />
                        <h2 style={{textAlign:"center"}}>Track Maintenance Requests</h2>
                        <h2 className='bottomcaptions'>See all Maintenance requests and track cost and resolution time.</h2>
                    </div>
                </div>
                
            </div> */}
      <div>
        <h2 className="getstarted">Get Started</h2>
        <h2 className="signup">
          Sign up for free* today and let Manifest take care of the rest.
        </h2>
      </div>
      <div className="signupinput">
        <div>
          <FormComponent />
        </div>
      </div>
    </div>
  );
}
