package com.tienda.web.controller;

import com.tienda.model.CodigoPostal;
import com.tienda.repository.CodigoPostalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/codigos-postales")
@CrossOrigin(origins = "http://localhost:5173")
public class CodigoPostalController {

    @Autowired
    private CodigoPostalRepository codigoPostalRepository;

    @GetMapping
    public List<CodigoPostal> getByConcello(@RequestParam String concello) {
        return codigoPostalRepository.findByConcello(concello);
    }
}
