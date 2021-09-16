package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	utils "qpt-drive-api/lib"
	"qpt-drive-api/lib/drive"
	"qpt-drive-api/lib/login"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

const Expiration = time.Hour * 16
const DefaultPort = 8000

// Handlers

/*
	Error codes:
		3 body format error
		6 invalid pass
*/

func UploadHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	file, fileHeader, err := r.FormFile("file")
	path := r.FormValue("path")
	fileSize := int(fileHeader.Size)
	if err != nil {
		w.WriteHeader(400)
		fmt.Fprint(w, "{\"error\":3}") // Body format error
	}
	content := make([]byte, fileSize)
	file.Read(content)
	override := false
	if r.Method == "PUT" {
		override = true
	}
	errCode := drive.UploadFile(path, content, override)
	httpStatus := 400
	if errCode == 0 {
		httpStatus = 201
		if override {
			httpStatus = 200
		}
	}
	w.WriteHeader(httpStatus)
	fmt.Fprintf(w, "{\"error\":%v}", errCode)
}

type MkdirBody struct {
	Path string `json:"path"`
}

func MkdirHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var reqBody MkdirBody
	err := utils.ReadBody(r, &reqBody)
	if err != nil || reqBody.Path == "" {
		w.WriteHeader(400)
		fmt.Fprint(w, "{\"error\":3}") // Body format error
		return
	}
	errCode := drive.Mkdir(reqBody.Path)
	httpStatus := 400
	if errCode == 0 {
		httpStatus = 201
	}
	w.WriteHeader(httpStatus)
	fmt.Fprintf(w, "{\"error\":%v}", errCode)
}

type RenameBody struct {
	Path    string `json:"path"`
	NewName string `json:"newName"`
}

func RenameHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var reqBody RenameBody
	err := utils.ReadBody(r, &reqBody)
	notValidNewName := strings.Contains(reqBody.NewName, "/") || strings.Contains(reqBody.NewName, "\\")
	if err != nil || reqBody.Path == "" || reqBody.NewName == "" || notValidNewName {
		w.WriteHeader(400)
		fmt.Fprint(w, "{\"error\":3}") // Body format error
		return
	}
	errCode := drive.Rename(reqBody.Path, reqBody.NewName)
	httpStatus := 400
	if errCode == 0 {
		httpStatus = 200
	}
	w.WriteHeader(httpStatus)
	fmt.Fprintf(w, "{\"error\":%v}", errCode)
}

func FilesHandler(w http.ResponseWriter, r *http.Request) {
	displayPath := strings.Join(strings.Split(r.URL.Path, "/")[4:], "/")
	pathStr := filepath.Join(strings.Split(r.URL.Path, "/")[4:]...)
	itemType := drive.GetType(pathStr)
	// DELETE handler
	if r.Method == "DELETE" {
		errCode := drive.Remove(pathStr, itemType)
		httpStatus := 404
		if errCode == 0 {
			httpStatus = 200
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(httpStatus)
		fmt.Fprintf(w, "{\"error\":%v}", errCode)
		return
	}
	// GET handler
	if itemType == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(404)
		fmt.Fprintf(w, "{\"error\":1}") // Item not found
		return
	} else if itemType == "file" {
		file, codeErr := drive.GetFileContent(pathStr)
		if codeErr != 0 {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(404)
			fmt.Fprintf(w, "{\"error\":%v}", codeErr)
			return
		}
		w.Write(file)
		return
	} else {
		items, codeErr := drive.GetDirContent(pathStr, displayPath)
		w.Header().Set("Content-Type", "application/json")
		if codeErr != 0 {
			w.WriteHeader(404)
			fmt.Fprintf(w, "{\"error\":%v}", codeErr)
			return
		}
		response, _ := json.Marshal(items)
		w.Write(response)
	}
}

type TokenResponse struct {
	Err   int    `json:"error"`
	Token string `json:"token"`
}

func GetTokenHandler(w http.ResponseWriter, r *http.Request) {
	passB64 := mux.Vars(r)["pass"]
	passB, _ := base64.StdEncoding.DecodeString(passB64)
	validPass := login.VerifyKey(string(passB))
	w.Header().Set("Content-Type", "application/json")
	if !validPass {
		response, _ := json.Marshal(TokenResponse{Err: 6, Token: ""})
		w.WriteHeader(401)
		w.Write(response)
	} else {
		usrToken := login.GenerateToken(time.Now().Add(Expiration))
		response, _ := json.Marshal(TokenResponse{Err: 0, Token: usrToken})
		w.Write(response)
	}
}

// Middlewares

func Auth(next func(http.ResponseWriter, *http.Request)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := mux.Vars(r)["token"]
		errorCode := login.VerifyToken(token)
		if errorCode != 0 {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(401)
			fmt.Fprintf(w, "{\"error\":%v}", errorCode)
			return
		}
		next(w, r)
	})
}

// Utils funcs

func runServer(handler http.Handler, port int) {
	portStr := ":" + strconv.Itoa(port)
	localIps := utils.GetLocalIpAddrs()
	fmt.Printf("Server running in:\n")
	for _, localIp := range localIps {
		fmt.Printf("http://%v%v %v\n", localIp.Ip, portStr, localIp.Device)
	}
	err := http.ListenAndServe(portStr, handler)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Server failed to start in port %v\n", port)
		os.Exit(1)
	}
}

func spaDir() string {
	exec, _ := os.Executable()
	return filepath.Join(filepath.Dir(exec), "app")
}

func serverPort() int {
	if len(os.Args) > 1 {
		num, err := strconv.Atoi(os.Args[1])
		if err == nil {
			return num
		}
	}
	return DefaultPort
}

func main() {
	router := mux.NewRouter()
	filesRouter := router.PathPrefix("/api").Subrouter()
	filesRouter.HandleFunc("/token/{pass}", GetTokenHandler).Methods("GET")
	filesRouter.Handle("/{token}/upload", Auth(UploadHandler)).Methods("POST", "PUT")
	filesRouter.Handle("/{token}/mkdir", Auth(MkdirHandler)).Methods("POST")
	filesRouter.Handle("/{token}/rename", Auth(RenameHandler)).Methods("PUT")
	filesRouter.PathPrefix("/{token}/path").Handler(Auth(FilesHandler)).Methods("GET", "DELETE")
	router.PathPrefix("/").Handler(http.FileServer(http.Dir(spaDir()))).Methods("GET")
	login.InitKey()
	runServer(cors.AllowAll().Handler(router), serverPort())
}
