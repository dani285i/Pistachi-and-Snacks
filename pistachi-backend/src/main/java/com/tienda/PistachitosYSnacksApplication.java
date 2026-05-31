package com.tienda;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class PistachitosYSnacksApplication {

	public static void main(String[] args) {
		SpringApplication.run(PistachitosYSnacksApplication.class, args);
	}

    @Bean
    public CommandLineRunner fixOldOrderStates(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("UPDATE pedido SET estado = 'EN_PROCESO' WHERE estado NOT IN ('CANCELADO', 'EN_PROCESO', 'EN_TRANSITO', 'ENTREGADO')");
                System.out.println("✅ Se han arreglado los estados antiguos de los pedidos en la base de datos.");
            } catch (Exception e) {
                System.out.println("⚠️ No se pudo actualizar los estados antiguos de los pedidos: " + e.getMessage());
            }
        };
    }

    @Bean
    public CommandLineRunner migrateImagesToWebp(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("UPDATE producto SET imagen = REPLACE(imagen, '.png', '.webp') WHERE imagen LIKE '%.png'");
                System.out.println("✅ IMÁGENES ACTUALIZADAS EN LA BASE DE DATOS A .WEBP");
            } catch (Exception e) {
                System.out.println("⚠️ No se pudo actualizar las imágenes: " + e.getMessage());
            }
        };
    }

}
