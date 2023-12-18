import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollCustomEvent } from '@ionic/angular';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [ CommonModule, IonicModule,FormsModule],
})
export class Tab3Page {
  mensajes: { contenido: string; tipo: string }[] = [];
  mensajesUsuario: string[] = [];
  respuestasChatbot: string[] = [];
  preguntaUsuario: string = '';
  preguntasDisponibles: string[] = [
    '¿Qué hace esta aplicación?',
    '¿Cómo puedo usar esta app?',
  ];
  preguntasSeleccionadas: string[] = [];
 

  async enviarPregunta() {
    // Si se ha seleccionado alguna pregunta disponible
    if (this.preguntasSeleccionadas.length > 0) {
      for (let pregunta of this.preguntasSeleccionadas) {
        this.mensajesUsuario.push('USUARIO: ' + pregunta);
        this.obtenerRespuesta(pregunta);
      }
      this.preguntasSeleccionadas = []; // Limpiar las preguntas seleccionadas después de enviarlas al chatbot
    } else if (this.preguntaUsuario.trim() !== '') {
      // Si se ha escrito una pregunta manualmente
      this.mensajesUsuario.push('USUARIO: ' + this.preguntaUsuario);
      this.obtenerRespuesta(this.preguntaUsuario);
      this.preguntaUsuario = ''; 
    }
  }
  

  obtenerRespuesta(pregunta: string) {
    let respuesta = 'Lo siento, no tengo una respuesta para esa pregunta.';
    switch (pregunta) {
      case 'Hola':
        respuesta = 'En que puedo ayudarte.';
        break;
      case '¿Qué hace esta aplicación?':
        respuesta = 'Esta aplicación permite tomar notas, hacer listas y organizar tus tareas de manera efectiva.';
        break;
      case '¿Cómo puedo usar esta app?':
        respuesta = 'Puedes empezar creando una nueva nota o lista. Explora las opciones del menú para descubrir todas las funcionalidades.';
        break;
 
    }
    this.respuestasChatbot.push('CHATBOOT: ' + respuesta);
    console.log('Respuesta del chatbot:', respuesta);
  }
  
  agregarMensajeUsuario(mensaje: string) {
    this.mensajes.push({ contenido: mensaje, tipo: 'usuario' });
  }

  agregarMensajeChatbot(mensaje: string) {
    this.mensajes.push({ contenido: mensaje, tipo: 'chatbot' });
  }

  mensajeAnteriorChatbot(): boolean {
    return this.mensajes.length > 0 && this.mensajes[this.mensajes.length - 1].tipo === 'chatbot';
  }
}
