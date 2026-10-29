using System.CommandLine;
using Seedling.Cli;

return await RootCommandFactory.Create().InvokeAsync(args);
