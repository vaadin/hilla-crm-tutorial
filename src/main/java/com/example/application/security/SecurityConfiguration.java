package com.example.application.security;

import com.vaadin.flow.spring.security.VaadinWebSecurity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jose.jws.JwsAlgorithms;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@EnableWebSecurity
@Configuration
public class SecurityConfiguration extends VaadinWebSecurity {

  @Value("${app.secret}")
  private String appSecret;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    super.configure(http);
    setLoginView(http, "/login");
    http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    setStatelessAuthentication(http,
        new SecretKeySpec(Base64.getDecoder().decode(appSecret), JwsAlgorithms.HS256),
        "com.example.application");
  }

  @Bean
  public InMemoryUserDetailsManager userDetailsService() {
      // Configure users and roles in memory
      UserDetails user = User.withUsername("user").password("{noop}user")
              .roles("USER").build();
      return new InMemoryUserDetailsManager(user);
  }
}
