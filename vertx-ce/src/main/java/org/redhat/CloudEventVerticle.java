import io.cloudevents.http.reactivex.vertx.VertxCloudEvents;
import io.vertx.core.http.HttpHeaders;
import io.vertx.reactivex.core.AbstractVerticle;

public class CloudEventVerticle extends AbstractVerticle {

  public void start() {

    vertx.createHttpServer()
      .requestHandler(req -> VertxCloudEvents.create().rxReadFromRequest(req)
      .subscribe((receivedEvent, throwable) -> {
        if (receivedEvent != null) {
          // I got a CloudEvent object:
          System.out.println("The event type: " + receivedEvent.getType())
        }
      }))
      .rxListen(8080)
      .subscribe(server -> {
        System.out.println("Server running!");
    });
  }
}