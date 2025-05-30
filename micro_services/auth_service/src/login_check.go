package src

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

func Login_check(w http.ResponseWriter, r *http.Request) {
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

	// Шукаємо запис з вказаним id
	foundIndex := -1
	var loginTime time.Time
	for i, login := range logins {
		if len(login) >= 2 && login[0] == id {
			// Парсимо час з рядка
			timeStr, ok := login[1].(string)
			if !ok {
				continue
			}

			parsedTime, err := time.Parse(time.RFC3339, timeStr)
			if err != nil {
				continue
			}

			foundIndex = i
			loginTime = parsedTime
			break
		}
	}

	// Якщо запис не знайдено
	if foundIndex == -1 {
		fmt.Fprint(w, "0")
		return
	}

	// Перевіряємо чи пройшло більше 30 хвилин
	if time.Since(loginTime).Minutes() > 30 {
		// Видаляємо запис
		logins = append(logins[:foundIndex], logins[foundIndex+1:]...)

		// Зберігаємо оновлені дані
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

		fmt.Fprint(w, "0")
	} else {
		fmt.Fprint(w, "1")
	}
}
