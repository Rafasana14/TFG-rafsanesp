package org.springframework.samples.petclinic.auth;

import java.util.Optional;


@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
	Optional<RefreshToken> findByToken(String token);

	@Modifying
	int deleteByUser(User user);
}
