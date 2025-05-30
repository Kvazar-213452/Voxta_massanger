package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func loginHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"token": "1",
	})
}

func main() {
	http.HandleFunc("/login", loginHandler)

	log.Println("Auth service started on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
