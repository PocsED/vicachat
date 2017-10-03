import React from 'react';


let microphone;

class Footer extends React.Component {
    
    componentDidUpdate() {
        if (this.props.speaking) {
            const waveProperties = {
                container: '#waveform', 
                waveColor: '#999',
                height: 75,
                hideScrollbar: true,
            }
            const wavesurfer = window.WaveSurfer.create(waveProperties);
            microphone = Object.create(window.WaveSurfer.Microphone);
            microphone.init({
                wavesurfer: wavesurfer
            });
            console.log('se inicia wave mic')
            microphone.start();

            microphone.on('deviceError', function(code) {
                console.warn('Device error: ' + code);
            });
            
        } else if (!this.props.speaking && microphone) {
            console.log('wave se para');
            microphone.stop();
            microphone = null;
        }
    }

    render () {
        
        const recordingActive = <div className="row">
            <div className="col s8 m9 l9">
                <div id="waveform"></div>
            </div>
            <div className="col s4 m3 l3">
                <div className="valign-wrapper">
                    <a className="btn-floating btn-large waves-effect waves-light red stop-record" onClick={this.props.stopRecord} >
                        <i className="fa fa-microphone-slash" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
        </div>;
        const recordingNotActive = <div className="row footer">
            <form onSubmit={this.props.send}>
                <div className="input-field col s6 m9 l9">
                    <input placeholder="Introduce tu mensaje" id="message" type="text" className="validate" /> 
                </div>
                <div className="col s6 m3 l3">
                    <div className="valign-wrapper">
                        <button type="submit" className="btn-floating btn-large waves-effect waves-light green" onClick={this.props.send} >
                            <i className="fa fa-send-o" aria-hidden="true"></i>
                        </button>
                        <button className="btn-floating btn-large waves-effect waves-light blue mic-button" onClick={this.props.record} >
                            <i className="fa fa-microphone" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </form>
        </div>;
        const result = this.props.speaking ? recordingActive : recordingNotActive;
        return (
            <div id="footer">
                {result}
            </div>
        )
    }
}
export default Footer;