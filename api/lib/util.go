package utils

import (
	"encoding/json"
	"io/ioutil"
	"net"
	"net/http"
	"runtime"
	"strings"
)

// Local network

type LocalIp struct {
	Device string
	Ip     string
}

func GetLocalIpAddrs() []LocalIp {
	interfaces, _ := net.Interfaces()
	var localIps []LocalIp
	wlanName := "wlan0"
	etherName := "eth0"
	ipv4Index := 0
	if runtime.GOOS == "windows" {
		wlanName = "Wi-Fi"
		etherName = "Ethernet"
		ipv4Index = 1
	}
	for _, inter := range interfaces {
		if inter.Name == etherName {
			addrs, _ := inter.Addrs()
			ip := strings.Split(addrs[ipv4Index].String(), "/")[0]
			localIps = append(localIps, LocalIp{Device: "Ethernet", Ip: ip})
		}
		if inter.Name == wlanName {
			addrs, _ := inter.Addrs()
			ip := strings.Split(addrs[ipv4Index].String(), "/")[0]
			localIps = append(localIps, LocalIp{Device: "Wi-Fi", Ip: ip})
		}
	}
	return localIps
}

// API utils

func ReadBody(r *http.Request, obj interface{}) error {
	bytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	err = json.Unmarshal(bytes, obj)
	if err != nil {
		return err
	}
	return nil
}
