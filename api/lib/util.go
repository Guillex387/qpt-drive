package utils

import (
	"encoding/json"
	"io"
	"net"
	"net/http"
)

// Local network

func GetLocalIp() string {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		return ""
	}
	defer conn.Close()
	localAddr := conn.LocalAddr().(*net.UDPAddr)
	return localAddr.IP.String()
}

// API utils

func ReadBody(r *http.Request, obj interface{}) error {
	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		return err
	}
	err = json.Unmarshal(bytes, obj)
	if err != nil {
		return err
	}
	return nil
}
