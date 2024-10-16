import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

/**
 * A local web server that can be linked to Cloudflare tunnel
 * to receive and handle requests to search pi.
 */
public class WebServer {
    public static void start() throws IOException
    {
        System.out.println("Webserver starting...");
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);
        server.createContext("/search", new SearchHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("Webserver started on port 8000");
    }

    private static class SearchHandler implements HttpHandler
    {
        @Override
        public void handle(HttpExchange htex)
        {
            try {
                Map<String, String> fields = splitQuery(htex.getRequestURI().getQuery());
                if (fields.containsKey("data")) {
                    String response;
                    String searchString = fields.get("data");

                    System.out.println(new Date() + ": " + searchString);
                    if (searchString.length() > 1000) {
                        response = "That's too long!";
                    } else {
                        int index = PiSearcher.indexOf(searchString.toCharArray());
                        if (index == -1) response = "It is not found in the first billion digits.";
                        else response = PiSearcher.generateOutput(index, searchString.length());
                    }

                    htex.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                    htex.getResponseHeaders().add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
                    htex.getResponseHeaders().add("Access-Control-Allow-Credentials", "true");
                    htex.getResponseHeaders().add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,HEAD");

                    htex.sendResponseHeaders(200, response.length());
                    OutputStream os = htex.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                } else {
                    htex.sendResponseHeaders(400, 0);
                    OutputStream os = htex.getResponseBody();
                    os.write(0);
                    os.close();
                }
            } catch (IOException error) {
                error.printStackTrace();
            }
        }
    }

    private static Map<String, String> splitQuery(String query)
    {
        Map<String, String> query_pairs = new LinkedHashMap<>();
        try {
            String[] pairs = query.split("&");
            for (String pair : pairs) {
                int idx = pair.indexOf("=");
                query_pairs.put(URLDecoder.decode(pair.substring(0, idx), StandardCharsets.UTF_8), URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8));
            }
        } catch (Exception ignored) {}
        return query_pairs;
    }
}
