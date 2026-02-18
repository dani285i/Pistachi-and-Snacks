package com.tienda.repository;

import com.tienda.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IUsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByUsername(String username);
    Usuario findByEmail(String email);
}