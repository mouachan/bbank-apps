package org.redhat.notation;

import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.admin.model.GetScenariosResult;
import com.github.tomakehurst.wiremock.stubbing.Scenario;
import com.github.tomakehurst.wiremock.stubbing.ServeEvent;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.RestAssured;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.redhat.bbank.model.Bilan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.containing;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.postRequestedFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.options;
import static io.restassured.RestAssured.given;

@QuarkusTest
public class CloudEventListenerTest {

    private static final Logger LOGGER = LoggerFactory.getLogger(CloudEventListenerTest.class);
    private static WireMockServer sink;

    static {
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
    }

    @BeforeAll
    public static void startSink() {
        sink = new WireMockServer(options().port(8181));
        sink.start();
        sink.stubFor(post("/").willReturn(aResponse().withBody("ok").withStatus(200)));
    }

    @AfterAll
    public static void stopSink() {
        if (sink != null) {
            sink.stop();
        }
    }


    @Test
    void checkStartNewProcessInstanceWithModel1() throws JsonProcessingException, InterruptedException {
        final ObjectMapper objectMapper = new ObjectMapper();
        final Bilan bilan = new Bilan();
        bilan.setSiren("423646512");
        bilan.setGg(5);
        bilan.setGa(2);
        bilan.setHp(1);
        bilan.setHq(2);
        bilan.setDl(50);
        bilan.setEe(2);
        given()
                .header("ce-specversion", "1.0")
                .header("ce-id", "000")
                .header("ce-source", "/from/localhost")
                .header("ce-type", "noteapplication")
                .contentType(MediaType.APPLICATION_JSON)
                .body(objectMapper.writeValueAsString(bilan)).post("/").then().statusCode(200);

        // have we received the message? We force the sleep since the WireMock framework doesn't support waiting/timeout verification
        LOGGER.info("Waiting 4 seconds to receive the produced message");
        Thread.sleep(4000);

        for(Scenario scenario : sink.getAllScenarios().getScenarios()){
            LOGGER.info("######"+scenario.getName());
        }
        for(ServeEvent serveevent : sink.getAllServeEvents()){
            LOGGER.info("#########"+serveevent.toString());
        }
        sink.verify(1, postRequestedFor(urlEqualTo("/")).withRequestBody(containing("MODELE_1")));
    }

   
}
