# Build minimal Go binary
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod ./
# Add go.sum if present, though likely absent in this proto
# COPY go.sum ./
# RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o fsc-modernized cmd/main.go

# Serve from tiny alpine image
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/fsc-modernized .
COPY --from=builder /app/frontend ./frontend

EXPOSE 8080
CMD ["./fsc-modernized", "-mode", "server"]
