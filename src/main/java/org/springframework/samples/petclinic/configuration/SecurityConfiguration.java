package org.springframework.samples.petclinic.configuration;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.samples.petclinic.configuration.jwt.AuthEntryPointJwt;
import org.springframework.samples.petclinic.configuration.jwt.AuthTokenFilter;
import org.springframework.samples.petclinic.configuration.services.UserDetailsServiceImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

@SuppressWarnings("deprecation")
@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

	@Autowired
	UserDetailsServiceImpl userDetailsService;

	@Autowired
	private AuthEntryPointJwt unauthorizedHandler;

	@Autowired
	DataSource dataSource;

	private static final String ADMIN = "ADMIN";

	@Bean
	public AuthTokenFilter authenticationJwtTokenFilter() {
		return new AuthTokenFilter();
	}

	@Override
	public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
		authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
	}

	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {	    
		return NoOpPasswordEncoder.getInstance();
	    //BCryptPasswordEncoder not included because it caused errors
	}


	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors().and().csrf().disable().exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().authorizeRequests()
				.antMatchers("/resources/**", "/webjars/**", "/h2-console/**", "/static/**", "/swagger-resources/**")
				.permitAll().antMatchers(HttpMethod.GET, "/", "/oups").permitAll().antMatchers("/api/v1/auth/**")
				.permitAll().antMatchers("/v2/api-docs").permitAll().antMatchers("/swagger-ui.html/**").permitAll()
				.antMatchers("/api/v1/plan").hasAuthority("OWNER").antMatchers("/api/v1/owners/profile")
				.hasAuthority("OWNER").antMatchers("/api/v1/users/**").hasAuthority(ADMIN)
				.antMatchers(HttpMethod.DELETE, "/api/v1/consultations/{consultationId:[0-9]\\d+}").hasAuthority(ADMIN)
				.antMatchers(HttpMethod.GET, "/api/v1/owners/**").hasAnyAuthority("ADMIN", "VET")
				.antMatchers("/api/v1/owners/**/pets/**").authenticated().antMatchers("/api/v1/owners/**")
				.hasAuthority(ADMIN).antMatchers(HttpMethod.GET, "/api/v1/pets/stats").hasAuthority(ADMIN)
				.antMatchers(HttpMethod.GET, "/api/v1/vets/stats").hasAuthority(ADMIN)
				.antMatchers(HttpMethod.GET, "/api/v1/vets/**").authenticated().antMatchers("/api/v1/vets/**")
				.hasAnyAuthority(ADMIN, "VET")

				.anyRequest().authenticated();

		http.headers().frameOptions().sameOrigin();
		http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers("/static/**").antMatchers("/public/**").antMatchers("/error").antMatchers("/swagger-ui.html")
				.antMatchers("/swagger-resources/**");
	}

}
