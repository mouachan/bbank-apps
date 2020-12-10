package org.redhat.mongodb;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import org.jboss.logging.Logger;

@QuarkusTest
public class CompaniesResourceTest {

  private static final Logger LOGGER = Logger.getLogger("CompaniesResourceTest");
    @Test
    public void testFindBySiren542107651() {
      LOGGER.info("Test FindBySiren542107651 ");
        given()
          .when().get("/companies/search/542107651")
          .then()
             .statusCode(200)
             .body("denomination",is("ENGIE"));
    }

    @Test
    public void testFindBySiren423646512() {
      LOGGER.info("testFindBySiren423646512");
        given()
          .when().get("/companies/search/423646512")
          .then()
             .statusCode(200)
             .body("denomination",is("FOURNIL SAINT JACQUES"));
    }

    @Test
    public void testFindBySiren510662190() {
      LOGGER.info("testFindBySiren510662190");
        given()
          .when().get("/companies/search/510662190")
          .then()
             .statusCode(200)
             .body("denomination",is("ASHILEA"));
    }
    @Test
    public void testInsertCompany(){
      LOGGER.info("test add company");
    }

}