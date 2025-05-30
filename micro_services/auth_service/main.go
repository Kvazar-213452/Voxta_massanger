package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte("secret_key") // Секретний ключ, має бути у змінних оточення

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func generateJWT(username string) (string, error) {
	expirationTime := time.Now().Add(15 * time.Minute)
	claims := &Claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "auth-service",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Тут має бути перевірка логіну і пароля (наприклад, з БД)
	if creds.Username != "admin" || creds.Password != "password" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	tokenString, err := generateJWT(creds.Username)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Віддаємо токен у відповіді
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"token": tokenString,
	})
}

func main() {
	http.HandleFunc("/login", loginHandler)

	log.Println("Auth service started on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
