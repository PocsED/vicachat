import React from 'react';

const messagesContainerStyle = {
    height: '400px',
    padding: '10px',
    overflow: 'hidden',
    'overflowY': 'scroll', 
}

export default class Messages extends React.Component {
    componentDidUpdate () {
        const elem = document.getElementById('conversation');
        elem.scrollTop = elem.scrollHeight;
    }

    render () {
        const messages = this.props.messages.map( (msg, index) => {
            
            const msgClass = msg.user === 0 ? 'them' : 'me';
            // const userName = msg.user === 0 ? 'ViCA' : 'Ángel';
            const imageSource = msg.user === 0 ? '/ADN-WHITE.png' : 'photo.jpg';
            // const diffMs = new Date () - msg.time;
            // // const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
            // const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
            return <div className={"message-wrapper " + msgClass} key={index}>
                <div className="circle-wrapper animated bounceIn">
                    <img src={imageSource} alt="" /> 
                </div>
                <div className="text-wrapper animated fadeIn">{msg.text}</div>
            </div>
        })
        return (
            <div className="inner" id="inner">
                <div className="content" id="conversation" style={messagesContainerStyle}>
                    {messages}
                </div>
            </div>
        )
    }
}