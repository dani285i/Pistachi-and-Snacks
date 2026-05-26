package com.tienda.config;

import com.tienda.model.Usuario;
import com.tienda.repository.IUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class AdminSetup implements CommandLineRunner {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Comprobamos si el admin ya existe para no duplicarlo cada vez que reinicias
        if (usuarioRepository.findByUsername("admin") == null) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123")); // La contraseña de admin
            admin.setNombre("Admin");
            admin.setApellidos("Administrador");
            admin.setEmail("admin@pistachi.com");
            admin.setFechaNacimiento(LocalDate.of(2006, 7, 27));
            admin.setRol("ADMIN");

            usuarioRepository.save(admin);
            System.out.println("========== USUARIO ADMIN CREADO CON ÉXITO ==========");
        }
    }
}