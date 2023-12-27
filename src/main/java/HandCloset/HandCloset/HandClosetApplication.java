package HandCloset.HandCloset;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class HandClosetApplication {

	public static void main(String[] args) {
		SpringApplication.run(HandClosetApplication.class, args);
	}

}
