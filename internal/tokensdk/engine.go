package tokensdk

import (
	"fmt"
	"math/rand"
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
}

type Engine struct {
	ID string
}

func NewEngine(id string) *Engine {
	return &Engine{ID: id}
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

	meta := &OpMetadata{
		Action:         action,
		ZKPGenTime:     zkpTime,
		P2PTime:        p2pTime,
		FabricTime:     fabricTime,
		TotalLatency:   total,
		ProofSizeBytes: 1024 + rand.Intn(2048),
	}

	fmt.Printf("[%s] %s flow COMPLETED in %v\n", e.ID, action, total)
	return meta, nil
}
