package org.redhat.mongodb;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import org.jboss.logging.Logger;

@QuarkusTest
public class NotationResourceTest {

  private static final Logger LOGGER = Logger.getLogger("NotationResourceTest");
    @Test
    public void testFindBySiren542107651() {
      LOGGER.info("Test FindBySiren542107651 ");
        given()
          .when().get("/notation/search/first/542107651")
          .then()
             .statusCode(200)
             .body("note",is("D"));
    }
}