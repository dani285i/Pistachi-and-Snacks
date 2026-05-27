package com.tienda.repository;

import com.tienda.model.CodigoPostal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodigoPostalRepository extends JpaRepository<CodigoPostal, Long> {
    List<CodigoPostal> findByConcello(String concello);
}
