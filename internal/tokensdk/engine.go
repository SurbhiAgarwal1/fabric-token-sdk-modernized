package tokensdk

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

type TokenAction string

const (
	Issue    TokenAction = "ISSUE"
	Transfer TokenAction = "TRANSFER"
	Redeem   TokenAction = "REDEEM"
	Split    TokenAction = "SPLIT"
	Merge    TokenAction = "MERGE"
)

type OpMetadata struct {
	Action         TokenAction
	ZKPGenTime     time.Duration
	P2PTime        time.Duration
	FabricTime     time.Duration
	TotalLatency   time.Duration
	ProofSizeBytes int
	Details        string
}

type Engine struct {
	ID    string
	mu    sync.RWMutex
	state map[string]int
}

func NewEngine(id string) *Engine {
	return &Engine{
		ID: id,
		state: map[string]int{
			"USD-Token": 12500,
			"EUR-Token": 500,
		},
	}
}

func (e *Engine) GetBalance() map[string]int {
	e.mu.RLock()
	defer e.mu.RUnlock()
	// Return a copy
	res := make(map[string]int)
	for k, v := range e.state {
		res[k] = v
	}
	return res
}

func (e *Engine) ExecuteSimulatedFlow(action TokenAction, amount int) (*OpMetadata, error) {
	fmt.Printf("[%s] Starting %s flow for amount %d...\n", e.ID, action, amount)

	start := time.Now()
	zkpBase := 50
	if action == Transfer || action == Split {
		zkpBase = 120
	}
	time.Sleep(time.Duration(zkpBase+rand.Intn(50)) * time.Millisecond)
	zkpTime := time.Since(start)

	startP2P := time.Now()
	time.Sleep(time.Duration(30+rand.Intn(30)) * time.Millisecond)
	p2pTime := time.Since(startP2P)

	startFabric := time.Now()
	time.Sleep(time.Duration(200+rand.Intn(100)) * time.Millisecond)
	fabricTime := time.Since(startFabric)

	total := zkpTime + p2pTime + fabricTime

	// Update state to make the prototype feel real
	e.mu.Lock()
	details := ""
	switch action {
	case Issue:
		e.state["USD-Token"] += amount
		details = fmt.Sprintf("Issued %d USD-Token", amount)
	case Transfer:
		if e.state["USD-Token"] >= amount {
			e.state["USD-Token"] -= amount
			details = fmt.Sprintf("Transferred %d USD-Token (Privacy preserved)", amount)
		} else {
			details = "Transfer failed: Insufficient funds"
		}
	case Split:
		details = "Split UTXO completed (no net balance change)"
	case Merge:
		details = "Merged UTXOs (no net balance change)"
	}
	e.mu.Unlock()

	meta := &OpMetadata{
		Action:         action,
		ZKPGenTime:     zkpTime,
		P2PTime:        p2pTime,
		FabricTime:     fabricTime,
		TotalLatency:   total,
		ProofSizeBytes: 1024 + rand.Intn(2048),
		Details:        details,
	}

	fmt.Printf("[%s] %s flow COMPLETED in %v: %s\n", e.ID, action, total, details)
	return meta, nil
}
