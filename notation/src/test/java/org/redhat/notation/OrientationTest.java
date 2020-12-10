package org.redhat.notation;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.equalTo;



@QuarkusTest
public class OrientationTest {

     

     @Test
     public void testModelNonNote() {
 
         /**
          *  Score Global  0
          *  strfin_36 = 25 (dl = 50, ee = 200)
          * rentab_13 = 10 (gg = 5, ga = 4, hp = 3, hq =1)
          * */
 
        String body = "{\"CodeNaf\":\"510662190\",\"Variables\": [{ \"valeur\":10,\"type\": \"rentab_13\"},{\"valeur\":25,\"type\": \"strfin_36\"}],\"rules\":[]}}";
       given()
                .body(body)
                .contentType(ContentType.JSON)
           .when()
                .post("/Orientation")
                .then()
           .assertThat()
              .statusCode(200)
             .body("Notation.DecoupageSectoriel", is(0))
             .body("Notation.TypeAiguillage", is("NON_NOTE"));
     }

  /**
   * Model_1
   */
    @Test
    public void testModelOneNoteA() {

       String body_calcul_variables = "{\"bilan\": { \"gg\": 5, \"ga\": 2, \"hp\": 1, \"hq\": 2, \"dl\": 50, \"ee\": 2 }}"; 

       given()
               .body(body_calcul_variables)
               .contentType(ContentType.JSON)
          .when()
               .post("/calcul_variables")
               .then()
          .assertThat()
             .statusCode(200)
            .body("rentab_13",is(10))
            .body("strfin_36",is(25.0f));

       String body_orientation = "{\"CodeNaf\":\"423646512\",\"Variables\": [{ \"valeur\":10,\"type\": \"rentab_13\"},{\"valeur\":25,\"type\": \"strfin_36\"}],\"rules\":[]}}";
      given()
               .body(body_orientation)
               .contentType(ContentType.JSON)
          .when()
               .post("/Orientation")
               .then()
          .assertThat()
             .statusCode(200)
            .body("Notation.Score",is(0))
            .body("Notation.DecoupageSectoriel", is(1))
            .body("Notation.Note",is("A"))
            .body("Notation.TypeAiguillage", is("MODELE_1"));
    }
   // {"Variables":[{"valeur":10,"type":"rentab_13"},{"valeur":25,"type":"strfin_36"}],"ContrePartie":{"DecoupageSectoriel":1,"TypeAiguillage":"MODELE_1"},"ScoreFinal":[[0,{"valeur":10,"type":"rentab_13"}],[0,{"valeur":25,"type":"strfin_36"}]],"Score":"function Score( Var, CP )","rules":[],"Notation":{"Score":0,"DecoupageSectoriel":1,"Note":"A","TypeAiguillage":"MODELE_1","Orientation":"Favorable","Detail":[[0,{"valeur":10,"type":"rentab_13"}],[0,{"valeur":25,"type":"strfin_36"}]]},"CodeNaf":"1012Z"}

   @Test
   public void testModelOneNoteB() {

     String body_calcul_variables = "{\"bilan\": { \"gg\": 5, \"ga\": 2, \"hp\": 2, \"hq\": 0, \"dl\": 50, \"ee\": 2 }}"; 

     given()
             .body(body_calcul_variables)
             .contentType(ContentType.JSON)
        .when()
             .post("/calcul_variables")
             .then()
        .assertThat()
           .statusCode(200)
          .body("rentab_13",is(9))
          .body("strfin_36",is(25.0f));

      String body = "{\"CodeNaf\":\"423646512\",\"Variables\": [{ \"valeur\":9,\"type\": \"rentab_13\"},{\"valeur\":25,\"type\": \"strfin_36\"}],\"rules\":[]}}";
     given()
              .body(body)
              .contentType(ContentType.JSON)
         .when()
              .post("/Orientation")
              .then()
         .assertThat()
            .statusCode(200)
           .body("Notation.Score", equalTo(0.26f))
           .body("Notation.DecoupageSectoriel", is(1))
           .body("Notation.Note",is("B"))
           .body("Notation.TypeAiguillage", is("MODELE_1"));
   }
  

  @Test
  public void testModelOneNoteD() {

     String body_calcul_variables = "{\"bilan\": { \"gg\": 5, \"ga\": 2, \"hp\": 0, \"hq\": 2, \"dl\": 16, \"ee\": 4 }}"; 

     given()
             .body(body_calcul_variables)
             .contentType(ContentType.JSON)
        .when()
             .post("/calcul_variables")
             .then()
        .assertThat()
           .statusCode(200)
          .body("rentab_13",is(9))
          .body("strfin_36",is(4.0f));

     String body = "{\"CodeNaf\":\"423646512\",\"Variables\": [{ \"valeur\":9,\"type\": \"rentab_13\"},{\"valeur\":4,\"type\": \"strfin_36\"}],\"rules\":[]}}";
    given()
             .body(body)
             .contentType(ContentType.JSON)
        .when()
             .post("/Orientation")
             .then()
        .assertThat()
           .statusCode(200)
          .body("Notation.Score", equalTo(1.05f))
          .body("Notation.DecoupageSectoriel", is(1))
          .body("Notation.Note",is("D"))
          .body("Notation.TypeAiguillage", is("MODELE_1"));
  }





  /**
   * Model_2
   */
  @Test
  public void testModelTwoNoteA() {

      String body_calcul_variables = "{\"bilan\": { \"hn\": -52, \"ga\": 2, \"fl\": 3, \"fm\": 7, \"dl\": 24, \"ee\": 2 }}"; 

       given()
               .body(body_calcul_variables)
               .contentType(ContentType.JSON)
          .when()
               .post("/calcul_variables")
               .then()
          .assertThat()
             .statusCode(200)
            .body("rentab_38",is(-5))
            .body("strfin_36",is(12.0f));

     String body = "{\"CodeNaf\":\"542107651\",\"Variables\": [{ \"valeur\":-5,\"type\": \"rentab_38\"},{\"valeur\":12,\"type\": \"strfin_36\"}],\"rules\":[]}}";
    given()
             .body(body)
             .contentType(ContentType.JSON)
        .when()
             .post("/Orientation")
             .then()
        .assertThat()
           .statusCode(200)
          .body("Notation.Score",is(0.1f))
          .body("Notation.DecoupageSectoriel", is(2))
          .body("Notation.Note",is("A"))
          .body("Notation.Orientation",is("Favorable"))
          .body("Notation.TypeAiguillage", is("MODELE_2"));
  }

 @Test
 public void testModelTwoNoteB() {

     String body_calcul_variables = "{\"bilan\": { \"hn\": -2, \"ga\": -8, \"fl\": 8, \"fm\": -6, \"dl\": 24, \"ee\": 2 }}"; 

     given()
             .body(body_calcul_variables)
             .contentType(ContentType.JSON)
        .when()
             .post("/calcul_variables")
             .then()
        .assertThat()
           .statusCode(200)
          .body("rentab_38",is(-5))
          .body("strfin_36",is(12.0f));
    String body = "{\"CodeNaf\":\"542107651\",\"Variables\": [{ \"valeur\":-10,\"type\": \"rentab_38\"},{\"valeur\":12,\"type\": \"strfin_36\"}],\"rules\":[]}}";
   given()
            .body(body)
            .contentType(ContentType.JSON)
       .when()
            .post("/Orientation")
            .then()
       .assertThat()
          .statusCode(200)
         .body("Notation.Score", equalTo(0.34f))
         .body("Notation.DecoupageSectoriel", is(2))
         .body("Notation.Note",is("B"))
         .body("Notation.TypeAiguillage", is("MODELE_2"));
 }


@Test
public void testModelTwoNoteC() {

     String body_calcul_variables = "{\"bilan\": { \"hn\": -6, \"ga\": -9, \"fl\": 3, \"fm\": 0, \"dl\": 76, \"ee\": 76 }}"; 

     given()
             .body(body_calcul_variables)
             .contentType(ContentType.JSON)
        .when()
             .post("/calcul_variables")
             .then()
        .assertThat()
           .statusCode(200)
          .body("rentab_38",is(-5))
          .body("strfin_36",is(1.0f));

   String body = "{\"CodeNaf\":\"542107651\",\"Variables\": [{ \"valeur\":-11,\"type\": \"rentab_38\"},{\"valeur\":1,\"type\": \"strfin_36\"}],\"rules\":[]}}";
  given()
           .body(body)
           .contentType(ContentType.JSON)
      .when()
           .post("/Orientation")
           .then()
      .assertThat()
         .statusCode(200)
        .body("Notation.Score", equalTo(1.62f))
        .body("Notation.DecoupageSectoriel", is(2))
        .body("Notation.Note",is("D"))
        .body("Notation.TypeAiguillage", is("MODELE_2"));
}

 }