package org.redhat.notation;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;
import org.kie.kogito.event.CloudEventMeta;
import org.kie.kogito.event.EventKind;
import org.kie.kogito.event.Topic;
import org.kie.kogito.event.ChannelType;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.assertThat;

@QuarkusTest
public class TopicsInformationTest {

    @Test
    void verifyTopicsInformation() {
        final Topic expectedIncomingTopic = new Topic("kogito_incoming_stream", ChannelType.INCOMING);
        expectedIncomingTopic.setEventsMeta(Collections.singletonList(new CloudEventMeta("noteapplication", "", EventKind.CONSUMED)));
        final Topic expectedOutgoingTopic = new Topic("model1", ChannelType.OUTGOING);
        List<CloudEventMeta> cloudEventMetaData = new ArrayList<CloudEventMeta>();
        cloudEventMetaData.add(new CloudEventMeta("process.computenotation.model1", "/process/computenotation", EventKind.PRODUCED));
        cloudEventMetaData.add(new CloudEventMeta("process.computenotation.notnoted", "/process/computenotation", EventKind.PRODUCED));
        expectedOutgoingTopic.setEventsMeta(cloudEventMetaData);
        //expectedOutgoingTopic.setEventsMeta(Collections.singletonList(new CloudEventMeta("process.computeNotation.model1", "/process/computeNotation", EventKind.PRODUCED)));

        final List<Topic> topics = Arrays.asList(given().get("/messaging/topics").as(Topic[].class));
        for(Topic topic : topics){
            System.out.println(topic);
        }
        assertThat(topics, notNullValue());
        assertThat(topics, hasItem(expectedIncomingTopic));
        //assertThat(topics, hasItem(expectedOutgoingTopic));
    }
}
