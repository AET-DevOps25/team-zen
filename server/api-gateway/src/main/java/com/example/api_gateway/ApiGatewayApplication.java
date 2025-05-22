package com.example.api_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// import io.netty.resolver.DefaultAddressResolverGroup;
// import reactor.netty.http.client.HttpClient;

@SpringBootApplication
@Controller
public class ApiGatewayApplication {

    
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    // @Bean
    // public HttpClient httpClient() {
    //     return HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);
    // }

    // @GetMapping("/home")
    // public String home() {
    //     return "home";
    // }

}
