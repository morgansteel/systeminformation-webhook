# systeminformation-webhook

## A JavaScript desktop application made with Electron to pull system information from a remote host ##

### Features ###

+ Will forward data to any webhook you prefer
+ Easy-to-read Discord message sent to your webhook
+ Anti-VM (upcoming)
+ AV Evasion (upcoming)
+ Streamlined error handling (upcoming)
+ Support for:
  
   + NetBSD
   + MacOS
   + FreeBSD
   + Android
   + NetBSD
   + Potentially other operating systems

+ Hardware polling time logging (upcoming)
+ Hardware temperature polling (CPU package, GPU junction, memory, VRMs, etc.) (upcoming)

### How it works ###

This application uses the systeminformation API (and more in the future) to pull hardware information from the operating system. It then writes to a JSON named `default.json` and modifies the entries in `embeds[].fields[].value` accordingly. Then a simple shell/Batch script using `curl` sends a POST request with said JSON to the webhook.

### Modify to POST to your own webhook ###

Simply edit the two template scripts and replace the `curl` destination with your own webhook URL.
