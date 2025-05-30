package main

import (
	"auth_service/src"
	"fmt"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	http.HandleFunc("/login", src.Login)
	http.HandleFunc("/login_check", src.Login_check)
	http.HandleFunc("/log_out", src.Log_out)

	fmt.Println("Auth service started on :" + os.Getenv("AUTH_SERVICE"))
	http.ListenAndServe(":"+os.Getenv("AUTH_SERVICE"), nil)
}
