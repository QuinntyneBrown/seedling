using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Seedling.Application.Behaviors;

namespace Seedling.Application;

public static class DependencyInjection
{
    /// <summary>
    /// Registers every MediatR handler and FluentValidation validator in this assembly, and the
    /// pipeline behaviours that run around each request. Feature services are registered here too,
    /// grouped by feature folder.
    /// </summary>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(assembly));
        services.AddValidatorsFromAssembly(assembly);
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        return services;
    }
}
