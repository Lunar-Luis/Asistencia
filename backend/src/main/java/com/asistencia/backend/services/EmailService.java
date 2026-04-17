package com.asistencia.backend.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarCorreoRecuperacion(String destinatario, String enlace) {
        try {
            // Usamos MimeMessage para poder enviar formato HTML
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setTo(destinatario);
            helper.setSubject("Recuperación de Contraseña - Portal CMBT");

            // Plantilla HTML corporativa (usamos estilos en línea porque los gestores de correo bloquean el CSS externo)
            String htmlMsg = "<div style=\"font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; text-align: center;\">"
                    + "<div style=\"max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: left; border: 1px solid #f1f5f9;\">"

                    // Cabecera
                    + "<h2 style=\"color: #1e293b; margin-top: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;\">Portal CMBT</h2>"
                    + "<p style=\"color: #4f46e5; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-top: -15px; margin-bottom: 30px;\">Control de Asistencia</p>"

                    // Cuerpo del mensaje
                    + "<p style=\"color: #475569; font-size: 15px; line-height: 1.6;\">Hola,</p>"
                    + "<p style=\"color: #475569; font-size: 15px; line-height: 1.6;\">Hemos recibido una solicitud para restablecer la contraseña de acceso a tu cuenta. Si fuiste tú, por favor haz clic en el siguiente botón para continuar:</p>"

                    // Botón
                    + "<div style=\"text-align: center; margin: 35px 0;\">"
                    + "<a href=\"" + enlace + "\" style=\"background-color: #4f46e5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);\">Restablecer Contraseña</a>"
                    + "</div>"

                    // Advertencia
                    + "<p style=\"color: #64748b; font-size: 13px; line-height: 1.5; padding: 15px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #cbd5e1;\">"
                    + "Por motivos de seguridad, este enlace expirará en <strong>15 minutos</strong>. Si no solicitaste este cambio, puedes ignorar este correo de forma segura."
                    + "</p>"

                    // Separador
                    + "<hr style=\"border: none; border-top: 1px solid #e2e8f0; margin: 30px 0 20px 0;\" />"

                    // Pie de página (SyncLogic)
                    + "<p style=\"color: #94a3b8; font-size: 11px; text-align: center; margin-bottom: 0; text-transform: uppercase; letter-spacing: 1px;\">Desarrollado y Protegido por <strong style=\"color: #475569;\">Sync<span style=\"color: #4f46e5;\">Logic</span></strong></p>"
                    + "</div>"
                    + "</div>";

            // El segundo parámetro en 'true' le dice a Spring que este texto es HTML y no texto plano
            helper.setText(htmlMsg, true);

            mailSender.send(mensaje);

        } catch (MessagingException e) {
            System.err.println("Fallo al enviar el correo HTML: " + e.getMessage());
            throw new RuntimeException("No se pudo estructurar el correo de recuperación.");
        }
    }
}