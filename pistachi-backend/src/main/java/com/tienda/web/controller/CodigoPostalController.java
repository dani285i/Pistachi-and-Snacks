package com.tienda.web.controller;

import com.tienda.model.CodigoPostal;
import com.tienda.repository.CodigoPostalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.tienda.model.Concello;

@RestController
@RequestMapping("/codigos-postales")
@CrossOrigin(origins = "http://localhost:5173")
public class CodigoPostalController {

    @Autowired
    private CodigoPostalRepository codigoPostalRepository;

    @GetMapping
    public List<CodigoPostal> getByConcello(@RequestParam Concello concello) {
        return codigoPostalRepository.findByConcello(concello);
    }
}
