import React from 'react';

class Header extends React.Component {
    render () {
        return (
            <div id="header">
                <div className="row">
                    {/* <div className="col s12 m6">
                        <div id="title" className="">
                            <h4>ViCA</h4>
                            <span className="description">Virtual Chat Assistant</span>
                        </div>
                    </div>
                     <div className="logo-container col s12 m6"> 
                         <img id="logo" src="/ENTELGY_DIGITAL_LOGO_WHITE_01.png" alt="" className="right"/> 
                     </div>  */}
                    <div className="header-container">
                        <div className="logo-container">
                            <img id="logo" src="/ADN-WHITE.png" alt="" className="left"/> 
                        </div>
                        <div className="title-outer">
                            <div className="title-inner">
            
                                <h2>ViCA</h2>
                                <span className="description">Virtual Chat Assistant</span>
                        
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default Header;