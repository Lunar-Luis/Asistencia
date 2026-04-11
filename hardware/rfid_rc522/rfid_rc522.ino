#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>

// ==========================================
// 1. CONFIGURACIÓN DE RED
// ==========================================
const char* ssid = "Kious-2025";
const char* password = "anurbe29985921";

// REEMPLAZA LA IP POR LA IPv4 DE TU COMPUTADORA
const String serverIP = "192.168.1.8"; // <-- Extraje solo la IP para que sea más fácil armar las URLs
const String urlAsistencia = "http://" + serverIP + ":8080/api/asistencias/hardware/marcar"; 
const String urlPing = "http://" + serverIP + ":8080/api/terminales/hardware/ping";

// ==========================================
// 2. CONFIGURACIÓN DEL HARDWARE
// ==========================================
#define RST_PIN  22 
#define SS_PIN   5  
MFRC522 mfrc522(SS_PIN, RST_PIN); 

String macAddress = "";

// ==========================================
// 3. VARIABLES PARA EL PING DE ESTADO ONLINE
// ==========================================
unsigned long ultimoPingTime = 0;          
const unsigned long intervaloPing = 600000; // Enviar ping cada 600000 milisegundos (10 minutos)


void setup() {
  Serial.begin(115200);
  
  // Iniciar SPI y RFID
  SPI.begin();            
  mfrc522.PCD_Init();     
  
  // Conectar a WiFi
  Serial.println();
  Serial.print("Conectando a la red WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n¡WiFi Conectado con exito!");
  
  // Obtener la MAC Address de la ESP32 (LA NECESITAREMOS PARA REGISTRARLA)
  macAddress = WiFi.macAddress();
  Serial.print("---> MAC ADDRESS DE ESTA TERMINAL: ");
  Serial.println(macAddress);
  Serial.println("========================================");
  
  // Enviamos el primer ping nada más conectarnos
  enviarPingDeVida();
  
  Serial.println("Lista y esperando tarjetas...");
}

void loop() {
  // ========================================================
  // LÓGICA 1: PING DE VIDA (Se ejecuta cada 60 segundos)
  // ========================================================
  if (millis() - ultimoPingTime >= intervaloPing) {
    enviarPingDeVida();
    ultimoPingTime = millis(); // Reiniciamos el cronómetro
  }

  // ========================================================
  // LÓGICA 2: LECTURA DE TARJETAS RFID
  // ========================================================
  // Si no hay tarjeta nueva, o no se puede leer, salimos rápido del loop
  if ( ! mfrc522.PICC_IsNewCardPresent() || ! mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  // Leer el código UID de la tarjeta
  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uid += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    uid += String(mfrc522.uid.uidByte[i], HEX);
    if(i < mfrc522.uid.size - 1) uid += ":";
  }
  uid.toUpperCase();
  
  Serial.println("\n[NUEVA LECTURA]");
  Serial.print("UID Detectado: ");
  Serial.println(uid);

  // Enviar los datos de asistencia a Spring Boot
  enviarAsistencia(uid);

  // Pausar el lector por 3 segundos para evitar lecturas múltiples accidentales (Doble-Tap)
  mfrc522.PICC_HaltA();
  delay(3000); 
  Serial.println("Lista para la siguiente tarjeta...");
}

// ==========================================
// FUNCIONES HTTP
// ==========================================

void enviarAsistencia(String uid) {
  if(WiFi.status() == WL_CONNECTED){
    WiFiClient client;
    HTTPClient http;
    
    // Armamos el JSON que espera Spring Boot
    String jsonPayload = "{\"macAddress\":\"" + macAddress + "\",\"nfcUid\":\"" + uid + "\",\"fotoUrl\":\"\"}";
    
    // Disparamos a la ruta de marcar asistencia
    http.begin(client, urlAsistencia); 
    http.addHeader("Content-Type", "application/json");
    
    Serial.println("Enviando Asistencia UID: " + uid);
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      Serial.println("Respuesta del Servidor: " + http.getString());
    } else {
      Serial.println("Error de red enviando asistencia: " + String(httpResponseCode));
    }
    http.end();
  } else {
    Serial.println("Error: WiFi desconectado. No se pudo enviar la asistencia.");
  }
}

void enviarPingDeVida() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    
    Serial.println("--- INTENTANDO ENVIAR PING DE VIDA ---");
    Serial.print("URL: ");
    Serial.println(urlPing);
    
    http.begin(client, urlPing);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\"macAddress\":\"" + macAddress + "\"}";
    Serial.print("Payload enviado: ");
    Serial.println(jsonPayload);

    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      Serial.print("Respuesta HTTP del Servidor (Ping): ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
      Serial.println("Mensaje: " + payload);
    } else {
      Serial.print("Error de conexión (Ping). Código: ");
      Serial.println(httpResponseCode);
      Serial.println("Revisa que la IP del servidor sea correcta y Spring Boot esté corriendo.");
    }
    
    http.end(); 
    Serial.println("--------------------------------------");
  } else {
    Serial.println("Error (Ping): No hay conexión WiFi.");
  }
}