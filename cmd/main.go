package main

import (
	"fabric-token-sdk-modernized/internal/rest"
	"fabric-token-sdk-modernized/internal/tokensdk"
	"flag"
	"fmt"
)

func main() {
	mode := flag.String("mode", "simulate", "Mode to run: 'server' or 'simulate'")
	flag.Parse()

	engine := tokensdk.NewEngine("Modernized-FSC-Node")

	if *mode == "simulate" {
		runSimulation(engine)
	} else {
		srv := rest.NewServer(engine)
		srv.Start(8080)
	}
}

func runSimulation(engine *tokensdk.Engine) {
	fmt.Println("=== FABRIC TOKEN SDK MODERNIZED SIMULATION ===")

	rounds := 3
	for i := 1; i <= rounds; i++ {
		fmt.Printf("\n--- Transaction %d ---\n", i)
		meta, _ := engine.ExecuteSimulatedFlow(tokensdk.Transfer, 100)
		fmt.Printf("Performance: ZKP=%v, Fabric=%v, Total=%v\n",
			meta.ZKPGenTime, meta.FabricTime, meta.TotalLatency)
	}
}
