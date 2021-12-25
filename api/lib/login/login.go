package login

import (
	"crypto/sha256"
	"encoding/hex"
	"io/ioutil"
	"math/rand"
	"os"
	"path/filepath"
	"time"
)

const layout = time.RFC1123

// Public

/*
	Error codes:
		0 valid token
		4 invalid token
		5 expired token
*/

func GenerateToken(date time.Time) string {
	timeStr := date.Format(layout)
	hash := sha256.Sum256([]byte(timeStr + ServerKey()))
	usrToken := append(hash[:], []byte(timeStr)...)
	hexStr := hex.EncodeToString(usrToken)
	return hexStr
}

func VerifyKey(key string) bool {
	return key == ServerKey()
}

func VerifyToken(usrToken string) int {
	bytes, err := hex.DecodeString(usrToken)
	if err != nil {
		return 4
	}
	expirationStr := string(bytes[32:])
	expirationTime, _ := time.Parse(layout, expirationStr)
	correctHash := GenerateToken(expirationTime)
	expired := time.Now().After(expirationTime)
	validHash := usrToken == correctHash
	if expired {
		return 5
	} else if !validHash {
		return 4
	}
	return 0
}

func ServerKey() string {
	defaultKey := generateKey()
	exec, _ := os.Executable()
	execDir := filepath.Dir(exec)
	keyFile := filepath.Join(execDir, "server.key")
	_, fileInfo := os.Stat(keyFile)
	if os.IsNotExist(fileInfo) {
		return SetServerKey(defaultKey)
	}
	bytes, _ := ioutil.ReadFile(keyFile)
	return string(bytes)
}

func SetServerKey(key string) string {
	exec, _ := os.Executable()
	execDir := filepath.Dir(exec)
	keyFile := filepath.Join(execDir, "server.key")
	file, _ := os.Create(keyFile)
	file.WriteString(key)
	file.Close()
	return key
}

// Private

func generateKey() string {
	const minLen = 8
	const maxLen = 16
	const seed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#%"
	rand.Seed(time.Now().UnixNano())
	randLen := rand.Intn(maxLen-minLen) + minLen
	randPass := ""
	for i := 0; i < randLen; i++ {
		randCharI := rand.Intn(len(seed))
		randPass += string(seed[randCharI])
	}
	return randPass
}
