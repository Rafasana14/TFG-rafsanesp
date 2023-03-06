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

/**
 * @author japarejo
 */
//@Configuration
//@EnableWebSecurity
//public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
//
//	@Autowired
//	DataSource dataSource;
//
//	@Override
//	protected void configure(HttpSecurity http) throws Exception {
//		http.csrf().disable().authorizeRequests().anyRequest().permitAll();
//		http.csrf().ignoringAntMatchers("/h2-console/**","/api/v1/**");
//		http.headers().frameOptions().sameOrigin();
//	}
//
//	@Override
//	protected void configure(HttpSecurity http) throws Exception {
//		http.authorizeRequests().antMatchers("/resources/**", "/webjars/**", "/h2-console/**").permitAll()
//				.antMatchers(HttpMethod.GET, "/**", "/oups").permitAll()
//				.antMatchers("/users/new").permitAll()
//				.antMatchers("/session/**").permitAll()
//				.antMatchers("/admin/**").permitAll()
//				.antMatchers("/owners/**").permitAll()
//				.antMatchers("/vets/**").permitAll()
//				.antMatchers("/api/v1/**").authenticated()
//				.anyRequest().denyAll()
//				.and()
//					.formLogin()
//					/* .loginPage("/login") */
//					.failureUrl("/login-error")
//				.and()
//					.logout()
//					.logoutSuccessUrl("/");
//		// Configuración para que funcione la consola de administración
//		// de la BD H2 (deshabilitar las cabeceras de protección contra
//		// ataques de tipo csrf y habilitar los framesets si su contenido
//		// se sirve desde esta misma página.
//		http.csrf().ignoringAntMatchers("/h2-console/**", "/api/v1/**");
//		http.headers().frameOptions().sameOrigin();
//	}
//
//	@Override
//	public void configure(AuthenticationManagerBuilder auth) throws Exception {
//		auth.jdbcAuthentication().dataSource(dataSource)
//				.usersByUsernameQuery("select username,password,enabled " + "from users " + "where username = ?")
//				.authoritiesByUsernameQuery("select username, authority " + "from users " + "where username = ?")
//				.passwordEncoder(passwordEncoder());
//	}
//
//	@Bean
//	public PasswordEncoder passwordEncoder() {
//		PasswordEncoder encoder = NoOpPasswordEncoder.getInstance();
//		return encoder;
//	}

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

    @Bean
    AuthTokenFilter authenticationJwtTokenFilter() {
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
    PasswordEncoder passwordEncoder() {
        PasswordEncoder encoder = NoOpPasswordEncoder.getInstance();
        return encoder;
//			return new BCryptPasswordEncoder();
    }

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors().and().csrf().disable().exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().authorizeRequests()
				.antMatchers("/resources/**", "/webjars/**", "/h2-console/**", "/static/**", "/swagger-resources/**").permitAll()
				.antMatchers(HttpMethod.GET, "/", "/oups").permitAll()
				.antMatchers("/api/v1/auth/**").permitAll().antMatchers("/v2/api-docs").permitAll()
				.antMatchers("/swagger-ui.html/**").permitAll()
				.antMatchers("/api/v1/plan").hasAuthority("OWNER")
				.antMatchers("/api/v1/users/**").hasAuthority("ADMIN")
				.antMatchers("/api/v1/owners/**/pets/**").authenticated()
				.antMatchers("/api/v1/owners/**").hasAuthority("ADMIN")
//				.antMatchers("/api/v1/pets/**").hasAuthority("ADMIN")
				.antMatchers(HttpMethod.GET,"/api/v1/vets/**").authenticated()
				.antMatchers("/api/v1/vets/**").hasAnyAuthority("ADMIN","VET")
				// .antMatchers("/api/v1/**").authenticated();

				.anyRequest().authenticated();

		http.headers().frameOptions().sameOrigin();
		http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
//			http.addFilterAfter(new SpaWebFilter(), UsernamePasswordAuthenticationFilter.class);
	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring()
				// .antMatchers("/index.html")
				.antMatchers("/static/**").antMatchers("/error").antMatchers("/swagger-ui.html")
				.antMatchers("/swagger-resources/**");
	}

//		public void addResourceHandlers(ResourceHandlerRegistry registry) {
//			registry.addResourceHandler("swagger-ui.html").addResourceLocations("classpath:/META-INF/resources/");
//
//			registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
//		}

}
