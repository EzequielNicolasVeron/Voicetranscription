<script>

    transformaciones =
    [
      ['signo coma',', '],
      ['signo punto','. '],
      ["punto aparte",'.'+String.fromCharCode(13)+String.fromCharCode(10)],
      ["signo dos puntos",': '],
      ["punto y coma",'; '],
      ["nueva l&iacute;nea",String.fromCharCode(13)+String.fromCharCode(10)],
      ["signo comillas",'"'],
      ["agregar espacio",' '],
      ["numeral",'#']
    ]
    acciones =
    [
      ["finalizar dictado",function(){recognition.stop();}]
    ]
    abreviaturas =
    [
        ['trombosis venosa profunda','T.V.P. '],
        ['biopsia', 'Bx ']
    ]
    casos =
    [
      '.'+String.fromCharCode(13)+String.fromCharCode(10),
      String.fromCharCode(13)+String.fromCharCode(10),
      '. ',
      '? ',
      '! '
    ]
    var final_transcript = '';
    var recognizing = false;
    var ignore_onend;
    var start_timestamp;
    var info_upgrade = '<i class = "fa fa-microphone-slash"></i> El servicio de reconocimiento de voz no funciona en este navegador. Actualice <a href="//www.google.com/chrome">Chrome</a> a la versi&oacute;n 25 o posterior.'
    var pressCtrlC = 'Presione Ctrl + C para copiar.<br>(Command + C en Mac.)'
    var nothingToCopy = 'No se ha seleccionado ning�n texto para copiar.'
    var info_speak_now = '<i class = "fa fa-assistive-listening-systems"></i> Hable ahora'
    var info_no_speech = '<i class = "fa fa-deaf"></i> No se detect&oacute; la voz, deber&aacute; ajustar <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892"> la configuraci&oacute;n de su micr&oacute;fono</a>.'
    var no_mic_found = '<i class = "fa fa-microphone-slash"></i> No se encontr&oacute; ning�n micr&oacute;fono. Aseg�rese que el micr&oacute;fono est&aacute; instalado y correctamente <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892"> configurado.</a>'
    var no_mic_allow = '<i class = "fa fa-microphone-slash"></i> El uso del micr&oacute;fono est&aacute; bloqueado. Para modificarlo vaya a chrome://settings/contentExceptions#media-stream'
    var no_mic_allow_now = '<i class = "fa fa-microphone-slash"></i> El uso del micr&oacute;fono ha sido deshabilitado'
    var touch_mic_to_start = 'Haga click en el micr&oacute;fono para empezar a hablar'
    var mic_allow_please = '<i class = "fa fa-hand-o-up"></i> Haga click en "Permitir" para habilitar su micr&oacute;fono'
    var nothingChecked = "No hay texto verificado para agregar al documento."
    var nothingToSend = 'No hay ning�n texto en el documento para enviar por correo.'
    var copiedSuccessfully = "El texto del informe se ha copiado satisfactoriamente en el portapapeles. Puede pegarlo donde lo necesite."
    if (!('webkitSpeechRecognition' in window)) {
      upgrade();
    } else {
      var recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onstart = function() {
        recognizing = true;
        start_button_icon.className = "fa fa-pause"
        mensaje(true,info_speak_now)
      };
      recognition.onerror = function(event) {
        start_button_icon.className = "fa fa-microphone"
        if (event.error == 'no-speech') {
          mensaje(false,info_no_speech)
          ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
          mensaje(false,no_mic_found)
          ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
          if (event.timeStamp - start_timestamp < 100) {
            mensaje(false,no_mic_allow)
          } else {
            mensaje(false,no_mic_allow_now)
          }
          ignore_onend = true;
        }
      };
      recognition.onend = function() {
        recognizing = false;
        start_button_icon.className = "fa fa-microphone"
        if (ignore_onend) {
          return;
        }
        if (!final_transcript) {
          mensaje(false,touch_mic_to_start)
          return;
        }
        if (window.getSelection) {
          window.getSelection().removeAllRanges();
          var range = document.createRange();
          range.selectNode(document.getElementById('transcripcion'));
          window.getSelection().addRange(range);
        }
      };
      recognition.onresult = function(event) {
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        final_transcript = capitalize(final_transcript);
        final_span.innerHTML = linebreak(final_transcript);
        interim_span.innerHTML = linebreak(interim_transcript);
        if (final_transcript || interim_transcript) {
          transcripcion.focus()
          transcripcion.value = comandosdevoz(final_transcript) || interim_transcript;
          $('#transcripcion').trigger('autoresize');
        }
      };
    }
    function comandosdevoz(dictado){
      transforma = dictado;
      //transforma = dictado.toUpperCase()

      largo = transformaciones.length
      for (i = largo; i > 0; i--){

        transformacion_inicio = transformaciones[i-1][0];
        //transformacion_inicio = transformaciones[i-1][0].toUpperCase()
        transformacion_final = transformaciones[i-1][1];
        //transformacion_final = transformaciones[i-1][1].toUpperCase()
        transforma = transforma.split(' '+transformacion_inicio+' ').join(transformacion_final)
        transforma = transforma.split(' '+transformacion_inicio).join(transformacion_final)
        transforma = transforma.split(transformacion_inicio+' ').join(transformacion_final)
        transforma    = transforma.split(transformacion_inicio).join(transformacion_final)
      }
      //transforma = capitalizar(transforma)

      largo = abreviaturas.length
      for (i = largo; i > 0; i--){
        transformacion_inicio = abreviaturas[i-1][0];
        //transformacion_inicio = abreviaturas[i-1][0].toUpperCase()
        transformacion_final = abreviaturas[i-1][1];
        //transformacion_final = abreviaturas[i-1][1].toUpperCase()
        transforma = transforma.split(' '+transformacion_inicio+' ').join(transformacion_final)
        transforma = transforma.split(' '+transformacion_inicio).join(transformacion_final)
        transforma = transforma.split(transformacion_inicio+' ').join(transformacion_final)
        transforma = transforma.split(transformacion_inicio).join(transformacion_final)
      }

      return transforma
    }
    function capitalizar(texto){
      for (caso in casos){
        oraciones = texto.split(casos[caso])
        largo_oraciones = oraciones.length
        for (i = largo_oraciones; i > 0; i--){
          oracion = oraciones[i-1]
          oracion = oracion.charAt(0).toUpperCase() + oracion.slice(1);
          oraciones[i-1] = oracion
        }
        texto = oraciones.join(casos[caso])
      }
      return texto
    }
    function upgrade() {
      start_button.style.display = 'none';
      mensaje(false,info_upgrade)
    }
    var two_line = /\n\n/g;
    var one_line = /\n/g;
    function linebreak(s) {
      return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    }
    var first_char = /\S/;
    function capitalize(s) {
      return s.replace(first_char, function(m) { return m.toUpperCase(); });
    }
    function copyButton() {
      if (recognizing) {
        recognizing = false;
        recognition.stop();
      }
      if (window.getSelection) {
        if (transcripcion_final.value.length > 0){
          transcripcion_final.focus()
          window.getSelection().removeAllRanges();
          var range = document.createRange();
          range.selectNode(document.getElementById('transcripcion_final'));
          window.getSelection().addRange(range);
          if (document.queryCommandSupported('copy')){
            document.execCommand('copy')
            mensaje(true,copiedSuccessfully)
          } else {
            mensaje(true,pressCtrlC)
          }
        } else {
          mensaje(false,nothingToCopy)
        }
      }
    }
    function emailButton() {

      if (recognizing) {
        create_email = true;
        recognizing = false;
        recognition.stop();
        createEmail();
      } else {
        createEmail();
      }
    }
    function createEmail() {
      if (transcripcion_final.value.length > 0){
        var subject = encodeURI('Informe m&eacute;dico | Asistente de voz | SISSMO');
        var body = encodeURI(transcripcion_final.value);
        window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
      } else {
        mensaje(false,nothingToSend)
      }
    }
    function startButton(event) {
      if (recognizing) {
        recognition.stop();
        return;
      }
      final_transcript = '';
      recognition.lang = 'es-AR';
      recognition.start();
      ignore_onend = false;
      final_span.innerHTML = '';
      interim_span.innerHTML = '';
      mensaje(true,mic_allow_please)
      start_timestamp = event.timeStamp;
    }

    var current_style;
    function showButtons(style) {
      if (style == current_style) {
        return;
      }
      current_style = style;
      copy_button.style.display = style;
      copy_info.style.display = 'none';
    }
    function checkedEnd(){
      if (transcripcion.value.length > 0){
        transcripcion_final.focus()
        if (transcripcion_final.value.length > 0){
          transcripcion_final.value +=  String.fromCharCode(13) + String.fromCharCode(10)
        }
        transcripcion_final.value += transcripcion.value
        $('#transcripcion_final').trigger('autoresize');
        transcripcion.value = ""
        $('#transcripcion').trigger('autoresize');
      } else {
        mensaje(false,nothingChecked)
      }
    }
    function getDifference(a, b)
    {
        var i = 0;
        var j = 0;
        var result = "";

        while (j < b.length)
        {
            if (a[i] != b[j] || i == a.length)
                result += b[j];
            else
                i++;
            j++;
        }
        return result;
    }
    function listaComandos(){
      arrayLists =
      [
        [transformaciones,'commands_list'],
        [abreviaturas,'abrev_list']
      ]
      for (array_item in arrayLists){
        currentArray = arrayLists[array_item][0]
        for (item in currentArray){
          $("#"+arrayLists[array_item][1]).append($('<ul class = "collection-item"><div class = "chip"><b>'+currentArray[item][1]+'</b></div><span> "'+currentArray[item][0]+'"</span></ul>'))
        }
      }
    }
    $(document).ready(function(){
      $('.tooltipped').tooltip({delay: 50});
      listaComandos()
      $('.collapsible').collapsible({
        accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      });
    });
    /* toastjs */
    var idToast = "alert-zone";

    setID = function (idnuevo){
      idToast = idnuevo;
    }
    getID = function(){
      return idToast;
    }

    mensaje = function(success,message){
      $('#'+idToast).removeClass("alert-hide");
      setTimeout(function(){
        $('#'+idToast).addClass("alert-hide");
      }, 5000);
      $("#"+idToast).html('<div class="alert alert-'+((success)?'success':'danger')+'" role="alert"><span>'+message+'</span></div>');
    }
    /* fin de toastjs */
  </script>