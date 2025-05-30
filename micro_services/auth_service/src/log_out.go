package src

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func Log_out(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Отримуємо id з запиту
	id := r.FormValue("id")
	if id == "" {
		http.Error(w, "ID is required", http.StatusBadRequest)
		return
	}

	// Читаємо дані з файлу
	file, err := os.ReadFile("db.json")
	if err != nil {
		http.Error(w, "Database file not found", http.StatusInternalServerError)
		return
	}

	var logins [][]interface{}
	err = json.Unmarshal(file, &logins)
	if err != nil {
		http.Error(w, "Error parsing database", http.StatusInternalServerError)
		return
	}

	// Шукаємо та видаляємо запис з вказаним id
	found := false
	newLogins := make([][]interface{}, 0, len(logins))
	for _, login := range logins {
		if len(login) >= 1 && login[0] == id {
			found = true
			continue // Пропускаємо цей запис (видаляємо його)
		}
		newLogins = append(newLogins, login)
	}

	// Якщо запис не знайдено
	if !found {
		fmt.Fprint(w, "0") // Повертаємо 0, якщо запису не існувало
		return
	}

	// Зберігаємо оновлені дані
	data, err := json.Marshal(newLogins)
	if err != nil {
		http.Error(w, "Error encoding data", http.StatusInternalServerError)
		return
	}

	err = os.WriteFile("db.json", data, 0644)
	if err != nil {
		http.Error(w, "Error writing to database", http.StatusInternalServerError)
		return
	}

	fmt.Fprint(w, "1") // Повертаємо 1 при успішному видаленні
}
