import java.io.IOException;

public class Main {
    public static void main(String[] args)
    {
        try {
            PiSearcher.loadPi();
            WebServer.start();
        } catch (IOException error) {
            error.printStackTrace();
        }
    }
}
