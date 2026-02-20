9const monoLib = Process.getModuleByName('libmonosgen-2.0.so');

// Get all the Mono API functions
const mono_get_root_domain = new NativeFunction(
    monoLib.getExportByName('mono_get_root_domain'), 'pointer', []
);
const mono_thread_attach = new NativeFunction(
    monoLib.getExportByName('mono_thread_attach'), 'pointer', ['pointer']
);
const mono_assembly_foreach = new NativeFunction(
    monoLib.getExportByName('mono_assembly_foreach'), 'void', ['pointer', 'pointer']
);
const mono_assembly_get_image = new NativeFunction(
    monoLib.getExportByName('mono_assembly_get_image'), 'pointer', ['pointer']
);
const mono_image_get_name = new NativeFunction(
    monoLib.getExportByName('mono_image_get_name'), 'pointer', ['pointer']
);
const mono_class_from_name = new NativeFunction(
    monoLib.getExportByName('mono_class_from_name'), 'pointer', ['pointer', 'pointer', 'pointer']
);
const mono_class_get_method_from_name = new NativeFunction(
    monoLib.getExportByName('mono_class_get_method_from_name'), 'pointer', ['pointer', 'pointer', 'int']
);
const mono_compile_method = new NativeFunction(
    monoLib.getExportByName('mono_compile_method'), 'pointer', ['pointer']
);

// Attach to Mono runtime
const domain = mono_get_root_domain();
mono_thread_attach(domain);
console.log('[+] Attached to domain:', domain);

// Enumerate assemblies and find Assembly-CSharp
const assemblies = [];
const cb = new NativeCallback((assembly, user_data) => {
    assemblies.push(assembly);
}, 'void', ['pointer', 'pointer']);

mono_assembly_foreach(cb, ptr(0));

let targetImage = null;
assemblies.forEach(asm => {
    const image = mono_assembly_get_image(asm);
    const name = mono_image_get_name(image).readUtf8String();
    console.log('[Assembly]', name);

    if (name === 'Assembly-CSharp') {
        targetImage = image;
    }
});

if (!targetImage) {
    console.log('[-] Assembly-CSharp not found!');
} else {
    console.log('[+] Found Assembly-CSharp image:', targetImage);

    // Find the concrete class that implements the interface
    const klass = mono_class_from_name(
        targetImage,
        Memory.allocUtf8String('MyApp.Auth'),   // replace with your namespace
        Memory.allocUtf8String('AuthService')    // replace with your concrete class
    );

    if (klass.isNull()) {
        console.log('[-] Class not found!');
    } else {
        console.log('[+] Found class:', klass);

        // Find CheckPin method
        const method = mono_class_get_method_from_name(
            klass,
            Memory.allocUtf8String('CheckPin'),
            -1
        );

        if (method.isNull()) {
            console.log('[-] Method not found!');
        } else {
            console.log('[+] Found method:', method);

            // Compile to native and hook
            const nativePtr = mono_compile_method(method);
            console.log('[+] Native pointer:', nativePtr);

            Interceptor.attach(nativePtr, {
                onEnter(args) {
                    // args[0] = this
                    // args[1] = username
                    // args[2] = pin
                    const username = args[1].readUtf16String();
                    const pin = args[2].readUtf16String();
                    console.log('[+] CheckPin called');
                    console.log('    Username:', username);
                    console.log('    Pin:', pin);
                },
                onLeave(retval) {
                    console.log('    Result:', retval.toInt32());
                    // uncomment to force return true
                    // retval.replace(ptr(1));
                }
            });

            console.log('[+] CheckPin hooked successfully!');
        }
    }




const klass = mono_class_from_name(
    targetImage,
    Memory.allocUtf8String('YourNamespace'),
    Memory.allocUtf8String('AppPreferencesService')
);

const method = mono_class_get_method_from_name(
    klass,
    Memory.allocUtf8String('Set'),
    -1
);

const nativePtr = mono_compile_method(method);

Interceptor.attach(nativePtr, {
    onEnter(args) {
        const key = args[1].add(12).readUtf16String();
        console.log('[+] Set called with key:', key);

        if (key === 'IsLocked') {
            console.log('[!] Blocking IsLocked from being set!');
            // redirect to a dummy address or just nop it
            args[2] = ptr(0); // set value to false/null
        }
    }
});


// Decompiled with JetBrains decompiler
// Type: Maui.Ocs.App.Services.HttpService
// Assembly: Maui.Ocs.App, Version=3.0.1.0, Culture=neutral, PublicKeyToken=null
// MVID: B6F0EA97-2C26-404D-9DC8-BE68416FD575
// Assembly location: C:\Users\consultant\Desktop\output_dir\output_dir\Maui.Ocs.App.dll

using Maui.Ocs.App.Interfaces;
using Microsoft.Maui.Devices;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

#nullable enable
namespace Maui.Ocs.App.Services;

public class HttpService : IHttpService
{
  private readonly IHttpClientFactory _httpClientFactory;
  private readonly IUserSecureStorageService _userSecureStorageService;

  public HttpService(
    IHttpClientFactory httpClientFactory,
    IUserSecureStorageService userSecureStorageService)
  {
    this._httpClientFactory = httpClientFactory;
    this._userSecureStorageService = userSecureStorageService;
  }

  public async Task<HttpResponseMessage> CheckPin(string username, string pin)
  {
    Dictionary<string, string> data = new Dictionary<string, string>()
    {
      {
        "Pin",
        pin
      }
    };
    HttpClient clientWithUsername = await this.CreateClientWithUsername("OcsJsonApiClient", username);
    StringContent content = new StringContent(JsonSerializer.Serialize<Dictionary<string, string>>(data), Encoding.UTF8, "application/json");
    HttpResponseMessage httpResponseMessage;
    try
    {
      httpResponseMessage = await clientWithUsername.PostAsync("Login/CheckDevicePin", (HttpContent) content);
    }
    finally
    {
      content?.Dispose();
    }
    data = (Dictionary<string, string>) null;
    content = (StringContent) null;
    return httpResponseMessage;
  }

  public async Task<HttpResponseMessage> RegisterDevice(string username, string password)
  {
    Dictionary<string, string> data = new Dictionary<string, string>()
    {
      {
        "Username",
        username
      },
      {
        "Password",
        password
      },
      {
        "Platform",
        DeviceInfo.Platform.ToString()
      }
    };
    HttpClient clientWithNoToken = await this.CreateClientWithNoToken("OcsJsonApiClient");
    StringContent content = new StringContent(JsonSerializer.Serialize<Dictionary<string, string>>(data), Encoding.UTF8, "application/json");
    HttpResponseMessage httpResponseMessage;
    try
    {
      httpResponseMessage = await clientWithNoToken.PostAsync("Login/RegisterDevice", (HttpContent) content);
    }
    finally
    {
      content?.Dispose();
    }
    data = (Dictionary<string, string>) null;
    content = (StringContent) null;
    return httpResponseMessage;
  }

  public async Task<HttpResponseMessage> RegisterPin(string username, string pin)
  {
    Dictionary<string, string> data = new Dictionary<string, string>()
    {
      {
        "Pin",
        pin
      }
    };
    HttpClient clientWithUsername = await this.CreateClientWithUsername("OcsJsonApiClient", username);
    StringContent content = new StringContent(JsonSerializer.Serialize<Dictionary<string, string>>(data), Encoding.UTF8, "application/json");
    HttpResponseMessage httpResponseMessage;
    try
    {
      httpResponseMessage = await clientWithUsername.PostAsync("Login/RegisterPin", (HttpContent) content);
    }
    finally
    {
      content?.Dispose();
    }
    data = (Dictionary<string, string>) null;
    content = (StringContent) null;
    return httpResponseMessage;
  }

  public async Task<HttpResponseMessage> PostAsync(string url)
  {
    return await (await this.CreateClientWithSignedInUser("OcsJsonApiClient")).PostAsync(url, (HttpContent) null);
  }

  public async Task<HttpResponseMessage> PostAsync(string url, Dictionary<string, string> data)
  {
    HttpResponseMessage httpResponseMessage;
    using (StringContent content = new StringContent(JsonSerializer.Serialize<Dictionary<string, string>>(data), Encoding.UTF8, "application/json"))
      httpResponseMessage = await (await this.CreateClientWithSignedInUser("OcsJsonApiClient")).PostAsync(url, (HttpContent) content);
    return httpResponseMessage;
  }

  public async Task<HttpResponseMessage> PostXmlAsync(string url, string data)
  {
    HttpResponseMessage httpResponseMessage;
    using (StringContent content = new StringContent(data, Encoding.UTF8, "application/xml"))
      httpResponseMessage = await (await this.CreateClientWithSignedInUser("OcsXmlApiClient")).PostAsync(url, (HttpContent) content);
    return httpResponseMessage;
  }

  private async Task<HttpClient> CreateClientWithNoToken(string clientApiName)
  {
    HttpClient client = this._httpClientFactory.CreateClient(clientApiName);
    string str1 = Guid.NewGuid().ToString().Substring(0, 20);
    string str2 = (string) null;
    client.DefaultRequestHeaders.Add("INT_DEVICE", str1);
    client.DefaultRequestHeaders.Add("INT_TOKEN", str2);
    client.DefaultRequestHeaders.Add("INT_SYSTEM", "nma");
    return client;
  }

  private async Task<HttpClient> CreateClientWithSignedInUser(string clientApiName)
  {
    HttpClient client = this._httpClientFactory.CreateClient(clientApiName);
    string signedInUserDevice = await this._userSecureStorageService.GetAsync("Device");
    string async = await this._userSecureStorageService.GetAsync("Token");
    client.DefaultRequestHeaders.Add("INT_DEVICE", signedInUserDevice);
    client.DefaultRequestHeaders.Add("INT_TOKEN", async);
    client.DefaultRequestHeaders.Add("INT_SYSTEM", "nma");
    HttpClient withSignedInUser = client;
    client = (HttpClient) null;
    signedInUserDevice = (string) null;
    return withSignedInUser;
  }

  private async Task<HttpClient> CreateClientWithUsername(string clientApiName, string username)
  {
    HttpClient client = this._httpClientFactory.CreateClient(clientApiName);
    string device = await this._userSecureStorageService.GetDevice(username);
    string token = await this._userSecureStorageService.GetToken(username);
    client.DefaultRequestHeaders.Add("INT_DEVICE", device);
    client.DefaultRequestHeaders.Add("INT_TOKEN", token);
    client.DefaultRequestHeaders.Add("INT_SYSTEM", "nma");
    HttpClient clientWithUsername = client;
    client = (HttpClient) null;
    device = (string) null;
    return clientWithUsername;
  }
}
