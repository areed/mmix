package main

import (
	"log"
	"net/http"
)

func main() {
	// Simple static webserver:
	log.Fatal(http.ListenAndServe(":3000", http.FileServer(http.Dir("dist"))))
}
