#include <ArduinoJson.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <TFT_eSPI.h>
#include <U8g2_for_TFT_eSPI.h>
#include <WebSocketsClient.h> 
#include <TJpg_Decoder.h>      
#include "mbedtls/base64.h"    
#include <Preferences.h>       // ---> LIBRERÍA NUEVA PARA GUARDAR OFFLINE

// ==========================================
// 1. CONFIGURACIÓN DE RED Y API
// ==========================================
const char* ssid = "Kious-2025";
const char* password = "anurbe29985921";

const String serverIP = "192.168.1.8"; 
const int serverPort = 8080;
const String urlAsistencia = "http://" + serverIP + ":" + String(serverPort) + "/api/asistencias/hardware/marcar";
const String urlPing = "http://" + serverIP + ":" + String(serverPort) + "/api/terminales/hardware/ping";

String macAddress = "";
WebSocketsClient webSocket; 
Preferences preferenciasOffline; // Nuestro "disco duro" interno

// ==========================================
// 2. CONFIGURACIÓN DEL HARDWARE
// ==========================================
#define RST_PIN  22 
#define SS_PIN   5  
MFRC522 mfrc522(SS_PIN, RST_PIN); 

TFT_eSPI tft = TFT_eSPI(); 
U8g2_for_TFT_eSPI u8f; 

unsigned long ultimoPingTime = 0;          
const unsigned long intervaloPing = 300000; 
int ultimoErrorHttp = 0; 
String ultimaFotoBase64 = ""; 

// ==========================================
// 3. SCREENSAVER (AHORRO DE ENERGÍA)
// ==========================================
unsigned long ultimoEventoDeUsuario = 0;
const unsigned long TIEMPO_DORMIR = 60000; 

// ==========================================
// 4. UI/UX: COLORES Y FUENTES 
// ==========================================
#define BG_COLOR         0xFFFF  
#define CARD_COLOR       0xEF5D  
#define PRIMARY_COLOR    0x03FF  
#define SUCCESS_COLOR    0x15D0  
#define SALIDA_COLOR     0x051D  
#define ERROR_COLOR      0xF1CB  
#define WARNING_COLOR    0xFDA0  
#define OFFLINE_COLOR    0xFEA0  // Color Amarillo/Mostaza para guardado Offline
#define ADMIN_COLOR      0x780F  
#define TEXT_MAIN        0x0000  
#define TEXT_MUTED       0x4A69  
#define TEXT_INVERT      0xFFFF  

#define FONT_GIGANTE   u8g2_font_helvB24_tf  
#define FONT_TITULO    u8g2_font_helvB18_tf  
#define FONT_REGULAR   u8g2_font_helvR14_tf  

enum EstadoSistema { 
  SYS_BOOT, SYS_STANDBY, SYS_LECTURA, 
  SYS_EXITO_ENTRADA, SYS_EXITO_SALIDA, SYS_EXITO_REGISTRO,
  SYS_ERR_NO_REGISTRADO, SYS_ERR_DENEGADO, SYS_ERR_DOBLE_TAP, SYS_ERR_COMPLETADO, SYS_ERR_RED, 
  SYS_EXITO_OFFLINE, // ---> NUEVO ESTADO PARA GUARDADO LOCAL
  SYS_WIFI_LOST, SYS_REGISTRO, SYS_SLEEP 
};
EstadoSistema estadoActual = SYS_BOOT;

// Declaración de funciones
void actualizarUI(EstadoSistema nuevoEstado);
void imprimirTextoCentrado(String texto, int x, int y, const uint8_t *fuente, uint16_t colorFg, uint16_t colorBg);
int procesarAsistencia(String uid); 
void enviarPingDeVida();
void despertarPantalla();
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length);
void guardarAsistenciaOffline(String uid);
void sincronizarAsistenciasPendientes();

bool tft_output(int16_t x, int16_t y, uint16_t w, uint16_t h, uint16_t* bitmap) {
  if ( y >= tft.height() ) return 0;
  tft.pushImage(x, y, w, h, bitmap);
  return 1;
}

void dibujarFotoBase64(String b64, int x, int y) {
  int commaIndex = b64.indexOf(',');
  if (commaIndex != -1) {
    b64 = b64.substring(commaIndex + 1);
  }
  
  size_t outputLength;
  unsigned char * decodedBuffer = (unsigned char *)malloc(b64.length()); 
  if (!decodedBuffer) {
    Serial.println("[FOTO] RAM Insuficiente para la foto");
    return;
  }

  int err = mbedtls_base64_decode(decodedBuffer, b64.length(), &outputLength, (const unsigned char *)b64.c_str(), b64.length());
  
  if (err == 0) {
    TJpgDec.drawJpg(x, y, decodedBuffer, outputLength);
  } else {
    Serial.println("[FOTO] Error decodificando Base64");
  }
  
  free(decodedBuffer); 
}

// ==========================================
// SETUP INICIAL
// ==========================================
void setup() {
  Serial.begin(115200);
  
  pinMode(15, OUTPUT); digitalWrite(15, HIGH); 
  pinMode(5, OUTPUT);  digitalWrite(5, HIGH);  
  delay(100); 

  SPI.begin();            
  mfrc522.PCD_Init();     

  tft.init();
  tft.setRotation(0); 
  tft.invertDisplay(false); 
  u8f.begin(tft);
  u8f.setFontMode(0); 
  u8f.setFontDirection(0);
  
  TJpgDec.setJpgScale(1);
  TJpgDec.setSwapBytes(true);
  TJpgDec.setCallback(tft_output);

  // Inicializamos el espacio de memoria persistente llamado "memoriaCMBT"
  preferenciasOffline.begin("memoriaCMBT", false); 

  actualizarUI(SYS_BOOT); 

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }
  macAddress = WiFi.macAddress();
  
  webSocket.begin(serverIP, serverPort, "/ws/terminales");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000); 
  
  enviarPingDeVida(); // Aquí dentro también intentará sincronizar las pendientes
  delay(1000); 
  despertarPantalla(); 
}

// ==========================================
// BUCLE PRINCIPAL
// ==========================================
void loop() {
  webSocket.loop(); 

  // CONTROL WIFI RELAJADO (Si no hay internet, solo mostramos el estado pero seguimos vivos)
  if (WiFi.status() != WL_CONNECTED && estadoActual != SYS_WIFI_LOST && estadoActual == SYS_STANDBY) {
    actualizarUI(SYS_WIFI_LOST);
  }

  if (millis() - ultimoEventoDeUsuario > TIEMPO_DORMIR && estadoActual == SYS_STANDBY) {
    actualizarUI(SYS_SLEEP);
  }

  // Ping solo si hay WiFi
  if (millis() - ultimoPingTime >= intervaloPing) {
    if (WiFi.status() == WL_CONNECTED) {
      enviarPingDeVida();
    }
    ultimoPingTime = millis(); 
  }

  if ( ! mfrc522.PICC_IsNewCardPresent() || ! mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  despertarPantalla();
  
  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uid += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    uid += String(mfrc522.uid.uidByte[i], HEX);
    if(i < mfrc522.uid.size - 1) uid += ":";
  }
  uid.toUpperCase();
  
  actualizarUI(SYS_LECTURA);
  
  int res = procesarAsistencia(uid);

  switch (res) {
    case 1: actualizarUI(SYS_EXITO_ENTRADA); break;
    case 2: actualizarUI(SYS_EXITO_SALIDA); break;
    case 3: actualizarUI(SYS_ERR_NO_REGISTRADO); break;
    case 4: actualizarUI(SYS_ERR_DOBLE_TAP); break;
    case 5: actualizarUI(SYS_ERR_COMPLETADO); break;
    case 6: actualizarUI(SYS_ERR_DENEGADO); break;
    case 7: actualizarUI(SYS_EXITO_REGISTRO); break; 
    case 8: actualizarUI(SYS_EXITO_OFFLINE); break; // <--- SE AGREGA EL CASO OFFLINE
    default: actualizarUI(SYS_ERR_RED); break;
  }

  delay(3500); 
  mfrc522.PICC_HaltA();
  
  if (res == 7) {
    actualizarUI(SYS_STANDBY);
  } else if (estadoActual != SYS_REGISTRO) {
    actualizarUI(SYS_STANDBY);
  }
}

// ==========================================
// RECEPCIÓN DE ÓRDENES WEBSOCKET
// ==========================================
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_TEXT:
      String msg = String((char*)payload);
      JsonDocument doc;
      DeserializationError error = deserializeJson(doc, msg);
      
      if (!error) {
        String comandoStr = doc["comando"].as<String>();
        
        if (comandoStr == "SYS_REGISTRO") {
          ultimoEventoDeUsuario = millis(); 
          actualizarUI(SYS_REGISTRO);
        } 
        else if (comandoStr == "SYS_ASISTENCIA") {
          despertarPantalla();
        }
      }
      break;
  }
}

void despertarPantalla() {
  ultimoEventoDeUsuario = millis(); 
  if (estadoActual == SYS_SLEEP || estadoActual == SYS_BOOT || estadoActual == SYS_WIFI_LOST) {
    actualizarUI(SYS_STANDBY);
  }
}

// ---> SISTEMA DE ALMACENAMIENTO OFFLINE <---
void guardarAsistenciaOffline(String uid) {
  // Leemos cuántas pendientes hay
  String pendientesStr = preferenciasOffline.getString("pendientes", "");
  
  // Guardamos las tarjetas separadas por coma. Ej: "AA:BB:CC,DD:EE:FF"
  if (pendientesStr.length() > 0) {
    pendientesStr += ",";
  }
  pendientesStr += uid;
  
  preferenciasOffline.putString("pendientes", pendientesStr);
  Serial.println("[OFFLINE] Tarjeta guardada localmente: " + uid);
}

void sincronizarAsistenciasPendientes() {
  String pendientesStr = preferenciasOffline.getString("pendientes", "");
  
  if (pendientesStr.length() == 0) return; // No hay nada pendiente
  
  Serial.println("[OFFLINE] Detectadas tarjetas pendientes. Intentando sincronizar...");
  
  // Si hay muchas tarjetas separadas por coma, las enviamos una a una silenciosamente
  int startIndex = 0;
  int commaIndex = pendientesStr.indexOf(',', startIndex);
  String pendientesFallidas = ""; // Si falla a la mitad, guardamos las que falten
  
  while (startIndex < pendientesStr.length()) {
    String uidToSync = (commaIndex != -1) ? pendientesStr.substring(startIndex, commaIndex) : pendientesStr.substring(startIndex);
    
    // Intento de envío HTTP silencioso
    WiFiClient client;
    HTTPClient http;
    String jsonPayload = "{\"macAddress\":\"" + macAddress + "\",\"nfcUid\":\"" + uidToSync + "\",\"fotoUrl\":\"\"}";
    
    http.begin(client, urlAsistencia); 
    http.addHeader("Content-Type", "application/json");
    http.setTimeout(10000); 
    int httpResponseCode = http.POST(jsonPayload);
    http.end();

    // Si Spring Boot responde bien o nos da un error de lógica (400, 404), la tarjeta ya llegó, no se reintenta.
    if (httpResponseCode >= 200 && httpResponseCode <= 499) {
      Serial.println("[OFFLINE] Sincronizada con éxito: " + uidToSync);
    } else {
      // Servidor volvió a caerse. Guardamos esta y las demás para el futuro.
      Serial.println("[OFFLINE] Falló sincronización de: " + uidToSync);
      if (pendientesFallidas.length() > 0) pendientesFallidas += ",";
      pendientesFallidas += uidToSync;
    }

    if (commaIndex == -1) break;
    startIndex = commaIndex + 1;
    commaIndex = pendientesStr.indexOf(',', startIndex);
  }

  // Actualizamos la memoria con las que hayan sobrado o la vaciamos si todo salió bien.
  preferenciasOffline.putString("pendientes", pendientesFallidas);
}


int procesarAsistencia(String uid) {
  // SI NO HAY INTERNET -> GUARDADO OFFLINE DIRECTO
  if (WiFi.status() != WL_CONNECTED) {
    guardarAsistenciaOffline(uid);
    return 8; // Código 8: Guardado en Memoria Flash
  }

  ultimaFotoBase64 = ""; 

  WiFiClient client;
  HTTPClient http;
  
  String jsonPayload = "{\"macAddress\":\"" + macAddress + "\",\"nfcUid\":\"" + uid + "\",\"fotoUrl\":\"\"}";
  
  http.begin(client, urlAsistencia); 
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(10000); 
  
  int httpResponseCode = http.POST(jsonPayload);
  int resultadoLogico = -2; 
  
  if (httpResponseCode > 0) {
    String body = http.getString(); 
    Serial.println("[HTTP] Código: " + String(httpResponseCode));
    
    if (httpResponseCode >= 200 && httpResponseCode <= 299) {
      
      int fotoIndex = body.indexOf("\"fotoUrl\":\"");
      if (fotoIndex != -1) {
        int start = fotoIndex + 11;
        int end = body.indexOf("\"", start);
        if (end != -1) {
          ultimaFotoBase64 = body.substring(start, end);
        }
      }

      if (body.indexOf("atrapada") != -1 || body.indexOf("registro") != -1) {
        resultadoLogico = 7; 
      }
      else if (body.indexOf("\"marcaSalida\":null") != -1 || body.indexOf("\"marcaSalida\": null") != -1) {
        resultadoLogico = 1; 
      } else {
        resultadoLogico = 2; 
      }
    } 
    else {
      if (body.indexOf("no reconocida") != -1 || body.indexOf("no registrada") != -1) {
        resultadoLogico = 3; 
      } 
      else if (body.indexOf("Doble lectura") != -1 || body.indexOf("15 minutos") != -1) {
        resultadoLogico = 4; 
      } 
      else if (body.indexOf("ya complet") != -1 || body.indexOf("jornada") != -1) {
        resultadoLogico = 5; 
      } 
      else if (body.indexOf("inactiva") != -1 || httpResponseCode == 401 || httpResponseCode == 403) {
        resultadoLogico = 6; 
      } 
      else {
        ultimoErrorHttp = httpResponseCode;
        resultadoLogico = -2; 
      }
    }
  } else {
    // SI HAY INTERNET PERO EL SERVIDOR ESTÁ CAÍDO (Error -1, -11, etc)
    Serial.println("[HTTP] Servidor caído: " + http.errorToString(httpResponseCode));
    guardarAsistenciaOffline(uid);
    resultadoLogico = 8; // Código 8: Guardado en Memoria Flash
  }
  
  http.end();
  return resultadoLogico;
}

void enviarPingDeVida() {
  // Antes de enviar el ping, sincronizamos la basura atorada
  sincronizarAsistenciasPendientes();

  WiFiClient client;
  HTTPClient http;
  http.begin(client, urlPing);
  http.addHeader("Content-Type", "application/json");
  http.POST("{\"macAddress\":\"" + macAddress + "\"}");
  http.end(); 
}

// ==========================================
// RENDERIZADO VISUAL
// ==========================================
void imprimirTextoCentrado(String texto, int x, int y, const uint8_t *fuente, uint16_t colorFg, uint16_t colorBg) {
  u8f.setFont(fuente);
  u8f.setForegroundColor(colorFg);
  u8f.setBackgroundColor(colorBg);
  int anchoTexto = u8f.getUTF8Width(texto.c_str());
  u8f.setCursor(x - (anchoTexto / 2), y);
  u8f.print(texto);
}

void actualizarUI(EstadoSistema nuevoEstado) {
  if (estadoActual == nuevoEstado) return; 
  
  estadoActual = nuevoEstado;

  if (estadoActual == SYS_SLEEP) {
    tft.fillScreen(0x0000); 
    return; 
  }

  tft.fillScreen(BG_COLOR);
  
  if (estadoActual != SYS_BOOT) {
    uint16_t colorCardActual = (estadoActual == SYS_REGISTRO) ? 0xF7BE : CARD_COLOR; 
    tft.fillRoundRect(10, 10, 220, 250, 16, colorCardActual);
    if(estadoActual == SYS_REGISTRO) {
      tft.drawRoundRect(10, 10, 220, 250, 16, ADMIN_COLOR); 
    }
  }

  switch (estadoActual) {
    case SYS_BOOT:
      imprimirTextoCentrado("SyncLogic", 120, 110, FONT_GIGANTE, TEXT_MAIN, BG_COLOR);
      tft.drawSmoothArc(120, 175, 30, 24, 225, 315, PRIMARY_COLOR, BG_COLOR);
      tft.fillCircle(120, 175, 4, PRIMARY_COLOR);
      break;

    case SYS_STANDBY:
      imprimirTextoCentrado("Aproxime su", 120, 60, FONT_TITULO, TEXT_MAIN, CARD_COLOR);
      imprimirTextoCentrado("Credencial", 120, 90, FONT_TITULO, TEXT_MAIN, CARD_COLOR);
      tft.drawSmoothArc(120, 160, 50, 42, 225, 315, PRIMARY_COLOR, CARD_COLOR);
      tft.drawSmoothArc(120, 160, 35, 28, 235, 305, PRIMARY_COLOR, CARD_COLOR);
      tft.drawSmoothArc(120, 160, 20, 14, 245, 295, PRIMARY_COLOR, CARD_COLOR);
      tft.fillCircle(120, 160, 6, PRIMARY_COLOR);
      imprimirTextoCentrado("Lector Activo", 120, 240, FONT_REGULAR, TEXT_MUTED, CARD_COLOR);
      break;

    case SYS_REGISTRO:
      imprimirTextoCentrado("NUEVO", 120, 60, FONT_TITULO, ADMIN_COLOR, 0xF7BE);
      imprimirTextoCentrado("REGISTRO", 120, 90, FONT_TITULO, ADMIN_COLOR, 0xF7BE);
      tft.fillCircle(105, 140, 18, ADMIN_COLOR);
      tft.fillRoundRect(80, 165, 50, 25, 12, ADMIN_COLOR);
      tft.fillCircle(145, 160, 18, 0xF7BE);
      tft.fillRoundRect(135, 157, 20, 6, 3, PRIMARY_COLOR); 
      tft.fillRoundRect(142, 150, 6, 20, 3, PRIMARY_COLOR); 
      imprimirTextoCentrado("Acerque nueva tarjeta...", 120, 225, FONT_REGULAR, TEXT_MUTED, 0xF7BE);
      break;

    case SYS_LECTURA:
      imprimirTextoCentrado("Procesando", 120, 80, FONT_TITULO, PRIMARY_COLOR, CARD_COLOR);
      tft.drawRoundRect(50, 135, 140, 10, 5, TEXT_MUTED);
      tft.fillRoundRect(50, 135, 90, 10, 5, PRIMARY_COLOR); 
      break;

    case SYS_EXITO_ENTRADA:
      tft.fillRoundRect(10, 10, 220, 250, 16, SUCCESS_COLOR);
      
      if (ultimaFotoBase64.length() > 20) {
        tft.fillRect(58, 28, 124, 124, TEXT_INVERT); 
        dibujarFotoBase64(ultimaFotoBase64, 60, 30); 
      } else {
        tft.fillCircle(120, 90, 45, TEXT_INVERT);
        tft.drawWedgeLine(95, 90, 115, 110, 5, 5, SUCCESS_COLOR, TEXT_INVERT);
        tft.drawWedgeLine(115, 110, 145, 75, 5, 5, SUCCESS_COLOR, TEXT_INVERT);
      }
      
      imprimirTextoCentrado("ENTRADA", 120, 185, FONT_TITULO, TEXT_INVERT, SUCCESS_COLOR);
      imprimirTextoCentrado("GUARDADA", 120, 220, FONT_TITULO, TEXT_INVERT, SUCCESS_COLOR);
      break;

    case SYS_EXITO_SALIDA:
      tft.fillRoundRect(10, 10, 220, 250, 16, SALIDA_COLOR);
      if (ultimaFotoBase64.length() > 20) {
        tft.fillRect(58, 28, 124, 124, TEXT_INVERT);
        dibujarFotoBase64(ultimaFotoBase64, 60, 30);
      } else {
        tft.fillCircle(120, 90, 45, TEXT_INVERT);
        tft.drawWedgeLine(95, 90, 115, 110, 5, 5, SALIDA_COLOR, TEXT_INVERT);
        tft.drawWedgeLine(115, 110, 145, 75, 5, 5, SALIDA_COLOR, TEXT_INVERT);
      }
      
      imprimirTextoCentrado("SALIDA", 120, 185, FONT_TITULO, TEXT_INVERT, SALIDA_COLOR);
      imprimirTextoCentrado("GUARDADA", 120, 220, FONT_TITULO, TEXT_INVERT, SALIDA_COLOR);
      break;

    case SYS_EXITO_REGISTRO:
      tft.fillRoundRect(10, 10, 220, 250, 16, SUCCESS_COLOR);
      tft.fillCircle(120, 100, 45, TEXT_INVERT);
      tft.drawWedgeLine(95, 100, 115, 120, 5, 5, SUCCESS_COLOR, TEXT_INVERT);
      tft.drawWedgeLine(115, 120, 145, 85, 5, 5, SUCCESS_COLOR, TEXT_INVERT);
      imprimirTextoCentrado("TARJETA", 120, 190, FONT_TITULO, TEXT_INVERT, SUCCESS_COLOR);
      imprimirTextoCentrado("ASIGNADA", 120, 225, FONT_TITULO, TEXT_INVERT, SUCCESS_COLOR);
      break;

    // ---> NUEVA PANTALLA: GUARDADO OFFLINE <---
    case SYS_EXITO_OFFLINE:
      tft.fillRoundRect(10, 10, 220, 250, 16, OFFLINE_COLOR);
      tft.fillCircle(120, 100, 45, TEXT_INVERT);
      // Ícono de una antena Wi-Fi tachada o un disco duro (Simplificado)
      tft.fillRoundRect(105, 70, 30, 60, 4, OFFLINE_COLOR);
      tft.drawWedgeLine(100, 100, 140, 100, 3, 3, TEXT_INVERT, OFFLINE_COLOR);
      
      imprimirTextoCentrado("GUARDADO", 120, 190, FONT_TITULO, TEXT_INVERT, OFFLINE_COLOR);
      imprimirTextoCentrado("EN MEMORIA", 120, 225, FONT_TITULO, TEXT_INVERT, OFFLINE_COLOR);
      break;

    case SYS_ERR_COMPLETADO:
      tft.fillRoundRect(10, 10, 220, 250, 16, PRIMARY_COLOR);
      tft.fillCircle(120, 100, 45, TEXT_INVERT);
      tft.drawWedgeLine(95, 100, 115, 120, 5, 5, PRIMARY_COLOR, TEXT_INVERT);
      tft.drawWedgeLine(115, 120, 145, 85, 5, 5, PRIMARY_COLOR, TEXT_INVERT);
      imprimirTextoCentrado("JORNADA", 120, 190, FONT_TITULO, TEXT_INVERT, PRIMARY_COLOR);
      imprimirTextoCentrado("FINALIZADA", 120, 225, FONT_TITULO, TEXT_INVERT, PRIMARY_COLOR);
      break;

    case SYS_ERR_NO_REGISTRADO:
      tft.fillRoundRect(10, 10, 220, 250, 16, ERROR_COLOR);
      tft.fillCircle(120, 100, 45, TEXT_INVERT);
      imprimirTextoCentrado("?", 120, 115, FONT_GIGANTE, ERROR_COLOR, TEXT_INVERT); 
      imprimirTextoCentrado("TARJETA NO", 120, 190, FONT_TITULO, TEXT_INVERT, ERROR_COLOR);
      imprimirTextoCentrado("REGISTRADA", 120, 225, FONT_TITULO, TEXT_INVERT, ERROR_COLOR);
      break;

    case SYS_ERR_DENEGADO:
      tft.fillRoundRect(10, 10, 220, 250, 16, ERROR_COLOR);
      tft.fillCircle(120, 100, 45, TEXT_INVERT);
      tft.drawWedgeLine(100, 85, 140, 115, 6, 6, ERROR_COLOR, TEXT_INVERT); 
      tft.drawWedgeLine(140, 85, 100, 115, 6, 6, ERROR_COLOR, TEXT_INVERT);
      imprimirTextoCentrado("ACCESO", 120, 190, FONT_TITULO, TEXT_INVERT, ERROR_COLOR);
      imprimirTextoCentrado("DENEGADO", 120, 225, FONT_TITULO, TEXT_INVERT, ERROR_COLOR);
      break;

    case SYS_ERR_DOBLE_TAP:
      tft.fillRoundRect(10, 10, 220, 250, 16, WARNING_COLOR);
      tft.fillCircle(120, 100, 45, TEXT_INVERT);
      tft.drawWedgeLine(120, 75, 120, 110, 6, 4, WARNING_COLOR, TEXT_INVERT); 
      tft.fillCircle(120, 125, 6, WARNING_COLOR);
      imprimirTextoCentrado("YA MARCO", 120, 190, FONT_TITULO, TEXT_INVERT, WARNING_COLOR);
      imprimirTextoCentrado("ESPERE 15M", 120, 225, FONT_TITULO, TEXT_INVERT, WARNING_COLOR);
      break;

    case SYS_ERR_RED: {
      tft.fillRoundRect(10, 10, 220, 250, 16, WARNING_COLOR);
      tft.fillCircle(120, 100, 45, TEXT_INVERT);
      tft.drawWedgeLine(120, 75, 120, 110, 6, 4, WARNING_COLOR, TEXT_INVERT); 
      tft.fillCircle(120, 125, 6, WARNING_COLOR);
      imprimirTextoCentrado("ERROR RED", 120, 190, FONT_TITULO, TEXT_INVERT, WARNING_COLOR);
      String txtError = "COD: " + String(ultimoErrorHttp);
      imprimirTextoCentrado(txtError, 120, 225, FONT_TITULO, TEXT_INVERT, WARNING_COLOR);
      break;
    }

    case SYS_WIFI_LOST:
      imprimirTextoCentrado("ERROR WIFI", 120, 100, FONT_TITULO, ERROR_COLOR, CARD_COLOR);
      tft.drawSmoothArc(120, 175, 30, 24, 225, 315, ERROR_COLOR, CARD_COLOR);
      imprimirTextoCentrado("Lector Activo", 120, 220, FONT_REGULAR, TEXT_MUTED, CARD_COLOR);
      break;
  }

  if (estadoActual != SYS_BOOT && estadoActual != SYS_SLEEP) {
    imprimirTextoCentrado("PORTAL CMBT", 120, 295, FONT_TITULO, TEXT_MAIN, BG_COLOR); 
    tft.fillRoundRect(90, 312, 60, 4, 2, CARD_COLOR);
  }
}