package org.springframework.samples.petclinic.configuration;

import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

    @Bean
    Docket apiDocket() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("org.springframework.samples.petclinic"))
                .paths(PathSelectors.any())
                .build()
                .apiInfo(getApiInfo());
    }
	
	private ApiInfo getApiInfo() {
		return new ApiInfo(
				"PetClinic API",
				"API for PetClinic application",
				"1.0",
				"http://localhost:8080",
				new Contact("Petclinic", "http://localhost:8080", "rafasana9@gmail.com"), 
				"LICENSE", 
				"LICENSE URL", 
				Collections.emptyList());
	}
}
