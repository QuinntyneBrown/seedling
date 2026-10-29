using System.Text.Json.Serialization;
using Microsoft.OpenApi.Models;
using Seedling.Api.Middleware;
using Seedling.Application;
using Seedling.Infrastructure;
using Seedling.Infrastructure.Persistence;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    // The host owns its logger rather than reconfiguring the static bootstrap one, so a
    // host shutting down never closes another host's logger when the tests start several
    // in one process.
    builder.Host.UseSerilog((ctx, services, cfg) => cfg
        .ReadFrom.Configuration(ctx.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .WriteTo.File("logs/seedling-.log", rollingInterval: RollingInterval.Day),
        preserveStaticLogger: true);

    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(builder.Configuration);
    builder.Services.AddHttpContextAccessor();

    builder.Services.AddControllers()
        .AddJsonOptions(opt => opt.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(o => o.SwaggerDoc("v1", new OpenApiInfo { Title = "Seedling API", Version = "v1" }));

    var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
    builder.Services.AddCors(opt => opt.AddDefaultPolicy(p =>
    {
        if (corsOrigins.Length == 0)
            p.SetIsOriginAllowed(_ => builder.Environment.IsDevelopment()).AllowAnyHeader().AllowAnyMethod();
        else
            p.WithOrigins(corsOrigins).AllowAnyHeader().AllowAnyMethod();
    }));

    // Authentication: JWT bearer with a fallback policy so every endpoint requires a signed-in
    // caller unless it opts out with [AllowAnonymous]. Add the bearer scheme and the fallback
    // policy here when the Auth feature lands; keep Swagger and the exception middleware ahead
    // of them in the pipeline below.
    builder.Services.AddAuthentication();
    builder.Services.AddAuthorization();

    var app = builder.Build();

    if (DependencyInjection.UsesSqlite(app.Configuration))
    {
        if (app.Environment.IsProduction())
            throw new InvalidOperationException("The Sqlite provider is for development and tests only.");
        using var scope = app.Services.CreateScope();
        await scope.ServiceProvider.GetRequiredService<AppDbContext>().EnsureSqliteSchemaAsync();
    }

    // Request logging stays outside the exception middleware so handled statuses are logged.
    app.UseSerilogRequestLogging();
    app.UseMiddleware<ExceptionHandlingMiddleware>();

    if (!app.Environment.IsProduction())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.UseCors();
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    await app.RunAsync();
}
catch (Exception ex) when (ex is not HostAbortedException)
{
    Log.Fatal(ex, "Seedling API terminated unexpectedly");
    throw;
}
finally
{
    await Log.CloseAndFlushAsync();
}

/// <summary>Lets <c>WebApplicationFactory&lt;Program&gt;</c> boot the API in-process.</summary>
public partial class Program;
