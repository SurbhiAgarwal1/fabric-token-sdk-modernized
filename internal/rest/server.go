package rest

import (
	"encoding/json"
	"fabric-token-sdk-modernized/internal/tokensdk"
	"fmt"
	"net/http"
)

type Server struct {
	Engine *tokensdk.Engine
}

func NewServer(engine *tokensdk.Engine) *Server {
	return &Server{Engine: engine}
}

func (s *Server) Start(port int) {
	mux := http.NewServeMux()

	// Endpoints
	mux.HandleFunc("/token/issue", s.enableCORS(s.handleIssue))
	mux.HandleFunc("/token/transfer", s.enableCORS(s.handleTransfer))
	mux.HandleFunc("/token/split", s.enableCORS(s.handleSplit))
	mux.HandleFunc("/token/merge", s.enableCORS(s.handleMerge))
	mux.HandleFunc("/wallet/balance", s.enableCORS(s.handleBalance))

	// Serve Frontend Static Files
	fs := http.FileServer(http.Dir("./frontend"))
	mux.Handle("/", fs)

	fmt.Printf("Fabric Token SDK Modernized API starting on :%d\n", port)
	fmt.Printf("Dashboard available at: http://localhost:%d\n", port)
	http.ListenAndServe(fmt.Sprintf(":%d", port), mux)
}

func (s *Server) enableCORS(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			return
		}
		h(w, r)
	}
}

func (s *Server) handleIssue(w http.ResponseWriter, r *http.Request) {
	meta, _ := s.Engine.ExecuteSimulatedFlow(tokensdk.Issue, 1000) // issue 1000 dynamically
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(meta)
}

func (s *Server) handleTransfer(w http.ResponseWriter, r *http.Request) {
	meta, _ := s.Engine.ExecuteSimulatedFlow(tokensdk.Transfer, 500)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(meta)
}

func (s *Server) handleSplit(w http.ResponseWriter, r *http.Request) {
	meta, _ := s.Engine.ExecuteSimulatedFlow(tokensdk.Split, 100)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(meta)
}

func (s *Server) handleMerge(w http.ResponseWriter, r *http.Request) {
	meta, _ := s.Engine.ExecuteSimulatedFlow(tokensdk.Merge, 450)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(meta)
}

func (s *Server) handleBalance(w http.ResponseWriter, r *http.Request) {
	balance := s.Engine.GetBalance()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(balance)
}
