package com.example.ecoville_app_S;


import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.Socket;
import java.net.SocketTimeoutException;
import java.util.Date;

public class tcpClient implements Runnable {

    public Date serverTime;

    public static final String SERVER_IP = "192.168.1.11"; //server IP address
    public static final int SERVER_PORT = 8052;
    // message to send to the server
    private String mServerMessage;
    // while this is true, the server will continue running
    private boolean mRun = false;
    // used to read messages from the server
    private BufferedReader mBufferIn;

    public tcpClient() { }


    /* HOW TO USE
            try {
                    tcpClient mTcpClient = new tcpClient();
                    Thread thread = new Thread(mTcpClient);
                    thread.start();
                    thread.join();
                    System.out.println("Login date: " + mTcpClient.serverTime);
                } catch (InterruptedException e) {

                    System.err.println("Tcp interrupted!!");
                }

                System.out.println("after tcp");
    */




    /**
     * Close the connection and release the members
     */
    public void stopClient() {

        mRun = false;

        mBufferIn = null;
        mServerMessage = null;
    }

    public void run() {

        mRun = true;

        try {
            //here you must put your computer's IP address.
            InetAddress serverAddr = InetAddress.getByName(SERVER_IP);

            System.out.println("TCP Client - Connecting...");

            //create a socket to make the connection with the server
            Socket socket = new Socket(serverAddr, SERVER_PORT);

            try {
                //receives the message which the server sends back
                mBufferIn = new BufferedReader(new InputStreamReader(socket.getInputStream()));


                //in this while the client listens for the messages sent by the server
                while (mRun) {
                    mServerMessage = mBufferIn.readLine();
                    if (mServerMessage != null) {
                        //call the method messageReceived from MyActivity class
                        System.out.println("RESPONSE FROM SERVER - Received Message: '" + mServerMessage + "'");
                        mRun = false;

                        serverTime = new Date(Long.parseLong(mServerMessage));
                    }
                }
                stopClient();
            }  catch (SocketTimeoutException exception) {
                // Output expected SocketTimeoutExceptions.
                serverTime = null;
                System.out.println("TCP - Error" + exception);
            }  catch (Exception e) {
                System.out.println("TCP - Error" + e);
            }finally {
                socket.close();
            }
        } catch (Exception e) {
            System.out.println("TCP - Error" + e);
        }

    }

}
