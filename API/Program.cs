using API.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddScoped<CpuChoiceService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Client", policy =>
    {   //Links to your front-end to grant permission to access the API!, Can specify your local or hosted websites!
        policy.WithOrigins("http://localhost:5500","http://127.0.0.1:5500","https://wonderful-stone-0eb28261e.4.azurestaticapps.net")
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});
// "Client" is refering toward the name of the frontEnd you need to have access to the API!

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("Client");

app.UseAuthorization();

app.MapControllers();

app.Run();
