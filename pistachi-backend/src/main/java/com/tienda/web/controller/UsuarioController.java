package com.tienda.web.controller;

import com.tienda.model.Usuario;
import com.tienda.repository.IUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @PutMapping("/{id}/suscripcion")
    // esta ruta sirve para cuando alguien se apunta o se borra de la caja sorpresa mensual, coge el id del usuario y le actualiza la fecha del proximo envio sumandole un mes, como por ejemplo si te apuntas hoy te marca que la proxima caja te llega justo el mes que viene
    public ResponseEntity<?> actualizarSuscripcion(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findById(id);

        if (!optionalUsuario.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuario = optionalUsuario.get();
        String tipoSuscripcion = payload.get("tipoSuscripcion");

        if (tipoSuscripcion == null || tipoSuscripcion.isEmpty() || tipoSuscripcion.equals("Ninguna")) {
            usuario.setTipoSuscripcion(null);
            usuario.setProximaEntrega(null);
        } else {
            usuario.setTipoSuscripcion(tipoSuscripcion);
            // Si el usuario no tenía suscripción o acaba de suscribirse, fijamos la próxima entrega en 1 mes
            if (usuario.getProximaEntrega() == null) {
                usuario.setProximaEntrega(LocalDate.now().plusMonths(1));
            }
        }

        Usuario guardado = usuarioRepository.save(usuario);
        return ResponseEntity.ok(guardado);
    }
}
