package org.redhat.bbank.cloudevent;
import io.cloudevents.http.vertx.VertxMessageFactory;
import io.cloudevents.core.message.StructuredMessageReader;
import io.cloudevents.CloudEvent;
import io.vertx.core.AbstractVerticle;

public class CloudEventServerVerticle extends AbstractVerticle {

  public void start() {
    vertx.createHttpServer()
      .requestHandler(req -> {
        VertxMessageFactory.createReader(req)
          .onSuccess(messageReader -> {
            CloudEvent event = messageReader.toEvent();
            System.out.println(new String(event.getData().toBytes()));
            // Echo the message, as structured mode
            VertxMessageFactory
              .createWriter(req.response())
              .writeStructured(event, "application/cloudevents+json");
          })
          .onFailure(t -> req.response().setStatusCode(500).end());
      })
      .listen(8080)
      .onSuccess(server ->
        System.out.println("Server started on port " + server.actualPort())
      ).onFailure(t -> {
        System.out.println("Error starting the server");
      });
  }
}