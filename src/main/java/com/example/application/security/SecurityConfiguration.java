package com.example.application.security;

import java.util.Base64;

import javax.crypto.spec.SecretKeySpec;

import com.vaadin.flow.spring.security.VaadinWebSecurity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.jose.jws.JwsAlgorithms;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;

@EnableWebSecurity
@Configuration
public class SecurityConfiguration extends VaadinWebSecurity {

  @Value("${app.secret}")
  private String appSecret;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    super.configure(http);
    setLoginView(http, "/login");
    http.sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    setStatelessAuthentication(http,
        new SecretKeySpec(Base64.getDecoder().decode(appSecret), JwsAlgorithms.HS256),
        "com.example.application");
  }

  @Bean
  public UserDetailsManager userDetailsService() {
    return new InMemoryUserDetailsManager(
        // the {noop} prefix tells Spring that the password is not encoded
        User.withUsername("user").password("{noop}password").roles("USER").build());
  }

}