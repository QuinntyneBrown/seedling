using Microsoft.Extensions.Hosting;
using Seedling.Infrastructure;

var builder = Host.CreateApplicationBuilder(args);

// Same composition as the API for persistence and configuration. Register one
// hosted service per scheduled job here (`builder.Services.AddHostedService<...>()`);
// each owns its cron schedule under `Seedling:<Job>:Schedule` and honours
// `RunOnceThenExit` so the same binary runs as a daemon or a one-shot job.
builder.Services.AddInfrastructure(builder.Configuration);

var host = builder.Build();
await host.RunAsync();
