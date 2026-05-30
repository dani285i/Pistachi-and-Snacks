package com.tienda.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // esta es la funcion que te manda un correo al registrarte en la app, básicamente pilla el mail que usa spring boot por debajo y te construye un mensaje en html saludandote, como por ejemplo poniendo hola paco bienvenido a la tienda
    public void enviarEmailBienvenida(String emailDestino, String nombreUsuario) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setTo(emailDestino);
            helper.setSubject("¡Bienvenido a El Obrador de Pistacho! 🥐");

            String contenidoHtml = "<h1>¡Hola " + nombreUsuario + "!</h1>"
                    + "<p>Nos alegra muchísimo darte la bienvenida a la familia de <b>El Obrador de Pistacho</b>.</p>"
                    + "<p>Tu cuenta ha sido creada exitosamente. A partir de ahora podrás hacer tus pedidos de nuestros dulces y snacks favoritos de forma rápida y sencilla.</p>"
                    + "<p>¡Esperamos que disfrutes de nuestros productos artesanos horneados a diario!</p>"
                    + "<br><p>Un saludo,<br>El equipo de Pistachitos y Snacks.</p>";

            helper.setText(contenidoHtml, true);

            mailSender.send(mensaje);
            System.out.println("Email de bienvenida enviado con éxito a: " + emailDestino);

        } catch (Exception e) {
            System.err.println("Error al enviar el correo a " + emailDestino + ": " + e.getMessage());
        }
    }

    // y esta funcion es la que usamos para avisarte si algo vuelve a estar en stock, le pasas el nombre del producto y el nombre de la persona y pam, te llega el mail diciendo que corras que se agota otra vez, como por ejemplo cuando vuelven a traer los croissants
    public void enviarEmailStockDisponible(String emailDestino, String nombreUsuario, String nombreProducto) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setTo(emailDestino);
            helper.setSubject("¡" + nombreProducto + " vuelve a estar disponible! 🥐");

            String contenidoHtml = "<h1>¡Hola " + nombreUsuario + "!</h1>"
                    + "<p>Te escribimos para avisarte de que el producto <b>" + nombreProducto + "</b> que estabas esperando ya vuelve a tener stock en <b>El Obrador de Pistacho</b>.</p>"
                    + "<p>¡Date prisa y haz tu pedido antes de que se vuelva a agotar!</p>"
                    + "<br><p>Un saludo,<br>El equipo de Pistachitos y Snacks.</p>";

            helper.setText(contenidoHtml, true);

            mailSender.send(mensaje);
            System.out.println("Email de stock disponible enviado con éxito a: " + emailDestino);

        } catch (Exception e) {
            System.err.println("Error al enviar el correo de stock a " + emailDestino + ": " + e.getMessage());
        }
    }

    public void enviarEmailConfirmacionPedido(String emailDestino, String nombreUsuario, Long pedidoId, Double total) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setTo(emailDestino);
            helper.setSubject("¡Pedido Confirmado #" + pedidoId + "! 📦");

            String contenidoHtml = "<h1>¡Hola " + nombreUsuario + "!</h1>"
                    + "<p>Tu pedido número <b>#" + pedidoId + "</b> ha sido registrado correctamente.</p>"
                    + "<p>El importe total de tu compra es de <b>" + String.format(java.util.Locale.forLanguageTag("es-ES"), "%.2f", total) + "€</b>.</p>"
                    + "<p>Nuestros pasteleros ya están manos a la obra para prepararlo.</p>"
                    + "<br><p>Un saludo,<br>El equipo de Pistachitos y Snacks.</p>";

            helper.setText(contenidoHtml, true);

            mailSender.send(mensaje);
            System.out.println("Email de confirmación de pedido enviado con éxito a: " + emailDestino);

        } catch (Exception e) {
            System.err.println("Error al enviar el correo de confirmación de pedido a " + emailDestino + ": " + e.getMessage());
        }
    }
}
