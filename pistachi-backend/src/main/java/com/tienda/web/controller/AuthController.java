package com.tienda.web.controller;

import com.tienda.model.Producto;
import com.tienda.model.Usuario;
import com.tienda.repository.IProductoRepository;
import com.tienda.repository.IUsuarioRepository;
import com.tienda.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private IProductoRepository productoRepository;

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        try {
            // Rol por defecto para los usuarios de la web
            usuario.setRol(com.tienda.model.RolUsuario.USUARIO);
            if (usuario.getTipoSuscripcion() == null || usuario.getTipoSuscripcion().isEmpty()) {
                usuario.setTipoSuscripcion("Ninguna");
            }

            // Encriptar la contraseña antes de guardar el usuario en MySQL
            String hashPassword = passwordEncoder.encode(usuario.getPassword());
            usuario.setPassword(hashPassword);
            
            Usuario nuevoUsuario = usuarioRepository.save(usuario);
            
            // Enviar email de confirmación
            emailService.enviarEmailBienvenida(nuevoUsuario.getEmail(), nuevoUsuario.getNombre());
            
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

        // Utilizamos matches() para comparar el texto plano con el hash de la BBDD
        if (usuario != null && passwordEncoder.matches(password, usuario.getPassword())) {
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }

    @GetMapping("/usuarios")
    public ResponseEntity<java.util.List<Map<String, Object>>> obtenerUsuarios() {
        java.util.List<Usuario> usuarios = usuarioRepository.findAll();
        java.util.List<Map<String, Object>> usuariosSeguros = new java.util.ArrayList<>();
        for (Usuario u : usuarios) {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", u.getId());
            map.put("nombre", u.getNombre());
            map.put("apellidos", u.getApellidos());
            map.put("email", u.getEmail());
            map.put("rol", u.getRol());
            map.put("username", u.getUsername());
            map.put("tachis", u.getTachis());
            map.put("fechaNacimiento", u.getFechaNacimiento());
            map.put("tipoSuscripcion", u.getTipoSuscripcion());
            map.put("proximaEntrega", u.getProximaEntrega());
            usuariosSeguros.add(map);
        }
        return ResponseEntity.ok(usuariosSeguros);
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<?> obtenerUsuario(@PathVariable Long id) {
        java.util.Optional<Usuario> userOpt = usuarioRepository.findById(id);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        try {
            usuarioRepository.deleteById(id);
            return ResponseEntity.ok().body(Map.of("mensaje", "Usuario eliminado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar usuario: " + e.getMessage());
        }
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<?> editarUsuario(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            java.util.Optional<Usuario> userOpt = usuarioRepository.findById(id);
            if (userOpt.isPresent()) {
                Usuario u = userOpt.get();
                if (payload.containsKey("nombre")) u.setNombre((String) payload.get("nombre"));
                if (payload.containsKey("apellidos")) u.setApellidos((String) payload.get("apellidos"));
                if (payload.containsKey("email")) u.setEmail((String) payload.get("email"));
                if (payload.containsKey("username")) u.setUsername((String) payload.get("username"));
                if (payload.containsKey("tachis") && payload.get("tachis") != null) u.setTachis(Integer.valueOf(payload.get("tachis").toString()));
                if (payload.containsKey("fechaNacimiento") && payload.get("fechaNacimiento") != null) u.setFechaNacimiento(java.time.LocalDate.parse(payload.get("fechaNacimiento").toString()));
                if (payload.containsKey("proximaEntrega") && payload.get("proximaEntrega") != null) u.setProximaEntrega(java.time.LocalDate.parse(payload.get("proximaEntrega").toString()));
                if (payload.containsKey("tipoSuscripcion")) u.setTipoSuscripcion((String) payload.get("tipoSuscripcion"));
                
                usuarioRepository.save(u);
                return ResponseEntity.ok().body(Map.of("mensaje", "Usuario actualizado"));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al editar usuario: " + e.getMessage());
        }
    }

    @PostMapping("/usuarios/{id}/favoritos/{productoId}")
    public ResponseEntity<?> addFavorito(@PathVariable Long id, @PathVariable Long productoId) {
        java.util.Optional<Usuario> userOpt = usuarioRepository.findById(id);
        java.util.Optional<Producto> prodOpt = productoRepository.findById(productoId);
        
        if (userOpt.isPresent() && prodOpt.isPresent()) {
            Usuario u = userOpt.get();
            Producto p = prodOpt.get();
            u.getProductosFavoritos().add(p);
            usuarioRepository.save(u);
            return ResponseEntity.ok().body(Map.of("mensaje", "Favorito añadido"));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/usuarios/{id}/favoritos/{productoId}")
    public ResponseEntity<?> removeFavorito(@PathVariable Long id, @PathVariable Long productoId) {
        java.util.Optional<Usuario> userOpt = usuarioRepository.findById(id);
        java.util.Optional<Producto> prodOpt = productoRepository.findById(productoId);
        
        if (userOpt.isPresent() && prodOpt.isPresent()) {
            Usuario u = userOpt.get();
            Producto p = prodOpt.get();
            u.getProductosFavoritos().remove(p);
            usuarioRepository.save(u);
            return ResponseEntity.ok().body(Map.of("mensaje", "Favorito eliminado"));
        }
        return ResponseEntity.notFound().build();
    }

}