import React from 'react'
import "../components/ownerComponentt/ownerstab.css";
const emailState = {
    email: '',
    error: ''
}
class FormComponent extends React.Component {  
    
    constructor(){
        super();
        this.state = emailState;
        this.onChange = this.onChange.bind(this);
    }
    onChange(e) {
        this.setState({
            email : e.target.value
        });
    }
    emailValidation(){
        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if(!this.state.email || regex.test(this.state.email) === false){
            this.setState({
                error: "Email is not valid"
            });
            return false;
        }
        return true;
    }
    onSubmit(){
        if(this.emailValidation()){
            console.log(this.state);
            this.setState(emailState);
        }
    }
    render(){
        return(
            <div>
                <div className='signupinput'>
                    <div className="d-flex justify-content-center flex-column">
                        
                        <input type="email" name="email" value={this.state.email} onChange={this.onChange} className="inputval" />
                        <span className="text-danger">{this.state.error}</span>
                    </div>
                    <div className="d-inline-block justify-content-center align-items-center">
                        <button type="submit" className="btns" onClick={()=>this.onSubmit()}><span className='buttondescription'>Sign Up</span></button>
                    </div>
                </div>
                {/* <label>Enter your email here *</label> */}
                
                  
            </div>
        )  
    }
}  
   
export default FormComponent;