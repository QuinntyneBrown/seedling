# Seedling Worker container.
#
# Build from the *backend* directory so the central build props and all
# referenced projects are in context:
#
#   cd backend
#   docker build -f src/Seedling.Worker/Dockerfile -t seedling-worker .
#
# Run as a long-lived daemon:
#
#   docker run --rm -e SEEDLING_CONNECTION="Server=...;Database=Seedling;..." seedling-worker
#
# Or as a one-shot job (a Kubernetes CronJob / Azure Container Apps Job owns the cadence):
#
#   docker run --rm -e SEEDLING_CONNECTION="..." -e Seedling__<Job>__Schedule__RunOnceThenExit=true seedling-worker
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY global.json Directory.Build.props Directory.Packages.props ./
COPY src/ src/
RUN dotnet restore src/Seedling.Worker/Seedling.Worker.csproj
RUN dotnet publish src/Seedling.Worker/Seedling.Worker.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/runtime:10.0 AS final
WORKDIR /app
COPY --from=build /app ./
ENTRYPOINT ["dotnet", "Seedling.Worker.dll"]
