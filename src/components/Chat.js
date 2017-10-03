import React from 'react';
import $ from 'jquery';

import Header from './Header';
import Messages from './Messages';
import Footer from './Footer';

// THESE VARIABLES SHOULDN'T BE HERE!!!!!
const apiaiAccessToken = '071a383138e24a0586d94e0efb0ca509';
// const apiaiAccessToken = "294ea1f1248640fc82b5afc719760dff";
const apiaiBaseUrl = "https://api.api.ai/v1/";

let recognition;

class Chat extends React.Component {
  constructor ()  {
    super();

    this.state = {
      messages: [],
      speaking: false,
      matchedWords: []
    }

    this.clickSendTextMessage = this.clickSendTextMessage.bind(this);
    this.clickStartRecording = this.clickStartRecording.bind(this);
    this.clickStopRecording = this.clickStopRecording.bind(this);
  }

  /**
   * Reproduce el mensaje texto que se introduzca
   * @param {String} message 
   */
  voiceAnswer (message) {
    var msg = new SpeechSynthesisUtterance();
    msg.voiceURI = "native";
    msg.text = message;
    msg.lang = "es-ES";
    window.speechSynthesis.speak(msg);
  }

  /**
   * Crea un nuevo mensaje en el historial(0 para ApiAi, 1 para usuario)
   * @param {0,1} user 
   * @param {String} message 
   */
  setMessage (user, message) {
    const newMessage = {
      user,
      text: message.charAt(0).toUpperCase() + message.slice(1),
      time: new Date()
    };

    const allMessages = this.state.messages.concat([ newMessage ]);
    this.setState( { messages: allMessages });

  }

  /**
   * Envía el mensaje mediante ajax al Api.ai. Si es success, 
   * se introduce el mensaje en el histórico, y se reproduce.
   * @param {String} message 
   */
  sendMessage (message) {
    const instance = this;
    $.ajax({
      type: 'POST',
      url: apiaiBaseUrl + 'query',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
          'Authorization': 'Bearer ' + apiaiAccessToken
      },
      data: JSON.stringify({
          query: message,
          lang: 'es',
          sessionId: 'yaydevdiner'
      }),
      success: function(data) {
        // TODO: Sacarlas de la respuesta
        const matchedWords = ['Hola', 'Buenas', 'OK!'];
        instance.setState({ matchedWords });


        const msg = data.result.speech;
        instance.setMessage(0, msg);
        instance.voiceAnswer(msg);
      },
      error: function() {
          console.log('ERROR: Something went wrong');
          // respond(messageInternalError);
      }
    });
  }

  /**
   * Recoge el submit de envio de mensaje de texto. Se introduce en el histórico, y se envia a Api.Ai
   * @param {Object} event 
   */
  clickSendTextMessage (event) {
    event.preventDefault();
    const message = document.getElementById('message').value;
    this.setMessage(1, message);
    document.getElementById('message').value = '';
    this.sendMessage(message);
  }

  /**
   * Para el reconocimiento de voz. El state de speaking se va a false,
   * lo que cambia de nuevo a texto el footer
   */
  stopRecognition () {
    
    if (recognition) {
      console.log('se para reconocimiento')
      recognition.stop();
      recognition = null;
    }
    
    this.setState({ speaking: false });
  }

  /**
   * Configura el recognition, y lo comienza. Cuando se obtiene un resultado, 
   * se incluye en el registro, se envía a ApiAi y se para el mic
   */
  startRecognition () {
    const instance = this;
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function(event) {
      console.log('grabando...')
    };

    recognition.onresult = function(event) {
      recognition.onend = null;
      
      var text = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        text += event.results[i][0].transcript;
      }
      instance.stopRecognition();
      // se incluye en el registro de mensajes (se imprime en la pantalla)
      instance.setMessage(1, text);
      // se manda al api.ai
      instance.sendMessage(text);
      
    };

    recognition.onend = function(event) {
      if (recognition) {
        console.log('Finalizado por no reconocimiento')
        const notUnderstandMsg = 'No te he entendido, ¿puedes repetir?';
        instance.stopRecognition();
        instance.setMessage(0, notUnderstandMsg);
        instance.voiceAnswer(notUnderstandMsg);
      }
      
      
    }

    recognition.lang = "es-ES";
    console.log('empieza a grabar')
    recognition.start();
  }

  /**
   * Evento que recoge el comienzo de grabacion por el usuario. state.speaking va a true para mostrar el wave
   * @param {Object} event 
   */
  clickStartRecording (event) {
    event.preventDefault();
    this.setState({ speaking: true });
    this.startRecognition();
  }

  /**
   * Evento que recoge la parada de grabacion por parte del usuario
   * @param {Object} event 
   */
  clickStopRecording (event) {
    console.log('finalizada por el usuario')
    this.stopRecognition();
  }

  render() {
    return (
      <div style={ { height: '100%' }} id="chat" className="card">
        <Header />
        <Messages messages={this.state.messages} />
        <Footer send={this.clickSendTextMessage} record={this.clickStartRecording} stopRecord={this.clickStopRecording}
          speaking={this.state.speaking} /> 
      </div>
    );
  }
}

const chatContainerStyle = {
  'minHeight': '400px',
}

export default class App extends React.Component {
  render () {
    return (
      <div className="body">
        <div className="outer-container">

            <div className="row">
              <div className="col s12 m12 l6 offset-l3" style={chatContainerStyle}>
                <Chat />
              </div>
            </div>

        </div>
      </div>
    )
  }
}