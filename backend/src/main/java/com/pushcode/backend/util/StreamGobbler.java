package com.pushcode.backend.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;


public class StreamGobbler implements Runnable {

    private static final Logger log = LoggerFactory.getLogger(StreamGobbler.class);

    private final InputStream inputStream;
    private final WebSocketSession session;

    public StreamGobbler(InputStream inputStream, WebSocketSession session) {
        this.inputStream = inputStream;
        this.session = session;
    }

    @Override
    public void run() {
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(inputStream))) {

            char[] buffer = new char[1024];
            int len;

            while ((len = br.read(buffer)) != -1) {

                if (!session.isOpen()) {
                    log.warn("WebSocket session closed. Stopping gobbler.");
                    break;
                }

                synchronized (session) {
                    session.sendMessage(
                            new TextMessage(new String(buffer, 0, len))
                    );
                }
            }

        } catch (IOException e) {
            log.error("Stream error: {}", e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error in StreamGobbler", e);
        } finally {
            try {
                if (session.isOpen()) {
                    synchronized (session) {
                        session.sendMessage(new TextMessage("\n[Process finished]\n"));
                    }
                }
            } catch (Exception ignored) {}

            log.debug("StreamGobbler thread finished.");
        }
    }
}