//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.springframework.http.MediaType;
//import org.springframework.stereotype.Service;
//import org.springframework.web.reactive.function.client.WebClient;
//import reactor.core.Disposable;
//import reactor.core.publisher.Flux;
//
//import javax.annotation.PostConstruct;
//import java.time.Duration;
//
//@Service
//public class SinricProDeviceListener {
//
//    private static final String API_KEY = "a614xxxx-xxxx-xxxx-xxxx-xxxxxxxx"; // Your SinricPro API Key
//    private static final String AUTH_URL = "https://api.sinric.pro/api/v1/auth";
//    private static final String SSE_BASE_URL = "https://portal.sinric.pro/sse/stream?accessToken=";
//
//    private final WebClient webClient;
//    private final ObjectMapper objectMapper = new ObjectMapper();
//    private Disposable eventSubscription;
//
//    private String accessToken;
//
//    public SinricProDeviceListener() {
//        this.webClient = WebClient.builder().build();
//    }
//
//    @PostConstruct
//    public void start() {
//        fetchAccessToken()
//                .doOnError(e -> System.err.println("Failed to fetch access token: " + e.getMessage()))
//                .retryBackoff(3, Duration.ofSeconds(5))
//                .subscribe(token -> {
//                    this.accessToken = token;
//                    System.out.println("Access token obtained. Starting SSE listener...");
//                    startSseListener();
//                });
//    }
//
//    private reactor.core.publisher.Mono<String> fetchAccessToken() {
//        return webClient.post()
//                .uri(AUTH_URL)
//                .header("x-sinric-api-key", API_KEY)
//                .retrieve()
//                .bodyToMono(String.class)
//                .map(response -> {
//                    try {
//                        JsonNode json = objectMapper.readTree(response);
//                        if (json.get("success").asBoolean()) {
//                            return json.get("accessToken").asText();
//                        } else {
//                            throw new RuntimeException("API key authentication failed");
//                        }
//                    } catch (Exception e) {
//                        throw new RuntimeException("Failed to parse auth response", e);
//                    }
//                });
//    }
//
//    private void startSseListener() {
//        String sseUrl = SSE_BASE_URL + accessToken;
//
//        Flux<String> eventStream = webClient.get()
//                .uri(sseUrl)
//                .accept(MediaType.TEXT_EVENT_STREAM)
//                .retrieve()
//                .bodyToFlux(String.class);
//
//        eventSubscription = eventStream.subscribe(this::handleEvent, this::handleError, () -> {
//            System.out.println("SSE stream completed");
//            // Optionally restart SSE listener here
//        });
//    }
//
//    private void handleEvent(String eventLine) {
//        try {
//            if (eventLine == null || eventLine.isEmpty()) return;
//            if (eventLine.startsWith("data: ")) {
//                String jsonStr = eventLine.substring(6).trim();
//                JsonNode eventJson = objectMapper.readTree(jsonStr);
//                System.out.println("Received event: " + eventJson.toPrettyString());
//
//                String eventType = eventJson.has("event") ? eventJson.get("event").asText() : "unknown";
//
//                switch (eventType) {
//                    case "deviceConnected":
//                        System.out.println("Device connected: " + eventJson.get("device"));
//                        break;
//                    case "deviceDisconnected":
//                        System.out.println("Device disconnected: " + eventJson.get("device"));
//                        break;
//                    case "deviceMessageArrived":
//                        System.out.println("Device message: " + eventJson.get("device"));
//                        // TODO: Add your logic here to handle device state changes
//                        break;
//                    default:
//                        System.out.println("Other event: " + jsonStr);
//                }
//            }
//        } catch (Exception e) {
//            System.err.println("Failed to parse SSE event: " + e.getMessage());
//        }
//    }
//
//    private void handleError(Throwable throwable) {
//        System.err.println("Error in SSE stream: " + throwable.getMessage());
//        // TODO: Consider implementing reconnect logic here or notify
//    }
//
//    // Call this method on app shutdown if needed
//    public void stop() {
//        if (eventSubscription != null && !eventSubscription.isDisposed()) {
//            eventSubscription.dispose();
//        }
//    }
//}
