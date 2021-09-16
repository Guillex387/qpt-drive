package drive

import (
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
)

// Public

/*
	Error codes:
		0 none error
		1 the item doesn't exists
		2 the item already exists
		7 the item hasn't a valid name
*/

func UploadFile(path string, content []byte, override bool) int {
	absPath := formatPath(path, true)
	name := filepath.Base(absPath)
	if !validateName(name) {
		return 7
	}
	_, fileErr := os.Stat(absPath)
	exists := true
	if os.IsNotExist(fileErr) {
		exists = false
	}
	if exists && !override {
		return 2
	}
	file, _ := os.Create(absPath)
	file.Write(content)
	file.Close()
	return 0
}

func Mkdir(path string) int {
	dirPath := formatPath(path, true)
	name := filepath.Base(dirPath)
	if !validateName(name) {
		return 7
	}
	_, dirErr := os.Stat(dirPath)
	if os.IsExist(dirErr) {
		return 2
	}
	os.Mkdir(dirPath, os.ModeDir)
	return 0
}

func GetType(path string) string {
	absPath := formatPath(path, true)
	stats, err := os.Stat(absPath)
	if err != nil {
		return ""
	}
	if stats.IsDir() {
		return "folder"
	}
	return "file"
}

type SystemItem struct {
	Type string `json:"type"`
	Size int    `json:"size"`
	Name string `json:"name"`
}

type DirContent struct {
	Origin string       `json:"originPath"`
	Childs []SystemItem `json:"childs"`
}

func GetDirContent(path string, displayPath string) (DirContent, int) {
	dirPath := formatPath(path, true)
	contents, err := ioutil.ReadDir(dirPath)
	if err != nil {
		return DirContent{}, 1
	}
	var items []SystemItem
	for _, item := range contents {
		itemType := "file"
		if item.IsDir() {
			itemType = "folder"
		}
		items = append(items, SystemItem{
			Type: itemType,
			Size: int(item.Size()),
			Name: item.Name(),
		})
	}
	return DirContent{
		Origin: displayPath,
		Childs: items,
	}, 0
}

func GetFileContent(path string) ([]byte, int) {
	filePath := formatPath(path, true)
	content, err := ioutil.ReadFile(filePath)
	if err != nil {
		return nil, 1
	}
	return content, 0
}

func Rename(path string, newName string) int {
	oldPath := formatPath(path, true)
	if !validateName(newName) {
		return 7
	}
	newPath := filepath.Join(filepath.Dir(oldPath), newName)
	err := os.Rename(oldPath, newPath)
	if err != nil {
		return 1
	}
	return 0
}

func Remove(path string, sysType string) int {
	absPath := formatPath(path, true)
	if sysType == "" {
		return 1
	} else if sysType == "file" {
		err := os.Remove(absPath)
		if err != nil {
			return 1
		}
	} else {
		err := os.RemoveAll(absPath)
		if err != nil {
			return 1
		}
	}
	return 0
}

// Private

func uploadPath() string {
	exec, err := os.Executable()
	if err != nil {
		return ""
	}
	pathStr := filepath.Join(filepath.Dir(exec), "uploads")
	_, dirErr := os.Stat(pathStr)
	if os.IsNotExist(dirErr) {
		os.Mkdir(pathStr, os.ModeDir)
	}
	return pathStr
}

func formatPath(p string, absolute bool) string {
	splitted := strings.Split(p, "/")
	formatted := filepath.Join(splitted...)
	listedWin := strings.Split(formatted, "\\")
	listedUnix := strings.Split(formatted, "/")
	if listedWin[0] == ".." || listedUnix[0] == ".." {
		formatted = "."
	}
	if absolute {
		return filepath.Join(uploadPath(), formatted)
	}
	return formatted
}

func validateName(name string) bool {
	const badSymbols = "/\\\"':*?<>|"
	for _, symbol := range badSymbols {
		if strings.Contains(name, string(symbol)) {
			return false
		}
	}
	return true
}
