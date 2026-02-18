package com.tienda.web.controller;

import com.tienda.model.Usuario;
import com.tienda.repository.IUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = usuarioRepository.save(usuario);
            return ResponseEntity.ok(nuevoUsuario);
        } catch (Exception error) {
            return ResponseEntity.badRequest().body("Error al registrar el usuario");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(@RequestBody Map<String, String> credenciales) {
        String email = credenciales.get("email");
        String password = credenciales.get("password");

        Usuario usuario = usuarioRepository.findByEmail(email);

        if (usuario != null && usuario.getPassword().equals(password)) {
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }

}