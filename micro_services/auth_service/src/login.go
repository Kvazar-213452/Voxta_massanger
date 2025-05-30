package src

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

func Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if request.ID == "" {
		http.Error(w, "ID is required", http.StatusBadRequest)
		return
	}

	var id string = request.ID

	currentTime := time.Now().Format(time.RFC3339)
	newLogin := []interface{}{id, currentTime}

	var logins [][]interface{}
	file, err := os.ReadFile("db.json")
	if err == nil {
		err = json.Unmarshal(file, &logins)
		if err != nil {
			http.Error(w, "Error reading database", http.StatusInternalServerError)
			return
		}
	}

	found := false
	for i, login := range logins {
		if len(login) >= 1 && login[0] == id {
			logins[i][1] = currentTime
			found = true
			break
		}
	}

	if !found {
		logins = append(logins, newLogin)
	}

	data, err := json.Marshal(logins)
	if err != nil {
		http.Error(w, "Error encoding data", http.StatusInternalServerError)
		return
	}

	err = os.WriteFile("db.json", data, 0644)
	if err != nil {
		http.Error(w, "Error writing to database", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintf(w, "Login recorded for user %s at %s", id, currentTime)
}
